/* eslint-disable react/no-unescaped-entities */
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styles from './CollaboratorsList.module.css';
import entrepriseService from '../Services/EntrepriseService';
import { getPropositionsByConsultant } from '../Services/PropositionService';
import {  getSavedMissions } from '../Services/SearchMission';
import { applyWithConsultant } from '../Services/SearchMission';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { formatDistanceToNow } from 'date-fns';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField } from '@mui/material';

const CollaboratorsList = () => {
  const storedEntreprise = JSON.parse(localStorage.getItem("user"));
  const entrepriseId = storedEntreprise?.id;
  const [collaborators, setCollaborators] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedIds, setExpandedIds] = useState([]);

  // Saved missions modal state
  const [showSavedModal, setShowSavedModal] = useState(false);
  const [savedMissions, setSavedMissions] = useState([]);
  const [modalConsultantName, setModalConsultantName] = useState("");
  const [selectedConsultant, setSelectedConsultant] = useState(null);

  // Application modal state
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [selectedMission, setSelectedMission] = useState(null);
  const [propositionMontant, setPropositionMontant] = useState('');
  const [propositionDuree, setPropositionDuree] = useState('');
  const [propositionMessage, setPropositionMessage] = useState('');

  useEffect(() => {
    const fetchCollaborators = async () => {
      try {
        const consultants = await entrepriseService.getConsultantsForEntreprise(entrepriseId);
        const consultantsWithPropositions = await Promise.all(
          consultants.map(async (consultant) => {
            const propositions = await getPropositionsByConsultant(consultant.id);
            return { ...consultant, propositions };
          })
        );
        setCollaborators(consultantsWithPropositions);
      } catch (err) {
        console.error("Erreur lors de la récupération des consultants:", err);
        setError("Erreur lors de la récupération des consultants");
      } finally {
        setLoading(false);
      }
    };

    if (entrepriseId) fetchCollaborators();
  }, [entrepriseId]);

  const toggleExpand = (id) => {
    setExpandedIds(prev => prev.includes(id) ? prev.filter(expId => expId !== id) : [...prev, id]);
  };

  const handleRemove = async (consultantId) => {
    if (!window.confirm("Êtes-vous sûr de vouloir retirer ce collaborateur ?")) return;
    try {
      await entrepriseService.removeConsultant(entrepriseId, consultantId);
      setCollaborators(prev => prev.filter(collab => collab.id !== consultantId));
    } catch (err) {
      console.error("Erreur lors de la suppression du consultant:", err);
      toast.error("Erreur lors de la suppression du consultant");
    }
  };

  const handleViewSavedMissions = async (consultant) => {
    try {
      const missions = await getSavedMissions(consultant.id);
      setSavedMissions(missions);
      setModalConsultantName(`${consultant.nom} ${consultant.prenom}`);
      setSelectedConsultant(consultant);
      setShowSavedModal(true);
    } catch (err) {
      console.error("Erreur lors de la récupération des missions sauvegardées:", err);
      toast.error("Erreur lors de la récupération des missions sauvegardées");
    }
  };

  const handleApplyToMission = (mission) => {
    setSelectedMission(mission);
    setPropositionMontant(mission.budget || '');
    setPropositionDuree(mission.dureeEstime || '');
    setShowApplyModal(true);
  };

  const handleSubmitApplication = async () => {
    try {
      await applyWithConsultant(
        entrepriseId,
        selectedMission.id,
        selectedConsultant.id,
        parseFloat(propositionMontant),
        propositionDuree,
        propositionMessage
      );
      toast.success("Proposition envoyée avec succès !");
      setShowApplyModal(false);
    } catch (error) {
      console.error("Erreur lors de l'envoi de la proposition:", error);
      toast.error("Erreur lors de l'envoi de la proposition");
    }
  };

  if (loading) return <div className={styles.container}>Chargement des collaborateurs...</div>;
  if (error) return <div className={styles.container}>{error}</div>;

  return (
    <div className={styles.container}>
      <ToastContainer />

      <div className={styles.headerContainer}>
        <h2>Liste des Collaborateurs</h2>
        <Link to="/AddCollaborator" className={styles.addButton}>
          + Ajouter un Collaborateur
        </Link>
      </div>

      {collaborators.length === 0 ? (
        <div className={styles.emptyState}>
          <p>Aucun collaborateur n'a été trouvé.</p>
          <p>Commencez par ajouter un collaborateur en cliquant sur le bouton ci-dessus.</p>
        </div>
      ) : (
        <div className={styles.collaboratorsGrid}>
          {collaborators.map((collaborator) => {
          const isExpanded = expandedIds.includes(collaborator.id);
          return (
            <div key={collaborator.id} className={`${styles.card} ${isExpanded ? styles.expanded : ''}`}>
              <div className={styles.cardHeader}>
                <img
                  src={collaborator.photoprofile}
                  alt={`${collaborator.nom} ${collaborator.prenom}`}
                  className={styles.avatar}
                />
                <h3 onClick={() => toggleExpand(collaborator.id)} className={styles.collaboratorName}>
                  {collaborator.nom} {collaborator.prenom}
                </h3>
                <div className={styles.buttonGroup}>
                  <button 
                    className={styles.savedMissionsButton}
                    title="View saved missions"
                    onClick={() => handleViewSavedMissions(collaborator)}
                  >
                    📄
                  </button>
                  <Link 
                    to={`/consultant/${collaborator.id}`}
                    className={styles.profileButton}
                    title="View profile"
                  >
                    👤
                  </Link>
                  <button 
                    className={styles.removeButton} 
                    onClick={() => handleRemove(collaborator.id)}
                    title="Remove collaborator"
                  >
                    X
                  </button>
                </div>
              </div>
              {isExpanded && (
                <div className={styles.cardDetails}>
                  <p><strong>Email:</strong> {collaborator.email}</p>
                  {collaborator.competences?.length > 0 && (
                    <p><strong>Compétences:</strong> {collaborator.competences.map(c => c.nom).join(", ")}</p>
                  )}
                  {collaborator.experienceYears && (
                    <p><strong>Expérience:</strong> {collaborator.experienceYears} {collaborator.experienceYears > 1 ? "ans" : "an"}</p>
                  )}
                  {collaborator.taux_horaire && (
                    <p><strong>Taux horaire:</strong> {collaborator.taux_horaire}€/h</p>
                  )}
                  {collaborator.domaines?.length > 0 && (
                    <p><strong>Domaines:</strong> {collaborator.domaines.map(d => d.nom).join(", ")}</p>
                  )}
                  {collaborator.badge && <p><strong>Badge:</strong> {collaborator.badge}</p>}
                  {collaborator.portfolio && (
                    <p><strong>Portfolio:</strong> <a href={collaborator.portfolio} target="_blank" rel="noopener noreferrer">Voir le portfolio</a></p>
                  )}
                  {collaborator.dateRecrutement && (
                    <div className={styles.acceptationDate}>
                      Recruté depuis le {new Date(collaborator.dateRecrutement).toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' })}
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
)}
      {/* Saved Missions Modal */}
      {showSavedModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.missionsModalContent}>
            <h3>Missions sauvegardées pour {modalConsultantName}</h3>
            <div className={styles.missionsGrid}>
              {savedMissions.length > 0 ? (
                savedMissions.map(mission => (
                  <div key={mission.id} className={styles.missionCard}>
                    <div className={styles.missionHeader}>
                      <h4>{mission.titre}</h4>
                      <span className={styles.budget}>${mission.budget}</span>
                    </div>
                    <div className={styles.missionMeta}>
                      <span className={styles.entreprise}>{mission.entreprise?.nom || 'Entreprise non spécifiée'}</span>
                      <span className={styles.date}>Publié {formatDistanceToNow(new Date(mission.publishedAt))}</span>
                    </div>
                    <div className={styles.tags}>
                      {mission.domaines?.map((domaine, index) => (
                        <span key={index} className={styles.tag}>{domaine.nom}</span>
                      ))}
                    </div>
                    <p className={styles.description}>{mission.description}</p>
                    <div className={styles.missionFooter}>
                      <Button 
                        variant="contained" 
                        onClick={() => handleApplyToMission(mission)}
                        className={styles.applyButton}
                      >
                        Postuler
                      </Button>
                    </div>
                  </div>
                ))
              ) : (
                <p>Aucune mission sauvegardée trouvée.</p>
              )}
            </div>
            <button className={styles.closeButton} onClick={() => setShowSavedModal(false)}>Fermer</button>
          </div>
        </div>
      )}

      {/* Application Modal */}
      <Dialog open={showApplyModal} onClose={() => setShowApplyModal(false)}>
        <DialogTitle>Postuler pour {selectedMission?.titre} avec {selectedConsultant?.nom}</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="Montant proposé"
            type="number"
            fullWidth
            value={propositionMontant}
            onChange={(e) => setPropositionMontant(e.target.value)}
            InputLabelProps={{ shrink: true }}InputProps={{
              readOnly: true,
            }}
          />
          <TextField
            margin="dense"
            label="Durée estimée"
            type="text"
            fullWidth
            value={propositionDuree}
            onChange={(e) => setPropositionDuree(e.target.value)}
            placeholder="Ex: 3 mois"
            InputLabelProps={{ shrink: true }}
            InputProps={{
              readOnly: true,
            }}
          />
          <TextField
            margin="dense"
            label="Message complémentaire"
            multiline
            rows={4}
            fullWidth
            value={propositionMessage}
            onChange={(e) => setPropositionMessage(e.target.value)}
            InputLabelProps={{ shrink: true }}
            
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowApplyModal(false)}>Annuler</Button>
          <Button onClick={handleSubmitApplication} variant="contained" color="primary">
            Envoyer la proposition
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default CollaboratorsList;

