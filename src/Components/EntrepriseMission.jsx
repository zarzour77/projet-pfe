/* eslint-disable react/no-unescaped-entities */
import  { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
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
import LinearProgress from '@mui/material/LinearProgress';
import MUITooltip from '@mui/material/Tooltip';
import { FaGraduationCap } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import styles from './EntrepriseMission.module.css';

// Fonctions liées aux missions de l'entreprise
import {
  getPublishedMissions,
  getConsultantsForMission,
  getPropositionsForMission,
  updatePropositionStatus,
  acceptMission,
  incrementConsultantWorkload
} from '../Services/EntrepriseMissionService';

// Import de la fonction de création de conversation depuis le service Messenger
import { createConversation } from "../services/MessengerService";
import ProfileViewService from '../Services/ProfileViewService';


const EntrepriseMission = () => {
  const navigate = useNavigate();

  const [missions, setMissions] = useState([]);
  const [filteredMissions, setFilteredMissions] = useState([]);
  const [loadingMissions, setLoadingMissions] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMission, setSelectedMission] = useState(null);

  // Liste de consultants et propositions
  const [consultants, setConsultants] = useState([]);
  const [missionPropositions, setMissionPropositions] = useState([]);

  const [loadingConsultants, setLoadingConsultants] = useState(false);
  const [openDetail, setOpenDetail] = useState(false);

  // États pour la proposition envoyée par le consultant pour la mission sélectionnée
  const [openPropositionModal, setOpenPropositionModal] = useState(false);
  const [selectedConsultant, setSelectedConsultant] = useState(null);
  const [consultantProposition, setConsultantProposition] = useState(null);
  const [loadingProposition, setLoadingProposition] = useState(false);

  // Récupère l'id de l'entreprise depuis le localStorage
  const storedUser = localStorage.getItem('user');
  const entrepriseId = storedUser ? JSON.parse(storedUser).id : null;

  // Chargement des missions publiées
  useEffect(() => {
    const fetchMissions = async () => {
      try {
        const data = await getPublishedMissions(entrepriseId);
        setMissions(data);
        setFilteredMissions(data);
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

  // Filtrage instantané avec auto-complétion
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

  // Suggestions pour l'auto-complétion
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

  // Variantes d'animation pour les cartes
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };
  const handleViewProfile = async (consultant) => {
    try {
      await ProfileViewService.createProfileView(consultant.id);
    } catch (error) {
      console.error("Erreur lors de la création de la vue de profil :", error);
      // Vous pouvez gérer l'erreur (ex: notifier l'utilisateur) si nécessaire
    }
    // Puis naviguer vers le profil du consultant
    navigate(`/consultant/${consultant.id}`);
  };
  // Lorsqu'une mission est sélectionnée, on charge les consultants et leurs propositions
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

  // Gestion de l'ouverture/fermeture de la modal de détail de mission
  const handleOpenDetail = (mission) => {
    setSelectedMission(mission);
    setOpenDetail(true);
  };

  const handleCloseDetail = () => {
    setSelectedMission(null);
    setOpenDetail(false);
  };

  // Ouverture de la modal pour afficher la proposition
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
    setOpenPropositionModal(false);
  };

  // Fonction pour mettre à jour le statut d'une proposition
  const updateStatusForConsultant = async (consultant, newStatus) => {
    if (!selectedMission) return;
    try {
      const propositionForConsultant = missionPropositions.find(
        (prop) => prop.consultant && prop.consultant.id === consultant.id
      );
      if (propositionForConsultant) {
        const updatedProposition = await updatePropositionStatus(propositionForConsultant.id, newStatus);

        // Mise à jour locale de la proposition
        setMissionPropositions((prev) =>
          prev.map((p) => (p.id === updatedProposition.id ? updatedProposition : p))
        );

        // Si le consultant est affiché en modal, on met à jour la proposition en cours
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

  // Gestionnaire pour accepter un consultant
  const handleAcceptConsultant = async (acceptedConsultant) => {
    try {
      await updateStatusForConsultant(acceptedConsultant, "accepted");
      await incrementConsultantWorkload(acceptedConsultant.id);

      const otherConsultants = consultants.filter(c => c.id !== acceptedConsultant.id);
      for (const otherConsultant of otherConsultants) {
        await updateStatusForConsultant(otherConsultant, "refused");
      }

      if (selectedMission) {
        const updatedMission = await acceptMission(selectedMission.id);
        console.log("Mission acceptée :", updatedMission);
        setSelectedMission(updatedMission);
      }
    } catch (err) {
      console.error("Erreur lors de l'acceptation de la mission", err);
    }
  };

  const handleRefuseConsultant = (consultant) => {
    updateStatusForConsultant(consultant, "refused");
  };

  // Nouvelle fonction pour initialiser une conversation avec un consultant
  const handleContacter = async (consultant) => {
    try {
      // Récupère l'utilisateur courant depuis le localStorage
      const userWithToken = JSON.parse(localStorage.getItem("user")) || {};
      const currentUser = userWithToken.email || "me@domain.com";
      
      // Crée une nouvelle conversation entre l'utilisateur courant et le consultant
      let conversation = await createConversation(currentUser, consultant.email);
      
      // On peut transformer la conversation si besoin (par exemple avec une fonction transformConversation)
      // Ici, on navigue vers Messenger en passant la conversation dans l'état
      navigate("/messenger", { state: { conversation } });
    } catch (error) {
      console.error("Erreur lors de la création de la conversation :", error);
    }
  };

  return (
    <div className={styles.mainContainer}>
      {/* Barre de recherche */}
      <div className={styles.searchBar}>
        <Autocomplete
          freeSolo
          options={suggestions}
          value={searchTerm}
          onInputChange={(event, newInputValue) => setSearchTerm(newInputValue)}
          renderInput={(params) => (
            <TextField {...params} label="Rechercher une mission" variant="outlined" fullWidth />
          )}
        />
      </div>

      {/* Deux colonnes */}
      <div className={styles.contentContainer}>
        {/* Colonne de gauche : Missions */}
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
                  <div className={styles.cardHeader}>
                    <h3>{mission.titre}</h3>
                  </div>
                  <div className={styles.cardBody}>
                    <p className={styles.description}>{mission.description}</p>
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
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* Colonne de droite : Consultants */}
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
                    // Comparaison case-insensitive pour l'origine
                    const isInvited = propositionForConsultant?.origine?.toLowerCase() === 'invited';
                    console.log(propositionForConsultant);

                    const ratingValue = consultant.rating || 0;
                    const jobSuccessValue = Math.round(ratingValue * 20);

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
                            <Rating
                              name={`rating-${consultant.id}`}
                              value={ratingValue}
                              precision={0.5}
                              readOnly
                              size="small"
                            />
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
                            {!(propositionForConsultant && propositionForConsultant.origine?.toLowerCase() === 'invited') && (
                              <div className={styles.rightActions}>
                                <MUITooltip title="Accepter" arrow>
                                  <Button 
                                    variant="contained" 
                                    size="small"
                                    color="success"
                                    onClick={() => handleAcceptConsultant(consultant)}
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

      {/* Modal de détail de mission */}
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

      {/* Modal d'affichage de la proposition (champs larges) */}
      <Dialog open={openPropositionModal} onClose={handleClosePropositionModal} fullWidth maxWidth="md">
        <DialogTitle>
          Proposition de {selectedConsultant && `${selectedConsultant.nom} ${selectedConsultant.prenom}`}
        </DialogTitle>
        <DialogContent dividers>
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
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default EntrepriseMission;