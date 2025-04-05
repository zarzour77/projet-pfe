/* eslint-disable react/no-unescaped-entities */
import  { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaList, FaTh} from 'react-icons/fa';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Material‑UI components
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import MUITooltip from '@mui/material/Tooltip';
import Slider from '@mui/material/Slider';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';

import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Box from '@mui/material/Box';

// Services et utilitaires
import ProfileViewService from '../Services/ProfileViewService';
import {
  getAllConsultants,
  getAllDomaines,
  getAllCompetences,
  getPublishedMissionsForEntreprise,
  inviteConsultantToJob
} from '../Services/LandingEntreprise';
import { createConversation } from '../services/MessengerService';
import { getById } from '../Services/LandingEntreprise';

import styles from './LandingEntreprise.module.css';

// Import des images de badge
import RisingTalent from '../assets/icons/RisingTalent.svg';
import TopRated from '../assets/icons/TopRated.svg';
import TopRatedPlus from '../assets/icons/TopRatedPlus.svg';
import ExpertVetted from '../assets/icons/ExpertVetted.svg';
import TopViewed from '../assets/icons/TopViewed.svg';
import ExcellentCommunicator from '../assets/icons/ExcellentCommunicator.svg';

// Création du thème Material‑UI


// Options de tri
const SORT_OPTIONS = [
  { value: '', label: 'Aucun' },
  { value: 'hourlyRate', label: 'Taux Horaire' },
  { value: 'experienceYears', label: 'Expérience (Années)' },
  { value: 'jobSuccess', label: 'Taux de réussite' },
];

// Fonction pour retourner l'image associée au badge
function getBadgeImage(badgeName) {
  switch (badgeName) {
    case "Rising Talent":
      return RisingTalent;
    case "Top Rated":
      return TopRated;
    case "Top Rated Plus":
      return TopRatedPlus;
    case "Expert-Vetted":
      return ExpertVetted;
    case "Top Viewed":
      return TopViewed;
    case "Excellent Communicator":
      return ExcellentCommunicator;
    default:
      return null;
  }
}

function LandingEntreprise() {
  const navigate = useNavigate();

  // Récupération de l'utilisateur depuis le localStorage pour obtenir son ID
  const storedUser = JSON.parse(localStorage.getItem("user"));
  const userId = storedUser?.user?.id || storedUser?.id;

  // State pour stocker les informations de l'entreprise récupérées via l'API
  const [entreprise, setEntreprise] = useState(null);

  // Appel API pour récupérer l'entreprise par son ID
  useEffect(() => {
    if (!userId) {
      toast.error("Utilisateur introuvable");
      return;
    }
    getById(userId)
      .then(data => setEntreprise(data))
      .catch(error => {
        console.error("Erreur lors de la récupération de l'entreprise:", error);
        toast.error("Erreur lors du chargement de l'entreprise");
      });
  }, [userId]);

  // Vérification du type d'entreprise à partir des données récupérées
  const isEntrepriseSSI = entreprise?.typeEntreprise === "SSI";
  const isEntrepriseClient = !isEntrepriseSSI;

  // États pour les données et l'UI
  const [consultants, setConsultants] = useState([]);
  const [domaines, setDomaines] = useState([]);
  const [competences, setCompetences] = useState([]);
  const [categories, setCategories] = useState([]);
  const [missionsEntreprise, setMissionsEntreprise] = useState([]);

  const [isLoading, setIsLoading] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedDomain, setSelectedDomain] = useState('');
  const [selectedCompetence, setSelectedCompetence] = useState('');
  const [location, setLocation] = useState('');
  const [hourlyRateRange, setHourlyRateRange] = useState([0, 100]);
  const [sortOption, setSortOption] = useState('');
  const [viewMode, setViewMode] = useState(() => {
    return localStorage.getItem('viewMode') || 'list';
  });  
  const [currentPage, setCurrentPage] = useState(() => {
    const savedPage = localStorage.getItem('currentPage');
    return savedPage ? parseInt(savedPage) : 1;
  });  const itemsPerPage = 6;

  // États pour la modal d'invitation/recrutement
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [selectedConsultantForInvite, setSelectedConsultantForInvite] = useState(null);
  const [selectedMissionForInvite, setSelectedMissionForInvite] = useState(null);
  const [inviteMessage, setInviteMessage] = useState('');
  useEffect(() => {
    localStorage.setItem('viewMode', viewMode);
  }, [viewMode]);

  // Save current page changes
  useEffect(() => {
    localStorage.setItem('currentPage', currentPage.toString());
  }, [currentPage]);
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
      .catch(err => {
        console.error(err);
        setIsLoading(false);
      });
  }, []);

  useEffect(() => {
    if (!domaines.length) {
      setCategories([]);
      return;
    }
    const catSet = new Set();
    domaines.forEach(d => {
      if (d.category) catSet.add(d.category);
    });
    setCategories(Array.from(catSet));
  }, [domaines]);

  const entrepriseId = storedUser?.user?.id || storedUser?.id;
  useEffect(() => {
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
  }, [entrepriseId]);

  const filteredConsultants = useMemo(() => {
    return consultants.filter(c => {
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
  }, [consultants, searchKeyword, selectedCategory, selectedDomain, selectedCompetence, location, hourlyRateRange]);

  const sortedConsultants = useMemo(() => {
    const sorted = [...filteredConsultants];
    if (sortOption === 'hourlyRate') {
      sorted.sort((a, b) => (Number(a.taux_horaire) || 0) - (Number(b.taux_horaire) || 0));
    } else if (sortOption === 'experienceYears') {
      sorted.sort((a, b) => (b.experienceYears || 0) - (a.experienceYears || 0));
    } else if (sortOption === 'jobSuccess') {
      sorted.sort((a, b) => (b.jobSuccess || 0) - (a.jobSuccess || 0));
    }
    return sorted;
  }, [filteredConsultants, sortOption]);

  const totalPages = Math.ceil(sortedConsultants.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentPageConsultants = sortedConsultants.slice(startIndex, startIndex + itemsPerPage);

  const handleOpenProfile = async consultant => {
    try {
      await ProfileViewService.createProfileView(consultant.id);
    } catch (error) {
      console.error("Erreur lors de la création de la vue de profil :", error);
    }
    navigate(`/consultant/${consultant.id}`);
  };

  const handleHourlyRateChange = (e, newValue) => {
    setHourlyRateRange(newValue);
  };



  const handleContact = async consultant => {
    try {
      const senderEmail = storedUser?.email;
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
      console.error("Erreur dans handleContact:", error);
    }
  };

  const handleInviteClick = consultant => {
    setSelectedConsultantForInvite(consultant);
    setSelectedMissionForInvite(null);
    setInviteMessage('');
    setShowInviteModal(true);
  };

  const handleCloseInviteModal = () => {
    setShowInviteModal(false);
    setSelectedConsultantForInvite(null);
    setSelectedMissionForInvite(null);
    setInviteMessage('');
  };

  const handleSubmitInvite = () => {
    const entrepriseId = storedUser?.user?.id || storedUser?.id;
    if (!entrepriseId) {
      toast.error("Entreprise introuvable");
      return;
    }
    let propositionData = {
      message: inviteMessage,
      statut: "PENDING",
      origine: isEntrepriseSSI ? "RECRUTEMENT" : "INVITED"
    };

    // Pour une invitation classique (non-SSI)
    if (!isEntrepriseSSI) {
      if (!selectedMissionForInvite) {
        toast.error("Veuillez sélectionner une mission");
        return;
      }
      propositionData.mission = { id: selectedMissionForInvite.id };
      if (isEntrepriseClient && selectedMissionForInvite) {
        propositionData.montant = selectedMissionForInvite.budget;
        propositionData.dureeEstime = selectedMissionForInvite.dureeEstime;
      }
    }
    propositionData.consultant = { id: selectedConsultantForInvite.id };
    console.log("propositionData:", propositionData);
    console.log(propositionData.mission)
    inviteConsultantToJob(entrepriseId, selectedConsultantForInvite.id, propositionData)
      .then(() => {
        toast.success(
          isEntrepriseSSI
            ? "Invitation de recrutement envoyée ! Le consultant pourra l'accepter ou la refuser."
            : "Invitation envoyée ! Un email et une notification ont été envoyés au consultant."
        );
        handleCloseInviteModal();
      })
      .catch(error => {
        toast.error("Erreur lors de l'envoi de l'invitation.");
        console.error("Erreur dans handleSubmitInvite:", error);
      });
  };

  const clearFilters = () => {
    setSearchKeyword('');
    setSelectedCategory('');
    setSelectedDomain('');
    setSelectedCompetence('');
    setLocation('');
    setHourlyRateRange([0, 100]);
    setSortOption('');
    setCurrentPage(1);
  };

  const handlePrevPage = () => {
    setCurrentPage(prev => Math.max(prev - 1, 1));
  };

  const handleNextPage = totalPages => {
    setCurrentPage(prev => Math.min(prev + 1, totalPages));
  };

  return (
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
            onChange={e => setSearchKeyword(e.target.value)}
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
              onChange={e => setSortOption(e.target.value)}
              style={{ marginRight: '1rem' }}
              renderValue={value => {
                if (value === "") return <span style={{ color: "#aaa" }}>Filtrer par </span>;
                const found = SORT_OPTIONS.find(opt => opt.value === value);
                return found ? found.label : value;
              }}
            >
              {SORT_OPTIONS.map(opt => (
                <MenuItem key={opt.value} value={opt.value}>
                  {opt.label}
                </MenuItem>
              ))}
            </Select>
            
          </div>
          <div className={styles.rightActions}>
            <Button variant="contained"   className={styles.clearFiltersButton}
 onClick={clearFilters}>
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
                value={selectedCategory}
                onChange={e => setSelectedCategory(e.target.value)}
                renderValue={value => {
                  if (value === "") return <span style={{ color: "#aaa" }}>Aucune</span>;
                  return value;
                }}
              >
                <MenuItem value="">
                  <em>Aucune</em>
                </MenuItem>
                {categories.map(cat => (
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
                onChange={e => setSelectedDomain(e.target.value)}
                renderValue={value => {
                  if (value === "") return <span style={{ color: "#aaa" }}>Aucun</span>;
                  return value;
                }}
              >
                <MenuItem value="">
                  <em>Aucun</em>
                </MenuItem>
                {domaines.map(dom => (
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
                onChange={e => setSelectedCompetence(e.target.value)}
                renderValue={value => {
                  if (value === "") return <span style={{ color: "#aaa" }}>Aucune</span>;
                  return value;
                }}
              >
                <MenuItem value="">
                  <em>Aucune</em>
                </MenuItem>
                {competences.map(c => (
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
                onChange={e => setLocation(e.target.value)}
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

          <section className={`${styles.talentList} ${viewMode === 'grid' ? styles.gridView : ''}`} >
  {isLoading ? (
    <p>Chargement...</p>
  ) : currentPageConsultants.length === 0 ? (
    <div className={styles.noResults}>
      <p>Aucun consultant trouvé.</p>
    </div>
  ) : (
    currentPageConsultants.map((consultant, index) => {
      const jobSuccessValue = consultant.jobSuccess || 0;
      let expLabel = 'Débutant';
      if (consultant.experienceYears >= 1) {
        expLabel = consultant.experienceYears < 3 ? 'Intermédiaire' : 'Expert';
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
         
          <div className={styles.talentHeader}>
            <div className={styles.profilePicWrapper}>
              <img
                src={consultant.photoprofile || 'https://via.placeholder.com/50'}
                alt={`${consultant.nom || ''} ${consultant.prenom || ''}`}
                className={styles.profilePic}
              />
              {consultant.badge && (
                <img
                  src={getBadgeImage(consultant.badge)}
                  alt={consultant.badge}
                  className={styles.consultantBadge}
                />
              )}
            </div>
            <div>
              <h2>{consultant.nom} {consultant.prenom}</h2>
            </div>
          </div>
          <div className={styles.talentInfo}>
            <span>{expLabel}</span>
            <span>{consultant.adresse || 'Localisation inconnue'}</span>
            <span>${Number(consultant.taux_horaire) || 0}/h</span>
          </div>
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1, mb: 1 }}>
            <Box sx={{ position: 'relative', display: 'inline-flex' }}>
              <CircularProgress
                variant="determinate"
                value={100}
                size={40}
                thickness={4}
                sx={{ color: '#f0f0f0' }}
              />
              <CircularProgress
                variant="determinate"
                value={jobSuccessValue}
                size={40}
                thickness={4}
                sx={{ 
                  color: '#00796b',
                  position: 'absolute',
                  left: 0
                }}
              />
              <Box
                sx={{
                  top: 0,
                  left: 0,
                  bottom: 0,
                  right: 0,
                  position: 'absolute',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <Typography variant="caption" component="div" sx={{ fontWeight: 'bold' }}>
                  {`${jobSuccessValue}%`}
                </Typography>
              </Box>
            </Box>
            <Typography variant="body2" sx={{ fontWeight: 500, color: 'text.secondary', minWidth: 70 }}>
            Taux de réussite
            </Typography>
          </Box>

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
          <p className={styles.talentBio}>{consultant.workload >0 ? 'En travail' : 'Disponible' }</p>
          <div className={styles.actionButtons} onClick={(e) => e.stopPropagation()}>
            <MUITooltip title="Voir le profil" arrow>
              <Button variant="contained" className={styles.viewProfile} onClick={() => handleOpenProfile(consultant)}>
                Profil
              </Button>
            </MUITooltip>
            <MUITooltip title="Contacter" arrow>
              <Button
                variant="outlined"
                className={styles.contactButton}
                onClick={() => handleContact(consultant)}
              >
                Contacter
              </Button>
            </MUITooltip>
            <MUITooltip title={isEntrepriseSSI ? "Recruter" : "Inviter"} arrow>
              <Button
                variant="contained"
                size="small"
                className={styles.actionButton}
                onClick={() => handleInviteClick(consultant)}
              >
                {isEntrepriseSSI ? "Recruter" : "Inviter"}
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

        {/* Modal d'invitation/recrutement */}
        {showInviteModal && (
  <div className={styles.modalOverlay} onClick={handleCloseInviteModal}>
    <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
      <button className={styles.modalCloseBtn} onClick={handleCloseInviteModal}>
        &times;
      </button>
      <h2 className={styles.modalTitle}>
        {isEntrepriseSSI
          ? `Recruter ${selectedConsultantForInvite?.nom} ${selectedConsultantForInvite?.prenom}`
          : `Inviter ${selectedConsultantForInvite?.nom} ${selectedConsultantForInvite?.prenom} à une mission`}
      </h2>

      <div className={styles.modalBody}>
        {isEntrepriseSSI ? (
          <>
            <div className={styles.modalFormGroup}>
              <label className={styles.formLabel}>Votre message</label>
              <textarea
                value={inviteMessage}
                onChange={(e) => setInviteMessage(e.target.value)}
                className={styles.formControl}
                rows={3}
                placeholder="Expliquez les conditions de recrutement..."
              />
              <p className={styles.modalHelperText}>
                Le consultant pourra accepter ou refuser votre invitation
              </p>
            </div>
          </>
        ) : (
          <>
            <div className={styles.modalFormGroup}>
              <label className={styles.formLabel}>Sélectionner une mission</label>
              <br />
              <select
                value={selectedMissionForInvite?.id || ''}
                onChange={(e) => {
                  const mission = missionsEntreprise
                    .filter(m => m.statut?.toLowerCase() === 'en attente')
                    .find(m => m.id === e.target.value);
                  setSelectedMissionForInvite(mission);
                }}
                className={styles.formControl}
              >
                {missionsEntreprise
                  .filter(mission => mission.statut?.toLowerCase() === 'en attente')
                  .map(mission => (
                    <option key={mission.id} value={mission.id}>
                      {mission.titre}
                    </option>
                  ))}
              </select>
            </div>

            {selectedMissionForInvite && (
              <>
                <div className={styles.modalFormGroup}>
                  <label className={styles.formLabel}>Montant</label>
                  <input
                    type="text"
                    value={selectedMissionForInvite.budget || ''}
                    className={styles.formControl}
                    readOnly
                  />
                </div>

                <div className={styles.modalFormGroup}>
                  <label className={styles.formLabel}>Durée estimée</label>
                  <input
                    type="text"
                    value={selectedMissionForInvite.dureeEstime || ''}
                    className={styles.formControl}
                    readOnly
                  />
                </div>
              </>
            )}

            <div className={styles.modalFormGroup}>
              <label className={styles.formLabel}>Votre message</label>
              <textarea
                value={inviteMessage}
                onChange={(e) => setInviteMessage(e.target.value)}
                className={styles.formControl}
                rows={3}
                placeholder="Expliquez votre proposition..."
              />
              <p className={styles.modalHelperText}>
              <i className="bi bi-bell"></i> Le consultant recevra une notification par email
              </p>
            </div>
          </>
        )}
      </div>

      <div className={styles.modalActions}>
    
        <button
          className={`${styles.modalSubmitBtn} ${styles.modalPrimaryBtn}`}
          onClick={handleSubmitInvite}
        >
          {isEntrepriseSSI ? "Envoyer le recrutement" : "Envoyer l'invitation"}
        </button>
      </div>
    </div>
  </div>
)}
        <ToastContainer />
      </div>
    
  );
}

export default LandingEntreprise;