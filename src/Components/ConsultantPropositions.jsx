import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ConsultantHeader from "./ConsultantHeader";

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

// Import your service functions (including deleteProposition and updatePropositionStatus)
// After: import updatePropositionStatus, acceptMission, and incrementConsultantWorkload from EntrepriseMissionService
import { 
  getPropositionsByConsultant, 
  getMissionFromProposition, 
  deleteProposition
} from '../Services/PropositionService';

import { 
  updatePropositionStatus, 
  acceptMission, 
  incrementConsultantWorkload,
  terminateMission,          // New function to terminate a mission
  decrementConsultantWorkload  // New function to decrement workload
} from '../Services/EntrepriseMissionService';



// Import your CSS module
import styles from './ConsultantPropositions.module.css';

const ConsultantPropositions = () => {
  const [isLoading, setIsLoading] = useState(false);
  // We'll store the full list as well as filtered categories:
  const [allPropositions, setAllPropositions] = useState([]);
  const [soumises, setSoumises] = useState([]);     // origine: APPLIED and statut: PENDING
  const [invitations, setInvitations] = useState([]); // origine: INVITED and statut: PENDING
  const [actives, setActives] = useState([]);         // statut: ACCEPTED
  const [refusees, setRefusees] = useState([]);       // statut: REFUSED

  // Accordion control state
  const [expanded, setExpanded] = useState(null);
  const handleChangeAccordion = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : null);
  };

  // Define a reusable function to fetch propositions:
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
      console.log(propositions);
      setAllPropositions(propositions);

      // Filter propositions into categories based on the new logic
      setSoumises(
        propositions.filter(
          (p) =>
            p.origine?.toUpperCase() === 'APPLIED' &&
            p.statut?.toUpperCase() === 'PENDING'
        )
      );
      setInvitations(
        propositions.filter(
          (p) =>
            p.origine?.toUpperCase() === 'INVITED' &&
            p.statut?.toUpperCase() === 'PENDING'
        )
      );
      setActives(
        propositions.filter(
          (p) => p.statut?.toUpperCase() === 'ACCEPTED'
        )
      );
      setRefusees(
        propositions.filter(
          (p) => p.statut?.toUpperCase() === 'REFUSED'
        )
      );
    } catch (error) {
      toast.error("Erreur lors de la récupération des propositions");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch propositions on component mount
  useEffect(() => {
    fetchPropositions();
  }, []);

  // Handler for accepting an invitation
  // Handler for accepting an invitation
const handleAccepterInvitation = async (proposition) => {
  try {
    // Retrieve the consultant's id from localStorage
    const storedUser = JSON.parse(localStorage.getItem('user'));
    const consultantId = storedUser?.user?.id || storedUser?.id;
    if (!consultantId) {
      toast.error('Impossible de récupérer le consultant');
      return;
    }

    // 1. Update the proposition status to "accepted"
    await updatePropositionStatus(proposition.id, "accepted");

    // 2. Fetch the mission details linked to this proposition
    const mission = await getMissionFromProposition(proposition.id);
    if (mission && mission.id) {
      // Call the endpoint to accept the mission
      await acceptMission(mission.id);
    } else {
      toast.error("Mission non trouvée pour la proposition");
      return;
    }

    // 3. Increment the consultant's workload
    await incrementConsultantWorkload(consultantId);

    toast.success("Invitation acceptée, mission confirmée et charge de travail mise à jour");
    fetchPropositions();
  } catch (error) {
    toast.error("Erreur lors de l'acceptation de l'invitation");
    console.error(error);
  }
};
const handleTerminee = async (proposition) => {
  try {
    // Retrieve the consultant's id from localStorage
    const storedUser = JSON.parse(localStorage.getItem('user'));
    const consultantId = storedUser?.user?.id || storedUser?.id;
    if (!consultantId) {
      toast.error('Impossible de récupérer le consultant');
      return;
    }

    // 1. Update the proposition status to "terminée"
    await updatePropositionStatus(proposition.id, "terminée");

    // 2. Fetch the mission details linked to this proposition
    const mission = await getMissionFromProposition(proposition.id);
    if (!mission || !mission.id) {
      toast.error("Mission non trouvée pour la proposition");
      return;
    }

    // 3. Update the mission status to "terminée" and set the end date to the current date
    const currentDate = new Date().toISOString();
    await terminateMission(mission.id, currentDate);

    // 4. Decrement the consultant's workload by 1
    await decrementConsultantWorkload(consultantId);

    toast.success("Mission terminée, proposition mise à jour, et charge de travail ajustée");
    fetchPropositions();
  } catch (error) {
    toast.error("Erreur lors de la finalisation de la mission");
    console.error(error);
  }
};


  // Handler for refusing an invitation
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

  // Sub-component to render a single proposition
  // Receives the proposition, its category and a callback to refresh propositions after deletion.
  const PropositionItem = ({ proposition, category, refreshPropositions }) => {
    const [mission, setMission] = useState(null);
    const [loadingMission, setLoadingMission] = useState(true);

    useEffect(() => {
      const fetchMission = async () => {
        try {
          // Fetch mission details using proposition.id
          const fetchedMission = await getMissionFromProposition(proposition.id);
          setMission(fetchedMission);
        } catch (error) {
          console.error("Erreur lors de la récupération de la mission", error);
          toast.error("Erreur lors de la récupération des informations de la mission");
        } finally {
          setLoadingMission(false);
        }
      };
      fetchMission();
    }, [proposition.id]);

    // Format the date to display only the date (without time)
    const dateProposition = proposition.dateProposition
      ? new Date(proposition.dateProposition).toLocaleDateString()
      : 'Date inconnue';

    const missionTitle = loadingMission ? "Chargement..." : mission?.titre || 'Mission inconnue';
    const entrepriseName = loadingMission
      ? "Chargement..."
      : mission?.entreprise?.nomEntreprise || 'Entreprise inconnue';

    // Handler for the "Annuler" button (for propositions soumises)
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
          <h4>{missionTitle}</h4>
          <span className={styles.statusBadge}>{proposition.statut}</span>
        </div>
        <div className={styles.propositionDetails}>
          <p>
            <strong>Entreprise : </strong>
            {entrepriseName}
          </p>
          <p>
            <strong>Montant proposé : </strong>
            {proposition.montant ? `${proposition.montant} €` : 'N/A'}
          </p>
          <p>
            <strong>Durée estimée : </strong>
            {proposition.dureeEstime || 'N/A'}
          </p>
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
        {/* Render buttons based on the category */}
        {category === "invitations" && (
          <div className={styles.actionButtons}>
            <Button
              variant="contained"
              color="success"
              size="small"
              onClick={() => handleAccepterInvitation(proposition)}
            >
              Accepter
            </Button>
            <Button
              variant="outlined"
              color="error"
              size="small"
              onClick={() => handleRefuserInvitation(proposition)}
            >
              Refuser
            </Button>
          </div>
        )}
        {category === "soumises" && (
          <div className={styles.actionButtons}>
            <Button
              variant="contained"
              color="error"
              size="small"
              onClick={handleAnnuler}
            >
              Annuler
            </Button>
          </div>
        )}
        {category === "actives" && (
  <div className={styles.actionButtons}>
    <Button
      variant="contained"
      color="primary"
      size="small"
      onClick={() => handleTerminee(proposition)}
    >
      Terminée
    </Button>
  </div>
)}

        {category === "refusees" && (
          <div className={styles.actionButtons}>
            {/* No buttons for propositions refusées */}
          </div>
        )}
      </motion.div>
    );
  };

  // Helper to render a list of propositions for a given category
  const renderPropositionsList = (list, category) => {
    if (!list || list.length === 0) {
      return <p className={styles.emptyMessage}>Aucune proposition ici.</p>;
    }
    return list.map((prop) => (
      <PropositionItem
        key={prop.id}
        proposition={prop}
        category={category}
        refreshPropositions={fetchPropositions}
      />
    ));
  };

  return (
    <div className={styles.mesPropositionsContainer}>
      <ConsultantHeader />
      <ToastContainer />
      <h3>Mes Propositions</h3>
      {isLoading ? (
        <div className={styles.loadingContainer}>
          <CircularProgress />
          <p>Chargement des propositions...</p>
        </div>
      ) : (
        <>
          {/* Propositions soumises */}
          <Accordion
            expanded={expanded === 'panel1'}
            onChange={handleChangeAccordion('panel1')}
          >
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography>Propositions soumises ({soumises.length})</Typography>
            </AccordionSummary>
            <AccordionDetails>
              {renderPropositionsList(soumises, "soumises")}
            </AccordionDetails>
          </Accordion>

          {/* Invitations */}
          <Accordion
            expanded={expanded === 'panel2'}
            onChange={handleChangeAccordion('panel2')}
          >
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography>Invitations ({invitations.length})</Typography>
            </AccordionSummary>
            <AccordionDetails>
              {renderPropositionsList(invitations, "invitations")}
            </AccordionDetails>
          </Accordion>

          {/* Propositions actives */}
          <Accordion
            expanded={expanded === 'panel3'}
            onChange={handleChangeAccordion('panel3')}
          >
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography>Propositions actives ({actives.length})</Typography>
            </AccordionSummary>
            <AccordionDetails>
              {renderPropositionsList(actives, "actives")}
            </AccordionDetails>
          </Accordion>

          {/* Propositions refusées */}
          <Accordion
            expanded={expanded === 'panel4'}
            onChange={handleChangeAccordion('panel4')}
          >
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography>Propositions refusées ({refusees.length})</Typography>
            </AccordionSummary>
            <AccordionDetails>
              {renderPropositionsList(refusees, "refusees")}
            </AccordionDetails>
          </Accordion>
        </>
      )}
    </div>
  );
};

export default ConsultantPropositions;
