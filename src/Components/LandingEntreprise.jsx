/* eslint-disable react/no-unescaped-entities */
import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaList, FaTh, FaHeart, FaRegHeart } from 'react-icons/fa';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Material UI components
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
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';

import styles from './LandingEntreprise.module.css';

// Import des services API
import {
  getAllConsultants,
  getAllDomaines,
  getAllCompetences,
  getPublishedMissionsForEntreprise,
  inviteConsultantToJob
} from '../services/LandingEntreprise';
import { createConversation } from '../services/MessengerService';

// Création du thème Material‑UI
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

  // États pour les données
  const [consultants, setConsultants] = useState([]);
  const [domaines, setDomaines] = useState([]);
  const [competences, setCompetences] = useState([]);
  const [categories, setCategories] = useState([]);
  const [missionsEntreprise, setMissionsEntreprise] = useState([]); // missions publiées par l'entreprise

  // États pour l'UI et filtres
  const [isLoading, setIsLoading] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedDomain, setSelectedDomain] = useState('');
  const [selectedCompetence, setSelectedCompetence] = useState('');
  const [location, setLocation] = useState('');
  const [hourlyRateRange, setHourlyRateRange] = useState([0, 100]);
  const [sortOption, setSortOption] = useState('');
  const [viewMode, setViewMode] = useState('list');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const [favoriteConsultants, setFavoriteConsultants] = useState([]);
  const [showOnlyFavorites, setShowOnlyFavorites] = useState(false);

  // Drawer pour profil consultant
  const [openProfileDrawer, setOpenProfileDrawer] = useState(false);
  const [selectedConsultant, setSelectedConsultant] = useState(null);

  // États pour la modal d'invitation
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [selectedConsultantForInvite, setSelectedConsultantForInvite] = useState(null);
  const [selectedMissionForInvite, setSelectedMissionForInvite] = useState(null);
  const [inviteMontant, setInviteMontant] = useState('');
  const [inviteDuree, setInviteDuree] = useState('');
  const [inviteMessage, setInviteMessage] = useState('');

  // Chargement initial des consultants, domaines, compétences
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

  // Extraction des catégories à partir des domaines
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

  // Charger les missions publiées par l'entreprise connectée
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    const entrepriseId = storedUser?.user?.id || storedUser?.id;
    if (!entrepriseId) {
      toast.error("Entreprise introuvable");
      return;
    }
    getPublishedMissionsForEntreprise(entrepriseId)
      .then(data => {
        setMissionsEntreprise(data);
      })
      .catch(error => {
        console.error("Erreur lors du chargement des missions publiées:", error);
      });
  }, []);

  // Filtrage des consultants (useMemo)
  const filteredConsultants = useMemo(() => {
    return consultants.filter((c) => {
      if (showOnlyFavorites && !favoriteConsultants.includes(c.id)) return false;
      const kw = searchKeyword.toLowerCase();
      const matchKeyword =
        !kw ||
        c.nom?.toLowerCase().includes(kw) ||
        c.prenom?.toLowerCase().includes(kw) ||
        c.adresse?.toLowerCase().includes(kw) ||
        c.domaines?.some(d => d.nom?.toLowerCase().includes(kw)) ||
        c.competences?.some(comp => comp.nom?.toLowerCase().includes(kw));
      let matchCategory = true;
      if (selectedCategory) {
        matchCategory = c.domaines?.some(d => d.category?.toLowerCase() === selectedCategory.toLowerCase());
      }
      let matchDomain = true;
      if (selectedDomain) {
        matchDomain = c.domaines?.some(d => d.nom?.toLowerCase() === selectedDomain.toLowerCase());
      }
      let matchCompetence = true;
      if (selectedCompetence) {
        matchCompetence = c.competences?.some(comp => comp.nom?.toLowerCase() === selectedCompetence.toLowerCase());
      }
      const matchLocation =
        !location ||
        c.adresse?.toLowerCase().includes(location.toLowerCase()) ||
        c.nom?.toLowerCase().includes(location.toLowerCase());
      const [minRate, maxRate] = hourlyRateRange;
      const cRate = Number(c.taux_horaire) || 0;
      const matchRate = cRate >= minRate && cRate <= maxRate;
      return matchKeyword && matchCategory && matchDomain && matchCompetence && matchLocation && matchRate;
    });
  }, [consultants, searchKeyword, selectedCategory, selectedDomain, selectedCompetence, location, hourlyRateRange, showOnlyFavorites, favoriteConsultants]);

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

  const totalPages = Math.ceil(sortedConsultants.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentPageConsultants = sortedConsultants.slice(startIndex, startIndex + itemsPerPage);

  // Fonctions d'ouverture/fermeture de profil
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
      if (prev.includes(consultantId)) return prev.filter((id) => id !== consultantId);
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

  const handleChat = async (consultant) => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      const senderEmail = user?.email;
      const receiverEmail = consultant.email;
      if (!senderEmail || !receiverEmail) {
        toast.error("Email manquant pour démarrer le chat.");
        return;
      }
      const conversation = await createConversation(senderEmail, receiverEmail);
      toast.success("Conversation créée !");
      navigate('/messenger', { state: { conversation, consultant } });
    } catch (error) {
      toast.error("Erreur lors de la création de la conversation.");
      console.error("Erreur dans handleChat:", error);
    }
  };

  // Gérer l'invitation d'un consultant à une mission
  const handleInviteClick = (consultant) => {
    setSelectedConsultantForInvite(consultant);
    setShowInviteModal(true);
  };

  const handleCloseInviteModal = () => {
    setShowInviteModal(false);
    setSelectedConsultantForInvite(null);
    setSelectedMissionForInvite(null);
    setInviteMessage('');
    setInviteMontant('');
    setInviteDuree('');
  };

  const handleSubmitInvite = () => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    const entrepriseId = storedUser?.user?.id || storedUser?.id;
    if (!entrepriseId) {
      toast.error("Entreprise introuvable");
      return;
    }
    if (!selectedMissionForInvite) {
      toast.error("Veuillez sélectionner une mission");
      return;
    }
    const propositionData = {
      consultant: { id: selectedConsultantForInvite.id },
      mission: { id: selectedMissionForInvite.id },
      montant: parseFloat(inviteMontant),
      dureeEstime: inviteDuree,
      message: inviteMessage,
      statut: "PENDING",
      origine: "INVITED" // Cette origine déclenchera l'envoi d'un email et d'une notification côté backend
    };
    inviteConsultantToJob(entrepriseId, selectedConsultantForInvite.id, propositionData)
      .then(() => {
        toast.success("Invitation envoyée ! Un email et une notification ont été envoyés au consultant.");
        handleCloseInviteModal();
      })
      .catch(error => {
        toast.error("Erreur lors de l'envoi de l'invitation.");
        console.error("Erreur dans handleSubmitInvite:", error);
      });
  };

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
            placeholder="Rechercher un consultant (nom, adresse, domaine, compétence...)"
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
            <Select
              displayEmpty
              variant="outlined"
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
              style={{ marginRight: '1rem' }}
              renderValue={(value) => {
                if (value === "") return <span style={{ color: "#aaa" }}>Aucun</span>;
                const found = SORT_OPTIONS.find(opt => opt.value === value);
                return found ? found.label : value;
              }}
            >
              {SORT_OPTIONS.map((opt) => (
                <MenuItem key={opt.value} value={opt.value}>
                  {opt.label}
                </MenuItem>
              ))}
            </Select>
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
          <motion.aside
            className={styles.filters}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <h3>Filtrer par</h3>
            <div className={styles.filterGroup}>
              <label>Catégorie</label>
              <Select
                displayEmpty
                fullWidth
                variant="outlined"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                renderValue={(value) => {
                  if (value === "") return <span style={{ color: "#aaa" }}>Aucune</span>;
                  return value;
                }}
              >
                <MenuItem value="">
                  <em>Aucune</em>
                </MenuItem>
                {categories.map((cat) => (
                  <MenuItem key={cat} value={cat}>
                    {cat}
                  </MenuItem>
                ))}
              </Select>
            </div>
            <div className={styles.filterGroup}>
              <label>Domaine</label>
              <Select
                displayEmpty
                fullWidth
                variant="outlined"
                value={selectedDomain}
                onChange={(e) => setSelectedDomain(e.target.value)}
                renderValue={(value) => {
                  if (value === "") return <span style={{ color: "#aaa" }}>Aucun</span>;
                  return value;
                }}
              >
                <MenuItem value="">
                  <em>Aucun</em>
                </MenuItem>
                {domaines.map((dom) => (
                  <MenuItem key={dom.id} value={dom.nom}>
                    {dom.nom}
                  </MenuItem>
                ))}
              </Select>
            </div>
            <div className={styles.filterGroup}>
              <label>Compétence</label>
              <Select
                displayEmpty
                fullWidth
                variant="outlined"
                value={selectedCompetence}
                onChange={(e) => setSelectedCompetence(e.target.value)}
                renderValue={(value) => {
                  if (value === "") return <span style={{ color: "#aaa" }}>Aucune</span>;
                  return value;
                }}
              >
                <MenuItem value="">
                  <em>Aucune</em>
                </MenuItem>
                {competences.map((c) => (
                  <MenuItem key={c.id} value={c.nom}>
                    {c.nom}
                  </MenuItem>
                ))}
              </Select>
            </div>
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
                      <MUITooltip title="Invite to Job" arrow>
                        <Button variant="contained" size="small" color="secondary" onClick={() => handleInviteClick(consultant)}>
                          Invite to Job
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

        {/* Modal d'invitation */}
        {showInviteModal && (
          <Dialog open={true} onClose={handleCloseInviteModal}>
            <DialogTitle>
              Inviter {selectedConsultantForInvite && `${selectedConsultantForInvite.nom} ${selectedConsultantForInvite.prenom}`} à une mission
            </DialogTitle>
            <DialogContent>
              <Select
                fullWidth
                value={selectedMissionForInvite ? selectedMissionForInvite.id : ''}
                onChange={(e) => {
                  const mission = missionsEntreprise.find(m => m.id === e.target.value);
                  setSelectedMissionForInvite(mission);
                }}
              >
                {missionsEntreprise.map((mission) => (
                  <MenuItem key={mission.id} value={mission.id}>
                    {mission.titre}
                  </MenuItem>
                ))}
              </Select>
              <TextField
                margin="dense"
                label="Montant proposé"
                type="number"
                fullWidth
                value={inviteMontant}
                onChange={(e) => setInviteMontant(e.target.value)}
              />
              <TextField
                margin="dense"
                label="Durée estimée"
                type="text"
                fullWidth
                value={inviteDuree}
                onChange={(e) => setInviteDuree(e.target.value)}
                helperText="Ex: 3 mois"
              />
              <TextField
                margin="dense"
                label="Votre message"
                type="text"
                fullWidth
                multiline
                rows={3}
                value={inviteMessage}
                onChange={(e) => setInviteMessage(e.target.value)}
                helperText="Expliquez brièvement votre proposition"
              />
              <Typography variant="body2" color="textSecondary" style={{ marginTop: '0.5rem' }}>
                Une fois l'invitation envoyée, un email et une notification seront automatiquement envoyés au consultant.
              </Typography>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseInviteModal} color="primary">
                Annuler
              </Button>
              <Button onClick={handleSubmitInvite} color="primary">
                Envoyer l'invitation
              </Button>
            </DialogActions>
          </Dialog>
        )}
      </div>
    </ThemeProvider>
  );
}

function getExperienceLabel(experienceYears) {
  if (!experienceYears || experienceYears < 1) return 'Débutant';
  if (experienceYears < 3) return 'Intermédiaire';
  return 'Expert';
}

export default LandingEntreprise;
