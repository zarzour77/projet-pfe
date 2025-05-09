/* eslint-disable react/no-unescaped-entities */
import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect, useMemo } from 'react';
import { FaInfoCircle, FaGraduationCap } from 'react-icons/fa';
import { motion } from 'framer-motion';
import Typography from '@mui/material/Typography';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import Divider from '@mui/material/Divider';
import AvisService from '../Services/AvisService';

import {
  Autocomplete,
  TextField,
  Chip,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  Box,
} from '@mui/material';
import Rating from '@mui/material/Rating';
import MUITooltip from '@mui/material/Tooltip';
import styles from './EntrepriseMission.module.css';

// Services
import {
  getPublishedMissions,
  getConsultantsForMission,
  getPropositionsForMission,
  updatePropositionStatus,
  acceptMission,
  incrementConsultantWorkload,
  getMissionPaymentDetails,
  initiateFirstPayment,
  initiateFinalPayment
} from '../Services/EntrepriseMissionService';
import { createConversation } from "../services/MessengerService";
import ProfileViewService from '../Services/ProfileViewService';
import EntrepriseService from '../Services/EntrepriseService';

const EntrepriseMission = () => {
  const navigate = useNavigate();

  const [missions, setMissions] = useState([]);
  const [filteredMissions, setFilteredMissions] = useState([]);
  const [loadingMissions, setLoadingMissions] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMission, setSelectedMission] = useState(null);

  // List of consultants and propositions
  const [consultants, setConsultants] = useState([]);
  const [missionPropositions, setMissionPropositions] = useState([]);

  const [loadingConsultants, setLoadingConsultants] = useState(false);
  const [openDetail, setOpenDetail] = useState(false);

  // Modal for proposition details
  const [openPropositionModal, setOpenPropositionModal] = useState(false);
  const [selectedConsultant, setSelectedConsultant] = useState(null);
  const [consultantProposition, setConsultantProposition] = useState(null);
  const [loadingProposition, setLoadingProposition] = useState(false);

  // Payment Options Modal state (shown after acceptance)
  const [openPaymentOptionsModal, setOpenPaymentOptionsModal] = useState(false);

  // For enterprise details related to proposition (if any)
  const [entrepriseDetails, setEntrepriseDetails] = useState(null);

  // Retrieve enterprise id from localStorage
  const storedUser = localStorage.getItem('user');
  const entrepriseId = storedUser ? JSON.parse(storedUser).id : null;

  const [acceptedConsultant, setAcceptedConsultant] = useState(null);
  const [paymentDetails, setPaymentDetails] = useState(null);
  const [paymentProcessed, setPaymentProcessed] = useState({
    firstSlice: false,
    finalPayment: false
  });
  const [showRatingModal, setShowRatingModal] = useState(false);
const [rating, setRating] = useState(0);
const [comment, setComment] = useState('');
  // Load published missions
  useEffect(() => {
    const fetchMissions = async () => {
      try {
        const data = await getPublishedMissions(entrepriseId);
        setMissions(data);
        setFilteredMissions(data);
        console.log(data)
      } catch (err) {
        console.error('Erreur lors du chargement des missions:', err.message);
      } finally {
        setLoadingMissions(false);
      }
    };

    if (entrepriseId) {
      fetchMissions();
    }
  }, [entrepriseId]);
  useEffect(() => {
    const fetchPaymentDetails = async () => {
      if (openPaymentOptionsModal && selectedMission) {
        try {
          const data = await getMissionPaymentDetails(selectedMission.id);
          setPaymentDetails(data);
          setPaymentProcessed({
            firstSlice: data.isFirstSlicePaid,
            finalPayment: data.isFinalPaymentPaid
          });
        } catch (error) {
          console.error("Error fetching payment details:", error);
        }
      }
    };
    fetchPaymentDetails();
  }, [openPaymentOptionsModal, selectedMission]);
  // Instant filtering for search
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredMissions(missions);
    } else {
      const term = searchTerm.toLowerCase();
      const filtered = missions.filter((mission) => {
        return (
          mission.titre?.toLowerCase().includes(term) ||
          mission.description?.toLowerCase().includes(term) ||
          (mission.competencesRequises &&
            mission.competencesRequises.some(comp => comp.nom.toLowerCase().includes(term))) ||
          (mission.domaines &&
            mission.domaines.some(dom => dom.nom.toLowerCase().includes(term)))
        );
      });
      setFilteredMissions(filtered);
    }
  }, [searchTerm, missions]);

  // Suggestions for auto-completion
  const suggestions = useMemo(() => {
    const setValues = new Set();
    missions.forEach((mission) => {
      if (mission.titre) setValues.add(mission.titre);
      if (mission.description) setValues.add(mission.description);
      if (mission.competencesRequises) {
        mission.competencesRequises.forEach(comp => setValues.add(comp.nom));
      }
      if (mission.domaines) {
        mission.domaines.forEach(dom => setValues.add(dom.nom));
      }
    });
    return Array.from(setValues);
  }, [missions]);

  // Card animation variants
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  const handleViewProfile = async (consultant) => {
    try {
      await ProfileViewService.createProfileView(consultant.id);
    } catch (error) {
      console.error("Erreur lors de la création de la vue de profil :", error);
    }
    navigate(`/consultant/${consultant.id}`);
  };

  // When a mission is selected, load its consultants and propositions
  const handleSelectMission = async (mission) => {
    setSelectedMission(mission);
    setLoadingConsultants(true);
    try {
      const consultantData = await getConsultantsForMission(mission.id);
      setConsultants(consultantData);

      const propositionsData = await getPropositionsForMission(mission.id);
      setMissionPropositions(propositionsData);
    } catch (err) {
      console.error('Erreur lors du chargement des consultants:', err.message);
      setConsultants([]);
    } finally {
      setLoadingConsultants(false);
    }
  };



  const handleCloseDetail = () => {
    setSelectedMission(null);
    setOpenDetail(false);
  };

  // Open proposition modal
  const handleOpenPropositionModal = (consultant) => {
    if (!selectedMission) return;
    setSelectedConsultant(consultant);
    setLoadingProposition(true);

    const propositionForConsultant = missionPropositions.find(
      (prop) => prop && prop.consultant && prop.consultant.id === consultant.id
    );
    setConsultantProposition(propositionForConsultant || null);
    setLoadingProposition(false);
    setOpenPropositionModal(true);
  };

  const handleClosePropositionModal = () => {
    setSelectedConsultant(null);
    setConsultantProposition(null);
    setEntrepriseDetails(null);
    setOpenPropositionModal(false);
  };

  // Fetch full enterprise details if proposition has only an ID
  useEffect(() => {
    const fetchEntrepriseDetails = async () => {
      if (consultantProposition && consultantProposition.entreprise) {
        if (!consultantProposition.entreprise.nomEntreprise) {
          try {
            const entreprise = await EntrepriseService.getEntrepriseById(consultantProposition.entreprise);
            setEntrepriseDetails(entreprise);
          } catch (error) {
            console.error("Erreur lors du chargement des détails de l'entreprise :", error);
          }
        } else {
          setEntrepriseDetails(consultantProposition.entreprise);
        }
      }
    };

    fetchEntrepriseDetails();
  }, [consultantProposition]);

  // Update proposition status helper
  const updateStatusForConsultant = async (consultant, newStatus) => {
    if (!selectedMission) return;
    try {
      const propositionForConsultant = missionPropositions.find(
        (prop) => prop.consultant && prop.consultant.id === consultant.id
      );
      if (propositionForConsultant) {
        const updatedProposition = await updatePropositionStatus(propositionForConsultant.id, newStatus);
        setMissionPropositions((prev) =>
          prev.map((p) => (p.id === updatedProposition.id ? updatedProposition : p))
        );
        if (selectedConsultant && selectedConsultant.id === consultant.id) {
          setConsultantProposition(updatedProposition);
        }
      } else {
        console.error("Aucune proposition trouvée pour ce consultant");
      }
    } catch (err) {
      console.error("Erreur lors de la mise à jour du statut de la proposition", err);
    }
  };

  // When the enterprise confirms acceptance, update statuses and increment workload.
  // After a successful update, the accepted consultant's proposition will have statut "accepted".
  // Update the handleConfirmAccept function
const handleConfirmAccept = async (consultant) => {
  if (!selectedMission || !consultant) return;

  try {
    // Update proposition status for the accepted consultant.
    await updateStatusForConsultant(consultant, "ACCEPTED");
    
    // Increment the consultant's workload.
    await incrementConsultantWorkload(consultant.id);
    setAcceptedConsultant(consultant);

    // Update other consultants' propositions to "refused".
    const otherConsultants = consultants.filter(c => c.id !== consultant.id);
    for (const otherConsultant of otherConsultants) {
      await updateStatusForConsultant(otherConsultant, "refused");
    }

    // Refresh mission status by calling the accept endpoint.
    const updatedMission = await acceptMission(selectedMission.id);
    
    // Refresh missions list
    const updatedMissions = await getPublishedMissions(entrepriseId);
    setMissions(updatedMissions);
    setFilteredMissions(updatedMissions);
    
    // Update selected mission with fresh data
    const refreshedMission = updatedMissions.find(m => m.id === selectedMission.id);
    setSelectedMission(refreshedMission || updatedMission);

  } catch (err) {
    console.error("Erreur lors de l'acceptation de la mission", err);
    alert(`Erreur: ${err.message}`);
    return;
  }
};
const handleFirstPayment = async () => {
  try {
    // Add null check for selectedMission
    if (!selectedMission) {
      alert("Aucune mission sélectionnée");
      return;
    }

    await initiateFirstPayment(selectedMission.id);
    
 

    // Refresh data from server
    const updatedDetails = await getMissionPaymentDetails(selectedMission.id);
    setPaymentDetails(updatedDetails);
    
    const updatedMissions = await getPublishedMissions(entrepriseId);
    setMissions(updatedMissions);
    setFilteredMissions(updatedMissions);

    alert("Premier paiement effectué avec succès!");
    setOpenPaymentOptionsModal(false);
  } catch (error) {
    alert(`Erreur de paiement: ${error.response?.data || error.message}`);
  }
};
const handleFinalPayment = async () => {
  try {
    await initiateFinalPayment(selectedMission.id);
    
    // Update payment status
    const updatedDetails = await getMissionPaymentDetails(selectedMission.id);
    setPaymentProcessed(prev => ({
      ...prev,
      finalPayment: updatedDetails.finalPaymentProcessed
    }));

    alert("Paiement final effectué avec succès!");
    setOpenPaymentOptionsModal(false);
    setShowRatingModal(true);
  } catch (error) {
    alert(`Erreur de paiement: ${error.response?.data || error.message}`);
  }
};
const handleSubmitRating = async () => {
  try {
    await AvisService.createAvis(
      entrepriseId,
      selectedConsultant.id,
      rating,
      comment,
      selectedMission.id
    );

    setShowRatingModal(false);
    alert('Merci pour votre évaluation!');
    // Refresh consultant data
    const updatedConsultants = await getConsultantsForMission(selectedMission.id);
    setConsultants(updatedConsultants);
  } catch (error) {
    console.error('Error submitting rating:', error);
    alert('Erreur lors de la soumission de l\'évaluation');
  }
};
  const handleRefuseConsultant = (consultant) => {
    updateStatusForConsultant(consultant, "refused");
  };

  const handleContacter = async (consultant) => {
    try {
      const userWithToken = JSON.parse(localStorage.getItem("user")) || {};
      const currentUser = userWithToken.email || "me@domain.com";
      let conversation = await createConversation(currentUser, consultant.email);
      navigate("/messenger", { state: { conversation } });
    } catch (error) {
      console.error("Erreur lors de la création de la conversation :", error);
    }
  };

  return (
    <div className={styles.mainContainer}>
      {/* Search bar */}
      <div className={styles.headerContainer}>
      <div className={styles.searchBar}>
        <Autocomplete
          freeSolo
          options={suggestions}
          value={searchTerm}
          onInputChange={(event, newInputValue) => setSearchTerm(newInputValue)}
          renderInput={(params) => (
            <TextField 
              {...params} 
              label="Rechercher une mission" 
              variant="outlined" 
              fullWidth
            />
          )}
        />
      </div>
      <Button
        variant="contained"
        color="primary"
        onClick={() => navigate('/publiermission')}
        className={styles.publishButton}
        startIcon={<i className="bi bi-plus-lg"></i>}
      >
        Publier une mission
      </Button>
    </div>

      {/* Two columns */}
      <div className={styles.contentContainer}>
        {/* Left pane: Missions */}
        <div className={styles.leftPane}>
          <h2 className={styles.title}>Missions Publiées</h2>
          {loadingMissions ? (
            <Box className={styles.loadingContainer}>
              <CircularProgress />
            </Box>
          ) : filteredMissions.length === 0 ? (
            <p className={styles.noResult}>Aucune mission trouvée.</p>
          ) : (
            <div className={styles.missionGrid}>
              {filteredMissions.map((mission, index) => (
                <motion.div
                  key={mission.id}
                  className={`${styles.cardContainer} ${styles.missionCard}`}
                  variants={cardVariants}
                  initial="hidden"
                  animate="visible"
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  onClick={() => handleSelectMission(mission)}
                >
                  {mission.propositionsCount > 0 && (
                    <div className={styles.propositionsBadge}>
                      {mission.propositionsCount}
                    </div>
                  )}
                  <div className={styles.cardHeader}>
                    <h3>{mission.titre}</h3>
                  </div>
                  <div className={styles.cardBody}>
                    <div className={styles.infoRow}>
                      <span className={styles.label}>Budget:</span>
                      <span>{mission.budget}€</span>
                    </div>
                    <div className={styles.infoRow}>
                      <span className={styles.label}>Publié le:</span>
                      <span>{mission.publishedAt ? new Date(mission.publishedAt).toLocaleDateString() : 'Non défini'}</span>
                    </div>
                    <div className={styles.infoRow}>
                      <span className={styles.label}>Durée estimée:</span>
                      <span>{mission.dureeEstime}</span>
                    </div>
                    <div className={styles.infoRow}>
                      <span className={styles.label}>Porté de travail:</span>
                      <span>{mission.portetravail}</span>
                    </div>
                    <div className={styles.infoRow}>
                      <span className={styles.label}>Niveau:</span>
                      <span>{mission.niveauExperienceRequis}</span>
                    </div>
                    <div className={styles.tagsContainer}>
                      {mission.competencesRequises &&
                        mission.competencesRequises.map((comp) => (
                          <Chip key={comp.id} label={comp.nom} className={styles.tag} color="primary" size="small" />
                        ))}
                    </div>
                    <div className={styles.tagsContainer}>
                      {mission.domaines &&
                        mission.domaines.map((dom) => (
                          <Chip
                            key={dom.id}
                            label={dom.nom}
                            className={styles.tag}
                            style={{ backgroundColor: 'var(--secondary-bg)', color: 'var(--secondary-color)' }}
                            size="small"
                          />
                        ))}
                      {mission.statut && (
                        <div className={styles.missionStatus}>
                          <span className={`${styles.status} ${styles[mission.statut.toLowerCase().replace(/ /g, '-')]}`}>
                            {mission.statut}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* Right pane: Consultants */}
        <div className={styles.rightPane}>
          {selectedMission ? (
            <>
              <h2 className={styles.title}>Consultants pour "{selectedMission.titre}"</h2>
              {loadingConsultants ? (
                <Box className={styles.loadingContainer}>
                  <CircularProgress />
                </Box>
              ) : consultants.length === 0 ? (
                <p className={styles.noResult}>Aucun consultant trouvé pour cette mission.</p>
              ) : (
                <div className={styles.talentList}>
                  {consultants.map((consultant, idx) => {
                    const propositionForConsultant = missionPropositions.find(
                      (prop) => prop.consultant && prop.consultant.id === consultant.id
                    );
                    const isRefused = propositionForConsultant?.statut === 'refused';
                    const isAccepted = propositionForConsultant?.statut === 'accepted';

                    let expLabel = 'Débutant';
                    if (consultant.experienceYears) {
                      expLabel = consultant.experienceYears < 3 ? 'Intermédiaire' : 'Expert';
                    }

                    return (
                      <motion.div
  key={consultant.id}
  className={styles.talentItem}
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.3, delay: idx * 0.1 }}
>
  <div className={styles.talentHeader} style={{ position: 'relative' }}>
    <div>
      <h2>{consultant.nom} {consultant.prenom}</h2>
      <div className={styles.originBadge}>
        {propositionForConsultant?.origine === 'INVITED' ? (
          <span className={styles.invitedBadge}>
            📩 Proposition par invitation
          </span>
        ) : propositionForConsultant?.entreprise ? (
          <span className={styles.entrepriseBadge}>
            🏢 Proposition par Entreprise SSI
          </span>
        ) : (
          <span className={styles.freelanceBadge}>
            🧑💻 Proposition indépendante
          </span>
        )}
      </div>
    </div>
    {isRefused && (
      <span className={`${styles.statusLabel} ${styles.refusedLabel}`}>
        Refusé
      </span>
    )}
    {isAccepted && (
      <span className={`${styles.statusLabel} ${styles.acceptedLabel}`}>
        En cours
      </span>
    )}
  </div>

  <div className={styles.talentInfo}>
    <span>{expLabel}</span>
    <span>{consultant.adresse || 'Localisation inconnue'}</span>
    <span>{`$${Number(consultant.taux_horaire) || 0}/h`}</span>
  </div>

  {/* Job Success Circular Progress */}
  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1, mb: 1 }}>
    <Box sx={{ position: 'relative', display: 'inline-flex' }}>
      {/* Background track */}
      <CircularProgress
        variant="determinate"
        value={100}
        size={40}
        thickness={4}
        sx={{ color: '#f0f0f0' }}
      />
      {/* Actual progress */}
      <CircularProgress
        variant="determinate"
        value={consultant.jobSuccess || 0}
        size={40}
        thickness={4}
        sx={{ 
          color: '#00796b',
          position: 'absolute',
          left: 0
        }}
      />
      {/* Centered percentage text */}
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
          {`${consultant.jobSuccess || 0}%`}
        </Typography>
      </Box>
    </Box>

    <Typography variant="body2" sx={{ fontWeight: 500, color: 'text.secondary', minWidth: 70 }}>
  Score de Succès
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
  <p className={styles.talentBio}>
    {consultant.workload === 0 ? 'Disponible' : 'En travail'}
  </p>

  {!isRefused && !isAccepted && (
    <div className={styles.actionButtons}>
    <div className={styles.leftActions}>
      <MUITooltip title="Voir le profil" arrow>
        <Button 
          variant="contained" 
          size="small"
          onClick={() => handleViewProfile(consultant)}
        >
          Profil
        </Button>
      </MUITooltip>
      <MUITooltip title="Contacter" arrow>
        <Button
          variant="outlined"
          size="small"
          onClick={() => handleContacter(consultant)}
        >
          Contacter
        </Button>
      </MUITooltip>
      <MUITooltip title="Voir Proposition" arrow>
        <Button 
          variant="outlined" 
          size="small"
          onClick={() => handleOpenPropositionModal(consultant)}
        >
          Voir Proposition
        </Button>
      </MUITooltip>
    </div>
    
    {(propositionForConsultant?.statut === "ACCEPTED" || 
      selectedMission?.statut.toLowerCase() === 'terminée' || 
      propositionForConsultant?.origine === 'INVITED') ? (
      <div className={styles.rightActions}>
        <Button 
          variant="contained" 
          color="primary" 
          onClick={() => {
            setSelectedConsultant(consultant);
            setOpenPaymentOptionsModal(true);
          }}
        >
          Payer
        </Button>
      </div>
    ) : (
      !(propositionForConsultant && 
        (propositionForConsultant.origine?.toLowerCase() === 'invited' || 
        propositionForConsultant.statut === "ACCEPTED" || 
        propositionForConsultant.statut === "terminée")) && (
        <div className={styles.rightActions}>
          <MUITooltip title="Accepter" arrow>
            <Button 
              variant="contained" 
              size="small"
              color="success"
              onClick={() => handleConfirmAccept(consultant)}
            >
              Accepter
            </Button>
          </MUITooltip>
          <MUITooltip title="Refuser" arrow>
            <Button 
              variant="outlined" 
              size="small"
              color="error"
              onClick={() => handleRefuseConsultant(consultant)}
            >
              Refuser
            </Button>
          </MUITooltip>
        </div>
      )
    )}
  </div>
  )}
  
</motion.div>

                    );
                  })}
                </div>
              )}
            </>
          ) : (
            <p className={styles.placeholder}>Sélectionnez une mission pour voir les consultants.</p>
          )}
        </div>
      </div>

      {/* Mission Detail Modal */}
      <Dialog open={openDetail} onClose={handleCloseDetail} fullWidth maxWidth="md">
        {selectedMission && (
          <>
            <DialogTitle>{selectedMission.titre}</DialogTitle>
            <DialogContent dividers>
              <p><strong>Description :</strong> {selectedMission.description}</p>
              <div className={styles.infoRow}>
                <span className={styles.label}>Budget :</span>
                <span>{selectedMission.budget}€</span>
              </div>
              <div className={styles.infoRow}>
                <span className={styles.label}>Date de publication :</span>
                <span>
                  {selectedMission.publishedAt ? new Date(selectedMission.publishedAt).toLocaleDateString() : 'Non défini'}
                </span>
              </div>
              <div className={styles.infoRow}>
                <span className={styles.label}>Durée estimée :</span>
                <span>{selectedMission.dureeEstime}</span>
              </div>
              <div className={styles.infoRow}>
                <span className={styles.label}>Expérience requise :</span>
                <span>
                  {selectedMission.requiredExperience} ans 
                  <FaGraduationCap style={{ verticalAlign: 'middle', marginLeft: '0.3rem' }} />
                </span>
              </div>
              <div className={styles.infoRow}>
                <span className={styles.label}>Niveau :</span>
                <span>{selectedMission.niveauExperienceRequis}</span>
              </div>
              <div className={styles.modalTags}>
                <strong>Compétences Requises :</strong>
                {selectedMission.competencesRequises &&
                  selectedMission.competencesRequises.map((comp) => (
                    <Chip key={comp.id} label={comp.nom} className={styles.tag} color="primary" size="small" />
                  ))}
              </div>
              <div className={styles.modalTags}>
                <strong>Domaines :</strong>
                {selectedMission.domaines &&
                  selectedMission.domaines.map((dom) => (
                    <Chip
                      key={dom.id}
                      label={dom.nom}
                      className={styles.tag}
                      style={{ backgroundColor: 'var(--secondary-bg)', color: 'var(--secondary-color)' }}
                      size="small"
                    />
                  ))}
              </div>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseDetail} color="primary" variant="contained">
                Fermer
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>

      {/* Proposition Modal */}
      <Dialog open={openPropositionModal} onClose={handleClosePropositionModal} fullWidth maxWidth="md">
        <DialogTitle>
          Proposition de {selectedConsultant && `${selectedConsultant.nom} ${selectedConsultant.prenom}`}
        </DialogTitle>
        <DialogContent dividers>
          {consultantProposition?.entreprise && (
            <Box marginBottom={2} display="flex" alignItems="center" gap={1}>
              <strong>Proposé par l'entreprise :</strong>
              {entrepriseDetails ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <span>{entrepriseDetails.nomEntreprise}</span>
                  <MUITooltip title="Voir le profil de l'entreprise" arrow>
                    <Link to={`/entreprise/${entrepriseDetails.id}`} className={styles.enterpriseLink}>
                      <FaInfoCircle 
                        style={{ fontSize: '16px', color: 'var(--primary-color)', cursor: 'pointer', verticalAlign: 'middle' }} 
                      />
                    </Link>
                  </MUITooltip>
                </div>
              ) : (
                <CircularProgress size={15} />
              )}
            </Box>
          )}
          {loadingProposition ? (
            <Box className={styles.loadingContainer}>
              <CircularProgress />
            </Box>
          ) : consultantProposition ? (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <TextField
                label="Date de Proposition"
                value={new Date(consultantProposition.dateProposition).toLocaleDateString()}
                sx={{ width: '600px' }}
                InputProps={{ readOnly: true, style: { fontSize: '1.1rem', padding: '10px' } }}
                margin="normal"
              />
              <TextField
                label="Durée estimée"
                value={consultantProposition.dureeEstime}
                sx={{ width: '600px' }}
                InputProps={{ readOnly: true, style: { fontSize: '1.1rem', padding: '10px' } }}
                margin="normal"
              />
              <TextField
                label="Montant (€)"
                value={consultantProposition.montant}
                sx={{ width: '600px' }}
                InputProps={{ readOnly: true, style: { fontSize: '1.1rem', padding: '10px' } }}
                margin="normal"
              />
              <TextField
                label="Message"
                value={consultantProposition.message}
                sx={{ width: '600px' }}
                multiline
                InputProps={{ readOnly: true, style: { fontSize: '1.1rem', padding: '10px' } }}
                margin="normal"
              />
            </Box>
          ) : (
            <p className={styles.noResult}>
              Aucune proposition n'a été trouvée pour ce consultant sur cette mission.
            </p>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClosePropositionModal} color="primary" variant="contained">
            Fermer
          </Button>
          {/* If the consultant's proposition is accepted, show the "Payer" button */}
          {consultantProposition?.statut === "ACCEPTED" && (
            <Button 
              variant="contained" 
              color="primary" 
              onClick={() => setOpenPaymentOptionsModal(true)}
              style={{ marginLeft: 'auto' }}
            >
              Payer
            </Button>
          )}
        </DialogActions>
      </Dialog>

      {/* Payment Options Modal */}
      {/* Payment Options Modal */}
<Dialog open={openPaymentOptionsModal} onClose={() => setOpenPaymentOptionsModal(false)} className={styles.paymentModal} fullWidth maxWidth="sm">
  <DialogTitle >
    <Box display="flex" alignItems="center" gap={1}>
      <i className="bi bi-credit-card-2-back"></i> 
      <span>Processus de Paiement</span>
    </Box>
  </DialogTitle>
  <button className={styles.modalCloseBtn} onClick={() =>  setOpenPaymentOptionsModal(false)}>
                &times;
              </button>
  <DialogContent dividers>
    <div className={styles.paymentDetails}>
      {paymentDetails ? (
        <>
          <div className={styles.paymentExplanation}>
            <Typography variant="body2" color="textSecondary" paragraph>
              {missionPropositions.find(
                prop => prop.origine === 'APPLIED' && prop.entreprise
              ) ? (
                <>
                  Cette proposition a été faite par une entreprise partenaire SSI.
                  <br />
                  5% du budget total sera reversé à l'entreprise partenaire.
                </>
              ) : (
                <>
                  Pour finaliser la mission {selectedMission?.titre} avec{' '}
                  {selectedConsultant?.prenom || acceptedConsultant?.prenom || 'le consultant sélectionné'},
                  veuillez procéder au paiement selon le modèle de paiement sécurisé en deux étapes.
                </>
              )}
            </Typography>
          </div>

          <div className={styles.paymentSection}>
            <div className={styles.sectionHeader}>
              <span className={styles.stepBadge}>1</span>
              <Typography variant="subtitle2">Acompte initial</Typography>
            </div>
            <div className={styles.paymentRow}>
              <Box display="flex" alignItems="center" gap={1}>
                <span className={styles.infoText}>Montant immédiat:</span>
                <HelpOutlineIcon fontSize="small" color="action" />
              </Box>
              <strong className={styles.primaryAmount}>
                {paymentDetails.firstSlice.toFixed(2)}€
              </strong>
            </div>
            <Typography variant="caption" color="textSecondary">
              (20% du budget total - Débloqué immédiatement pour le consultant)
            </Typography>
          </div>

          {/* SSI Commission Section */}
          {paymentDetails.ssiCommission > 0 && (
            <div className={styles.paymentSection}>
              <div className={styles.sectionHeader}>
                <span className={styles.stepBadge}>*</span>
                <Typography variant="subtitle2">Commission Partenaire SSI</Typography>
              </div>
              <div className={styles.paymentRow}>
                <Box display="flex" alignItems="center" gap={1}>
                  <span className={styles.infoText}>Montant commission:</span>
                  <HelpOutlineIcon fontSize="small" color="action" />
                </Box>
                <strong className={styles.secondaryAmount}>
                  {paymentDetails.ssiCommission.toFixed(2)}€
                </strong>
              </div>
              <Typography variant="caption" color="textSecondary">
                (5% du budget total - Commission pour l'entreprise partenaire SSI)
              </Typography>
            </div>
          )}

          <div className={styles.paymentSection}>
            <div className={styles.sectionHeader}>
              <span className={styles.stepBadge}>2</span>
              <Typography variant="subtitle2">Solde sécurisé</Typography>
            </div>
            <div className={styles.paymentRow}>
              <Box display="flex" alignItems="center" gap={1}>
                <span className={styles.infoText}>Montant gelé:</span>
                <HelpOutlineIcon fontSize="small" color="action" />
              </Box>
              <strong className={styles.secondaryAmount}>
                {paymentDetails.frozenAmount.toFixed(2)}€
              </strong>
            </div>
            <Typography variant="caption" color="textSecondary">
              {paymentDetails.ssiCommission > 0 
                ? "(65% du budget total - Libéré après validation de la mission)"
                : "(70% du budget total - Libéré après validation de la mission)"}
            </Typography>
          </div>

          <div className={styles.feeSection}>
            <div className={styles.paymentRow}>
              <span className={styles.infoText}>Frais de service:</span>
              <strong className={styles.feeAmount}>
                {paymentDetails.applicationFee.toFixed(2)}€
              </strong>
            </div>
            <Typography variant="caption" color="textSecondary">
              (10% du budget total - Frais de gestion de plateforme)
            </Typography>
          </div>

          <div className={styles.paymentTotal}>
            <Divider sx={{ my: 2 }} />
            <div className={styles.paymentRow}>
              <Typography variant="subtitle1">Budget total : </Typography>
              <Typography variant="h6" color="primary">
                {selectedMission.budget.toFixed(2)}€
              </Typography>
            </div>
          </div>

          <Box mt={2} p={2} bgcolor="#fff3e0" borderRadius={2}>
            <Typography variant="caption" color="textSecondary">
              💡 Le solde gelé sera automatiquement libéré 48h après la validation finale de la mission. Vous recevrez une notification pour confirmer la libération des fonds.
            </Typography>
          </Box>
        </>
      ) : (
        <Box display="flex" justifyContent="center" p={4}>
          <CircularProgress />
        </Box>
      )}
    </div>
  </DialogContent>
  <DialogActions sx={{ padding: '16px 24px', borderTop: '1px solid #eee' }}>
    <Button 
      variant="outlined" 
      color="primary"
      onClick={handleFirstPayment}
      disabled={paymentProcessed.firstSlice || !paymentDetails}
    >
      {paymentProcessed.firstSlice ? 
        "Acompte payé" : 
        `Payer l'acompte (${paymentDetails?.firstSlice?.toFixed(2)}€) + ${paymentDetails?.applicationFee?.toFixed(2)}€`
      }
    </Button>

    <Button 
      variant="contained" 
      color="primary" 
      onClick={handleFinalPayment}
      disabled={
        paymentProcessed.finalPayment ||  // Check if final payment is already paid
        !paymentProcessed.firstSlice ||   // First payment must be completed
        selectedMission?.statut?.toLowerCase() !== 'terminée'  // Mission must be terminated
      }
    >
      {paymentProcessed.finalPayment ?
        "Solde payé" :
        `Payer le solde (${paymentDetails?.frozenAmount?.toFixed(2)}€)`
      }
    </Button>
    <Button 
    variant="contained" 
    color="secondary" 
    onClick={() => {
      setOpenPaymentOptionsModal(false);  // Close payment modal
      setShowRatingModal(true);          // Open rating modal
    }}  >
    Noter la mission
  </Button>
  </DialogActions>
</Dialog>
{showRatingModal && (
      <div className={styles.modalOverlay} onClick={() => setShowRatingModal(false)}>
        <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
          <button className={styles.modalCloseBtn} onClick={() => setShowRatingModal(false)}>
            &times;
          </button>
          
          <h2 className={styles.modalTitle}>
            <i className="bi bi-star-fill" style={{ color: 'gold', marginRight: '8px' }}></i> 
            Évaluation du Consultant
          </h2>

          <div className={styles.modalBody}>
  <p>Comment s'est déroulée la mission avec {selectedConsultant?.prenom} ?</p>

  <div className={styles.ratingContainer}>
    <Rating
      value={rating}
      onChange={(e, newValue) => {
        setRating(newValue);
        console.log('Current rating:', newValue);
      }}
      size="large"
      sx={{
        '& .MuiRating-iconFilled': { color: '#ffb400' },
        fontSize: '2.5rem'
      }}
    />
    <small className={styles.ratingLabel}>
      {['Très mauvais', 'Mauvais', 'Moyen', 'Bon', 'Excellent'][rating - 1] || 'Sélectionnez de 1 à 5 étoiles'}
    </small>
  </div>

  <div>
    <label className={styles.formLabel}>Votre commentaire (optionnel)</label>
    <div className={styles.modalFormGroup}>          
      <textarea
        className={styles.modalTextarea}
        placeholder="Décrivez votre expérience avec ce consultant..."
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        rows={4}
      />
      {/* Moved the Typography here */}
      <Typography 
  variant="caption" 
  color="textSecondary" 
  sx={{ 
    mt: 1, 
    mb: 2,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center', // Added this line for horizontal centering
    gap: '8px',
    textAlign: 'center' // Ensures text wraps properly when centered
  }}
>
  <FaInfoCircle style={{ 
    fontSize: '16px', 
    color: 'grey',
    flexShrink: 0
  }} />
  Cette évaluation sera visible sur le profil du consultant
</Typography>
      {/* Submit button container */}
      <div className={styles.modalActions}> 
        <button 
          className={styles.modalSubmitBtn}
          onClick={handleSubmitRating}
          disabled={rating === 0}
          style={{ 
            opacity: rating === 0 ? 0.6 : 1,
            cursor: rating === 0 ? 'not-allowed' : 'pointer',
            background: rating === 0 ? '#cccccc' : 'linear-gradient(135deg, #28a745, #218838)'
          }}
        >
          <i className="fas fa-check"></i> Soumettre
        </button>
      </div>
    </div>
  </div>
</div>
        </div>
      </div>
    )
}
    </div>
  );
};

export default EntrepriseMission;
