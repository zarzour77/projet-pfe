import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Header from "./Header";

// MUI
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  CircularProgress,
  Button,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

// Import des services depuis PropositionService.js
import { 
  getPropositionsByConsultant, 
  getMissionFromProposition, 
  deleteProposition,
  updatePropositionStatus,
  acceptRecruitmentProposition  // Fonction dédiée pour le recrutement
} from '../Services/PropositionService';

// Import des services pour les missions classiques
import { 
  acceptMission, 
  incrementConsultantWorkload,
  terminateMission,
  decrementConsultantWorkload
} from '../Services/EntrepriseMissionService';

// Import du service Entreprise pour récupérer les détails
import EntrepriseService from '../Services/EntrepriseService';

import styles from './ConsultantPropositions.module.css';

const ConsultantPropositions = () => {
  const [isLoading, setIsLoading] = useState(false);
  // États pour stocker les propositions par catégorie
  const [allPropositions, setAllPropositions] = useState([]);
  const [soumises, setSoumises] = useState([]);     // APPLIED et PENDING
  const [invitations, setInvitations] = useState([]); // INVITED et PENDING
  const [recruitments, setRecruitments] = useState([]); // RECRUTEMENT et PENDING
  const [actives, setActives] = useState([]);         // ACCEPTED
  const [refusees, setRefusees] = useState([]);         // REFUSED

  // Contrôle de l'Accordion
  const [expanded, setExpanded] = useState(null);
  const handleChangeAccordion = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : null);
  };

  // Fonction de récupération des propositions
  const fetchPropositions = async () => {
    try {
      setIsLoading(true);
      const storedUser = JSON.parse(localStorage.getItem('user'));
      const consultantId = storedUser?.user?.id || storedUser?.id;
      if (!consultantId) {
        toast.error('Impossible de récupérer le consultant');
        setIsLoading(false);
        return;
      }
      const propositions = await getPropositionsByConsultant(consultantId);
      console.log('Propositions récupérées:', propositions);
      setAllPropositions(propositions);

      // Filtrer les propositions par catégorie
      const filteredSoumises = propositions.filter(
        (p) =>
          p.origine?.toUpperCase() === 'APPLIED' &&
          p.statut?.toUpperCase() === 'PENDING'
      );
      const filteredInvitations = propositions.filter(
        (p) =>
          p.origine?.toUpperCase() === 'INVITED' &&
          p.statut?.toUpperCase() === 'PENDING'
      );
      const filteredRecruitments = propositions.filter(
        (p) =>
          p.origine?.toUpperCase() === 'RECRUTEMENT' &&
          p.statut?.toUpperCase() === 'PENDING'
      );
      const filteredActives = propositions.filter(
        (p) => p.statut?.toUpperCase() === 'ACCEPTED' &&
        p.origine?.toUpperCase() !== 'RECRUTEMENT' 

      );
      const filteredRefusees = propositions.filter(
        (p) => p.statut?.toUpperCase() === 'REFUSED'
      );
      console.log('Recruitments filtrés:', filteredRecruitments);
      setSoumises(filteredSoumises);
      setInvitations(filteredInvitations);
      setRecruitments(filteredRecruitments);
      setActives(filteredActives);
      setRefusees(filteredRefusees);
    } catch (error) {
      toast.error("Erreur lors de la récupération des propositions");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPropositions();
  }, []);

  // Handler pour accepter une invitation (ou un recrutement)
  const handleAccepterInvitation = async (proposition) => {
    try {
      const storedUser = JSON.parse(localStorage.getItem('user'));
      const consultantId = storedUser?.user?.id || storedUser?.id;
      if (!consultantId) {
        toast.error('Impossible de récupérer le consultant');
        return;
      }
      if (proposition.origine?.toUpperCase() === 'RECRUTEMENT') {
        const response = await acceptRecruitmentProposition(proposition.id);
        console.log('Réponse de acceptRecruitmentProposition:', response);
      } else {
        await updatePropositionStatus(proposition.id, "accepted");
        const mission = await getMissionFromProposition(proposition.id);
        console.log('Mission récupérée:', mission);
        if (mission && mission.id) {
          await acceptMission(mission.id);
        } else {
          toast.error("Mission non trouvée pour la proposition");
          return;
        }
        await incrementConsultantWorkload(consultantId);
      }
      toast.success("Invitation acceptée et charge de travail mise à jour");
      fetchPropositions();
    } catch (error) {
      toast.error("Erreur lors de l'acceptation de l'invitation");
      console.error(error);
    }
  };

  const handleTerminee = async (proposition) => {
    try {
      const storedUser = JSON.parse(localStorage.getItem('user'));
      const consultantId = storedUser?.user?.id || storedUser?.id;
      if (!consultantId) {
        toast.error('Impossible de récupérer le consultant');
        return;
      }
      await updatePropositionStatus(proposition.id, "terminée");
      const mission = await getMissionFromProposition(proposition.id);
      console.log('Mission pour terminer:', mission);
      if (!mission || !mission.id) {
        toast.error("Mission non trouvée pour la proposition");
        return;
      }
      const currentDate = new Date().toISOString();
      await terminateMission(mission.id, currentDate);
      await decrementConsultantWorkload(consultantId);
      toast.success("Mission terminée, proposition mise à jour, et charge de travail ajustée");
      fetchPropositions();
    } catch (error) {
      toast.error("Erreur lors de la finalisation de la mission");
      console.error(error);
    }
  };

  const handleRefuserInvitation = async (proposition) => {
    try {
      await updatePropositionStatus(proposition.id, "refused");
      toast.success("Invitation refusée");
      fetchPropositions();
    } catch (error) {
      toast.error("Erreur lors du refus de l'invitation");
      console.error(error);
    }
  };

  // Sous-composant pour afficher une proposition
  const PropositionItem = ({ proposition, category, refreshPropositions }) => {
    const [mission, setMission] = useState(null);
    const [loadingMission, setLoadingMission] = useState(category === "recruitments" ? false : true);
    const [entrepriseDetails, setEntrepriseDetails] = useState(null);
    const isRecruitment = proposition.origine?.toUpperCase() === 'RECRUTEMENT';

    // Si c'est une proposition de recrutement et que l'entreprise est un identifiant (nombre),
    // on récupère les détails complets depuis l'API Entreprise.
    useEffect(() => {
      if (isRecruitment && typeof proposition.entreprise === 'number') {
        const fetchEntreprise = async () => {
          try {
            const result = await EntrepriseService.getEntrepriseById(proposition.entreprise);
            console.log(`Entreprise pour la proposition ${proposition.id}:`, result);
            setEntrepriseDetails(result);
          } catch (error) {
            console.error("Erreur lors de la récupération de l'entreprise", error);
            toast.error("Erreur lors de la récupération de l'entreprise");
          }
        };
        fetchEntreprise();
      }
    }, [proposition.entreprise, isRecruitment, proposition.id]);

    // Pour les propositions non recrutements, on récupère la mission associée.
    useEffect(() => {
      if (!isRecruitment) {
        const fetchMission = async () => {
          try {
            const fetchedMission = await getMissionFromProposition(proposition.id);
            console.log(`Mission pour la proposition ${proposition.id}:`, fetchedMission);
            setMission(fetchedMission);
          } catch (error) {
            console.error("Erreur lors de la récupération de la mission", error);
            toast.error("Erreur lors de la récupération des informations de la mission");
          } finally {
            setLoadingMission(false);
          }
        };
        fetchMission();
      }
    }, [proposition.id, isRecruitment]);

    const dateProposition = proposition.dateProposition
      ? new Date(proposition.dateProposition).toLocaleDateString()
      : 'Date inconnue';

    // Mise à jour de l'affichage du titre en fonction de si c'est un recrutement
    const displayTitle = isRecruitment
      ? (entrepriseDetails
          ? `Recrutement de ${entrepriseDetails.nomEntreprise}`
          : 'Chargement entreprise...')
      : (loadingMission ? "Chargement..." : mission?.titre || 'Mission inconnue');

    const displayDetails = isRecruitment ? (
      <>
        <p>
          <strong>Entreprise : </strong>
          {entrepriseDetails
            ? entrepriseDetails.nomEntreprise
            : 'Chargement entreprise...'}
        </p>
      </>
    ) : (
      <>
        <p>
          <strong>Montant proposé : </strong>
          {proposition.montant ? `${proposition.montant} €` : 'N/A'}
        </p>
        <p>
          <strong>Durée estimée : </strong>
          {proposition.dureeEstime || 'N/A'}
        </p>
        <p>
          <strong>Entreprise : </strong>
          {loadingMission ? "Chargement..." : mission?.entreprise?.nomEntreprise || 'Entreprise inconnue'}
        </p>
      </>
    );

    const handleAnnuler = async () => {
      if (window.confirm("Voulez-vous annuler cette proposition ?")) {
        try {
          await deleteProposition(proposition.id);
          toast.success("Proposition annulée");
          refreshPropositions();
        } catch (error) {
          toast.error("Erreur lors de l'annulation de la proposition");
          console.error(error);
        }
      }
    };

    return (
      <motion.div
        key={proposition.id}
        className={styles.propositionItem}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        whileHover={{ scale: 1.01 }}
      >
        <div className={styles.propositionHeader}>
          <h4>{displayTitle}</h4>
          <span className={styles.statusBadge}>{proposition.statut}</span>
        </div>
        <div className={styles.propositionDetails}>
          {displayDetails}
          <p>
            <strong>Date de proposition : </strong>
            {dateProposition}
          </p>
          <p>
            <strong>Origine : </strong>
            {proposition.origine || 'N/A'}
          </p>
        </div>
        <div className={styles.propositionMessage}>
          <strong>Message : </strong>
          <span>{proposition.message || 'Aucun message'}</span>
        </div>
        {/* Boutons d'action selon la catégorie */}
        {(category === "invitations" || category === "recruitments") && (
          <div className={styles.actionButtons}>
            <Button variant="contained" color="success" size="small" onClick={() => handleAccepterInvitation(proposition)}>
              Accepter
            </Button>
            <Button variant="outlined" color="error" size="small" onClick={() => handleRefuserInvitation(proposition)}>
              Refuser
            </Button>
          </div>
        )}
        {category === "soumises" && (
          <div className={styles.actionButtons}>
            <Button variant="contained" color="error" size="small" onClick={handleAnnuler}>
              Annuler
            </Button>
          </div>
        )}
        {category === "actives" && (
          <div className={styles.actionButtons}>
            <Button variant="contained" color="primary" size="small" onClick={() => handleTerminee(proposition)}>
              Terminée
            </Button>
          </div>
        )}
        {category === "refusees" && (
          <div className={styles.actionButtons}>
            {/* Aucun bouton pour les propositions refusées */}
          </div>
        )}
      </motion.div>
    );
  };

  const renderPropositionsList = (list, category) => {
    if (!list || list.length === 0) {
      return <p className={styles.emptyMessage}>Aucune proposition ici.</p>;
    }
    return list.map((prop) => (
      <PropositionItem key={prop.id} proposition={prop} category={category} refreshPropositions={fetchPropositions} />
    ));
  };

  return (
    <div className={styles.mesPropositionsContainer}>
      <Header />
      <ToastContainer />
      <h3>Mes Propositions</h3>
      {isLoading ? (
        <div className={styles.loadingContainer}>
          <CircularProgress />
          <p>Chargement des propositions...</p>
        </div>
      ) : (
        <>
          <Accordion expanded={expanded === 'panel1'} onChange={handleChangeAccordion('panel1')}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography>Propositions soumises ({soumises.length})</Typography>
            </AccordionSummary>
            <AccordionDetails>{renderPropositionsList(soumises, "soumises")}</AccordionDetails>
          </Accordion>

          <Accordion expanded={expanded === 'panel2'} onChange={handleChangeAccordion('panel2')}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography>Invitations ({invitations.length})</Typography>
            </AccordionSummary>
            <AccordionDetails>{renderPropositionsList(invitations, "invitations")}</AccordionDetails>
          </Accordion>

          <Accordion expanded={expanded === 'panel5'} onChange={handleChangeAccordion('panel5')}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography>Recrutments ({recruitments.length})</Typography>
            </AccordionSummary>
            <AccordionDetails>{renderPropositionsList(recruitments, "recruitments")}</AccordionDetails>
          </Accordion>

          <Accordion expanded={expanded === 'panel3'} onChange={handleChangeAccordion('panel3')}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography>Propositions actives ({actives.length})</Typography>
            </AccordionSummary>
            <AccordionDetails>{renderPropositionsList(actives, "actives")}</AccordionDetails>
          </Accordion>

          <Accordion expanded={expanded === 'panel4'} onChange={handleChangeAccordion('panel4')}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography>Propositions refusées ({refusees.length})</Typography>
            </AccordionSummary>
            <AccordionDetails>{renderPropositionsList(refusees, "refusees")}</AccordionDetails>
          </Accordion>
        </>
      )}
    </div>
  );
};

export default ConsultantPropositions;