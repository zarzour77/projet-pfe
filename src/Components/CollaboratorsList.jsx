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
import {  Button } from '@mui/material';
import { FaBell } from 'react-icons/fa';
import Typography from '@mui/material/Typography';

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
        console.log(entrepriseId)
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
      console.log(missions)
      // Fetch entreprise details for missions with missing nomEntreprise
      const enrichedMissions = await Promise.all(
        missions.map(async (mission) => {
          if (!mission.entreprise?.nomEntreprise && mission.entreprise) {
            try {
              const entreprise = await entrepriseService.getEntrepriseById(mission.entreprise);
              return {
                ...mission,
                entreprise: {
                  ...mission.entreprise,
                  nomEntreprise: entreprise.nomEntreprise || 'Entreprise inconnue'
                }
              };
            } catch (error) {
              console.error("Error fetching entreprise:", error);
              return mission;
            }
          }
          return mission;
        })
      );
  
      setSavedMissions(enrichedMissions);
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
    console.log("ccc")
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
            <button className={styles.modalCloseBtn} onClick={() => setShowSavedModal(false)}>
                          &times;
                        </button>
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
                    <span className={styles.entreprise}>
  {mission.entreprise?.nomEntreprise || 'Entreprise non spécifiée'}
</span>                      <span className={styles.date}>Publié il y a {formatDistanceToNow(new Date(mission.publishedAt))}</span>
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
                        onClick={() =>{handleApplyToMission(mission);setShowSavedModal(false)} }
                        className={styles.applyButton}
                      >
                        Attribuer
                      </Button>
                    </div>
                  </div>
                ))
              ) : (
                <p>Aucune mission sauvegardée trouvée.</p>
              )}
            </div>
            <button className={styles.closeButton} onClick={() => setShowSavedModal(false)}>Terminer</button>
          </div>
        </div>
      )}


{/* Application Modal */}
{showApplyModal && selectedMission && (
  <div className={styles.modalOverlay}>
    <div className={styles.missionsModalContent} style={{ maxWidth: "500px" }}>
      <button 
        className={styles.modalCloseBtn} 
        onClick={() => {setShowApplyModal(false) ;setShowSavedModal(true)}}
      >
        ×
      </button>
      
      <div className={styles.modalHeader}>
        <h2>
          {`Attribuer un consultant à la mission : ${selectedMission.titre}`}
        </h2>
      </div>

      <div className={styles.modalFormGroup}>
        <label className={styles.formLabel}>Montant proposé :</label>
        <input 
          className={styles.modalInput} 
          type="number" 
          value={propositionMontant} 
          readOnly 
        />
      </div>

      <div className={styles.modalFormGroup}>
        <label className={styles.formLabel}>Durée estimée :</label>
        <input 
          className={styles.modalInput} 
          type="text" 
          value={propositionDuree} 
          readOnly 
        />
      </div>

      <div className={styles.modalFormGroup}>
        <label className={styles.formLabel}>Votre message :</label>
        <textarea
          className={styles.modalInput}
          rows={3}
          value={propositionMessage}
          onChange={e => setPropositionMessage(e.target.value)}
        />
      </div>
      <Typography 
  variant="caption" 
  color="textSecondary" 
  sx={{ 
    mt: 1, 
    mb: 2,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center', // Added this line for horizontal centering
    gap: '9px',
    textAlign: 'center' // Ensures text wraps properly when centered
  }}
>
  <FaBell style={{ 
    fontSize: '16px', 
    color: 'grey',
    flexShrink: 0
  }} />
  Une notification sera envoyé à l'entreprise concernant cette proposition
</Typography>
      <div className={styles.modalActions}>
        <button 
          className={styles.modalSubmitBtn} 
          onClick={handleSubmitApplication}
        >
          Envoyer la proposition
        </button>
      </div>
    </div>
  </div>
)}
    </div>
  );
};

export default CollaboratorsList;
