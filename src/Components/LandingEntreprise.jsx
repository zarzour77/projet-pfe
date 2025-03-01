import  { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaList, FaTh, FaHeart, FaRegHeart } from 'react-icons/fa';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Material UI
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import MUITooltip from '@mui/material/Tooltip';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import Slider from '@mui/material/Slider';
import Typography from '@mui/material/Typography';
import LinearProgress from '@mui/material/LinearProgress';
import Rating from '@mui/material/Rating';
import Drawer from '@mui/material/Drawer';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';

// Import du CSS (personnalisé)
import styles from './LandingEntreprise.module.css';

// Import des services
import {
  getAllConsultants,
  getAllDomaines,
  getAllCompetences
} from '../Services/LandingEntreprise';
import { createConversation } from '../services/MessengerService';

// Thème Material UI
const theme = createTheme({
  palette: {
    primary: { main: "#009990" },
    secondary: { main: "#074799" },
    background: { default: "#E1FFBB" },
    text: { primary: "#001A6E" }
  },
  typography: { fontFamily: "Arial, sans-serif" },
});

// Options de tri
const SORT_OPTIONS = [
  { value: '', label: 'Aucun' },
  { value: 'hourlyRate', label: 'Trier par Taux Horaire' },
  { value: 'experienceYears', label: 'Trier par Expérience (Années)' },
  { value: 'rating', label: 'Trier par Rating' },
  { value: 'jobSuccess', label: 'Trier par Taux de réussite' },
];

function LandingEntreprise() {
  const navigate = useNavigate();

  // États pour les données de l'API
  const [consultants, setConsultants] = useState([]);
  const [domaines, setDomaines] = useState([]);       
  const [competences, setCompetences] = useState([]);

  // Extraction des catégories depuis la liste des domaines
  const [categories, setCategories] = useState([]);
 
  // États pour l'UI
  const [isLoading, setIsLoading] = useState(false);

  // Filtres
  const [searchKeyword, setSearchKeyword] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedDomain, setSelectedDomain] = useState('');
  const [selectedCompetence, setSelectedCompetence] = useState('');
  const [location, setLocation] = useState('');
  const [hourlyRateRange, setHourlyRateRange] = useState([0, 100]);
  const [sortOption, setSortOption] = useState('');

  // Vue liste / grille
  const [viewMode, setViewMode] = useState('list');

  // Pagination
  const itemsPerPage = 5;
  const [currentPage, setCurrentPage] = useState(1);

  // Drawer pour profil
  const [openProfileDrawer, setOpenProfileDrawer] = useState(false);
  const [selectedConsultant, setSelectedConsultant] = useState(null);

  // Favoris
  const [favoriteConsultants, setFavoriteConsultants] = useState([]);
  const [showOnlyFavorites, setShowOnlyFavorites] = useState(false);

  // Récupération des données
  useEffect(() => {
    setIsLoading(true);
    Promise.all([
      getAllConsultants(),
      getAllDomaines(),
      getAllCompetences(),
    ])
      .then(([consultantsData, domainesData, competencesData]) => {
        setConsultants(consultantsData || []);
        setDomaines(domainesData || []);
        setCompetences(competencesData || []);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setIsLoading(false);
      });
  }, []);

  // Extraction des catégories depuis la liste "domaines"
  useEffect(() => {
    if (!domaines.length) {
      setCategories([]);
      return;
    }
    const catSet = new Set();
    domaines.forEach((d) => {
      if (d.category) catSet.add(d.category);
    });
    setCategories(Array.from(catSet));
  }, [domaines]);

  // Utilitaire pour afficher le label d'expérience
  function getExperienceLabel(experienceYears) {
    if (!experienceYears || experienceYears < 1) return 'Débutant';
    if (experienceYears < 3) return 'Intermédiaire';
    return 'Expert';
  }

  const handleOpenProfile = (consultant) => {
    setSelectedConsultant(consultant);
    setOpenProfileDrawer(true);
  };

  const handleCloseProfile = () => {
    setSelectedConsultant(null);
    setOpenProfileDrawer(false);
  };

  const handleHourlyRateChange = (e, newValue) => {
    setHourlyRateRange(newValue);
  };

  const toggleFavorite = (consultantId) => {
    setFavoriteConsultants((prev) => {
      if (prev.includes(consultantId)) {
        return prev.filter((id) => id !== consultantId);
      }
      return [...prev, consultantId];
    });
  };

  const handleContact = (consultant) => {
    toast.info(`Contact en cours avec ${consultant.nom}...`);
  };

  const clearFilters = () => {
    setSearchKeyword('');
    setSelectedCategory('');
    setSelectedDomain('');
    setSelectedCompetence('');
    setLocation('');
    setHourlyRateRange([0, 100]);
    setSortOption('');
    setShowOnlyFavorites(false);
    setCurrentPage(1);
  };

  const handlePrevPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNextPage = (totalPages) => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  // Gestionnaire pour démarrer le chat et rediriger vers Messenger
  const handleChat = async (consultant) => {
    try {
      const user = JSON.parse(localStorage.getItem("userWithToken"));
      const senderEmail = user?.email;
      const receiverEmail = consultant.email; // Vérifiez que l'objet consultant contient bien l'email
      if (!senderEmail || !receiverEmail) {
        toast.error("Email manquant pour démarrer le chat.");
        return;
      }
      // Crée la conversation et récupère ses détails
      const conversation = await createConversation(senderEmail, receiverEmail);
      toast.success("Conversation créée !");
      // Redirection vers la page Messenger en passant la conversation et le consultant dans le state
      navigate('/messenger', { state: { conversation, consultant } });
    } catch (error) {
      toast.error("Erreur lors de la création de la conversation.");
      console.error("Erreur dans handleChat:", error);
    }
  };

  // Filtrage optimisé avec useMemo
  const filteredConsultants = useMemo(() => {
    return consultants.filter((c) => {
      // Filtre "Favoris uniquement"
      if (showOnlyFavorites && !favoriteConsultants.includes(c.id)) {
        return false;
      }
      
      // Recherche globale (nom, prénom, adresse)
      const kw = searchKeyword.toLowerCase();
      const matchKeyword =
        !kw ||
        c.nom?.toLowerCase().includes(kw) ||
        c.prenom?.toLowerCase().includes(kw) ||
        c.adresse?.toLowerCase().includes(kw);

      // Filtre catégorie
      let matchCategory = true;
      if (selectedCategory) {
        matchCategory = c.domaines?.some((d) =>
          d.category?.toLowerCase() === selectedCategory.toLowerCase()
        );
      }

      // Filtre domaine
      let matchDomain = true;
      if (selectedDomain) {
        matchDomain = c.domaines?.some((d) =>
          d.nom?.toLowerCase() === selectedDomain.toLowerCase()
        );
      }

      // Filtre compétence
      let matchCompetence = true;
      if (selectedCompetence) {
        matchCompetence = c.competences?.some((comp) =>
          comp.nom?.toLowerCase() === selectedCompetence.toLowerCase()
        );
      }

      // Localisation
      const matchLocation =
        !location ||
        c.adresse?.toLowerCase().includes(location.toLowerCase()) ||
        c.nom?.toLowerCase().includes(location.toLowerCase());

      // Taux horaire (conversion en nombre)
      const [minRate, maxRate] = hourlyRateRange;
      const cRate = Number(c.taux_horaire) || 0;
      const matchRate = cRate >= minRate && cRate <= maxRate;

      return (
        matchKeyword &&
        matchCategory &&
        matchDomain &&
        matchCompetence &&
        matchLocation &&
        matchRate
      );
    });
  }, [
    consultants,
    searchKeyword,
    selectedCategory,
    selectedDomain,
    selectedCompetence,
    location,
    hourlyRateRange,
    showOnlyFavorites,
    favoriteConsultants,
  ]);

  // Tri local
  const sortedConsultants = useMemo(() => {
    const sorted = [...filteredConsultants];
    if (sortOption === 'hourlyRate') {
      sorted.sort((a, b) => (Number(a.taux_horaire) || 0) - (Number(b.taux_horaire) || 0));
    } else if (sortOption === 'experienceYears') {
      sorted.sort((a, b) => (b.experienceYears || 0) - (a.experienceYears || 0));
    } else if (sortOption === 'rating') {
      sorted.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    } else if (sortOption === 'jobSuccess') {
      sorted.sort((a, b) => ((b.rating || 0) * 20) - ((a.rating || 0) * 20));
    }
    return sorted;
  }, [filteredConsultants, sortOption]);

  // Pagination
  const totalPages = Math.ceil(sortedConsultants.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentPageConsultants = sortedConsultants.slice(startIndex, startIndex + itemsPerPage);

  return (
    <ThemeProvider theme={theme}>
      <div className={styles.landingContainer}>
        <ToastContainer />

        {/* Barre de recherche globale */}
        <motion.div
          className={styles.globalSearchBar}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Rechercher un consultant (nom, adresse...)"
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
          />
        </motion.div>

        {/* Barre de contrôle */}
        <motion.div
          className={styles.controlsBar}
          initial={{ y: -20 }}
          animate={{ y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className={styles.leftActions}>
            {/* Sélecteur de tri */}
            <Select
              variant="outlined"
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
              style={{ marginRight: '1rem' }}
            >
              {SORT_OPTIONS.map((opt) => (
                <MenuItem key={opt.value} value={opt.value}>
                  {opt.label}
                </MenuItem>
              ))}
            </Select>

            {/* Favoris uniquement */}
            <FormControlLabel
              control={
                <Checkbox
                  checked={showOnlyFavorites}
                  onChange={(e) => setShowOnlyFavorites(e.target.checked)}
                  color="primary"
                />
              }
              label="Favoris"
            />
          </div>

          <div className={styles.rightActions}>
            <Button variant="contained" onClick={clearFilters}>
              Effacer Filtres
            </Button>
            <div className={styles.viewToggle}>
              <button
                onClick={() => setViewMode('list')}
                className={viewMode === 'list' ? styles.active : ''}
              >
                <FaList />
              </button>
              <button
                onClick={() => setViewMode('grid')}
                className={viewMode === 'grid' ? styles.active : ''}
              >
                <FaTh />
              </button>
            </div>
          </div>
        </motion.div>

        <div className={styles.mainContent}>
          {/* Panneau de filtres */}
          <motion.aside
            className={styles.filters}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <h3>Filtrer par</h3>

            {/* Catégorie */}
            <div className={styles.filterGroup}>
              <label>Catégorie</label>
              <Select
                fullWidth
                variant="outlined"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                <MenuItem value="">Toutes</MenuItem>
                {categories.map((cat) => (
                  <MenuItem key={cat} value={cat}>
                    {cat}
                  </MenuItem>
                ))}
              </Select>
            </div>

            {/* Domaine */}
            <div className={styles.filterGroup}>
              <label>Domaine</label>
              <Select
                fullWidth
                variant="outlined"
                value={selectedDomain}
                onChange={(e) => setSelectedDomain(e.target.value)}
              >
                <MenuItem value="">Tous</MenuItem>
                {domaines.map((dom) => (
                  <MenuItem key={dom.id} value={dom.nom}>
                    {dom.nom}
                  </MenuItem>
                ))}
              </Select>
            </div>

            {/* Compétence */}
            <div className={styles.filterGroup}>
              <label>Compétence</label>
              <Select
                fullWidth
                variant="outlined"
                value={selectedCompetence}
                onChange={(e) => setSelectedCompetence(e.target.value)}
              >
                <MenuItem value="">Toutes</MenuItem>
                {competences.map((c) => (
                  <MenuItem key={c.id} value={c.nom}>
                    {c.nom}
                  </MenuItem>
                ))}
              </Select>
            </div>

            {/* Localisation */}
            <div className={styles.filterGroup}>
              <label>Localisation</label>
              <TextField
                fullWidth
                variant="outlined"
                placeholder="Ex: Paris"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </div>

            {/* Taux horaire */}
            <div className={styles.filterGroup}>
              <label>Taux horaire ($/h)</label>
              <div className={styles.sliderContainer}>
                <Typography variant="body2">
                  {`$${hourlyRateRange[0]} - $${hourlyRateRange[1]}`}
                </Typography>
                <Slider
                  value={hourlyRateRange}
                  onChange={handleHourlyRateChange}
                  valueLabelDisplay="auto"
                  min={0}
                  max={100}
                  step={5}
                />
              </div>
            </div>
          </motion.aside>

          {/* Liste des consultants */}
          <section className={styles.talentList}>
            {isLoading ? (
              <p>Chargement...</p>
            ) : currentPageConsultants.length === 0 ? (
              <div className={styles.noResults}>
                <p>Aucun consultant trouvé.</p>
              </div>
            ) : (
              currentPageConsultants.map((consultant, index) => {
                const ratingValue = consultant.rating || 0;
                const jobSuccessValue = parseInt(ratingValue * 20);
                let expLabel = 'Débutant';
                if (consultant.experienceYears && consultant.experienceYears >= 1) {
                  if (consultant.experienceYears < 3) expLabel = 'Intermédiaire';
                  else expLabel = 'Expert';
                }
                return (
                  <motion.div
                    key={consultant.id}
                    className={`${styles.talentItem} ${viewMode === 'grid' ? styles.gridItem : ''}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    whileHover={{ scale: 1.02 }}
                    onClick={() => handleOpenProfile(consultant)}
                  >
                    {/* Icône favori */}
                    <div
                      className={styles.favoriteIcon}
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleFavorite(consultant.id);
                      }}
                    >
                      {favoriteConsultants.includes(consultant.id) ? (
                        <FaHeart style={{ color: 'red' }} />
                      ) : (
                        <FaRegHeart />
                      )}
                    </div>

                    <div className={styles.talentHeader}>
                      <img
                        src={consultant.photoprofile || 'https://via.placeholder.com/50'}
                        alt={`${consultant.nom || ''} ${consultant.prenom || ''}`}
                        className={styles.profilePic}
                      />
                      <div>
                        <h2>{consultant.nom} {consultant.prenom}</h2>
                        <Rating
                          name={`rating-${consultant.id}`}
                          value={ratingValue}
                          precision={0.5}
                          readOnly
                          size="small"
                        />
                      </div>
                    </div>

                    <div className={styles.talentInfo}>
                      <span>{expLabel}</span>
                      <span>{consultant.adresse || 'Localisation inconnue'}</span>
                      <span>${Number(consultant.taux_horaire) || 0}/h</span>
                    </div>

                    <MUITooltip title={`Job Success: ${jobSuccessValue}%`} arrow>
                      <LinearProgress
                        variant="determinate"
                        value={jobSuccessValue}
                        style={{ width: '100%', height: '8px', borderRadius: '4px' }}
                      />
                    </MUITooltip>

                    <div className={styles.talentSkills}>
                      {consultant.domaines?.map((dom) => (
                        <span key={dom.id} className={styles.skillTag}>
                          {dom.nom}
                        </span>
                      ))}
                    </div>

                    <div className={styles.talentSkills}>
                      {consultant.competences?.map((comp) => (
                        <span key={comp.id} className={styles.skillTag}>
                          {comp.nom}
                        </span>
                      ))}
                    </div>

                    <p className={styles.talentBio}>
                      {consultant.statut || 'Disponible'}
                    </p>

                    <div className={styles.actionButtons} onClick={(e) => e.stopPropagation()}>
                      <MUITooltip title="Voir le profil" arrow>
                        <Button variant="contained" size="small" onClick={() => handleOpenProfile(consultant)}>
                          Profil
                        </Button>
                      </MUITooltip>
                      <MUITooltip title="Contacter" arrow>
                        <Button variant="outlined" size="small" onClick={() => handleContact(consultant)}>
                          Contacter
                        </Button>
                      </MUITooltip>
                      <MUITooltip title="Chat" arrow>
                        <Button variant="contained" size="small" color="secondary" onClick={() => handleChat(consultant)}>
                          Chat
                        </Button>
                      </MUITooltip>
                    </div>
                  </motion.div>
                );
              })
            )}

            {sortedConsultants.length > itemsPerPage && (
              <div className={styles.pagination}>
                <Button
                  variant="outlined"
                  onClick={handlePrevPage}
                  disabled={currentPage === 1}
                  style={{ marginRight: '1rem' }}
                >
                  Précédent
                </Button>
                <span>
                  Page {currentPage} / {totalPages}
                </span>
                <Button
                  variant="outlined"
                  onClick={() => handleNextPage(totalPages)}
                  disabled={currentPage === totalPages}
                  style={{ marginLeft: '1rem' }}
                >
                  Suivant
                </Button>
              </div>
            )}
          </section>
        </div>

        {/* Drawer pour profil détaillé */}
        <Drawer
          anchor="right"
          open={openProfileDrawer}
          onClose={handleCloseProfile}
          transitionDuration={400}
          PaperProps={{
            style: {
              width: '50%',
              maxWidth: '100%',
              padding: '1rem',
            }
          }}
        >
          {selectedConsultant && (
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ duration: 0.4 }}
            >
              <h2>{selectedConsultant.nom} {selectedConsultant.prenom}</h2>
              <Rating
                name={`rating-modal-${selectedConsultant.id}`}
                value={selectedConsultant.rating || 0}
                precision={0.5}
                readOnly
              />
              <p><strong>Adresse :</strong> {selectedConsultant.adresse}</p>
              <p><strong>Taux horaire :</strong> ${Number(selectedConsultant.taux_horaire) || 0}/h</p>
              <p><strong>Expérience (années) :</strong> {selectedConsultant.experienceYears || 0}</p>
              <p><strong>Niveau :</strong> {getExperienceLabel(selectedConsultant.experienceYears)}</p>

              <h4>Domaines :</h4>
              <ul>
                {selectedConsultant.domaines?.map((dom) => (
                  <li key={dom.id}>{dom.nom} (cat: {dom.category})</li>
                ))}
              </ul>

              <h4>Compétences :</h4>
              <ul>
                {selectedConsultant.competences?.map((comp) => (
                  <li key={comp.id}>{comp.nom}</li>
                ))}
              </ul>

              <div style={{ marginTop: '1rem' }}>
                <Button variant="contained" onClick={handleCloseProfile}>
                  Fermer
                </Button>
              </div>
            </motion.div>
          )}
        </Drawer>
      </div>
    </ThemeProvider>
  );
}

export default LandingEntreprise;