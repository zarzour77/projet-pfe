/* eslint-disable react/no-unescaped-entities */
import { useEffect, useRef, useState } from 'react';
import ConsultantService from '../Services/ConsultantService';
import CompetenceService from '../Services/CompetenceService';
import DomaineService from '../Services/DomaineService';
import styles from './ProfilePage.module.css';
import LangueService from '../Services/LangueService';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ConsultantHeader from "./ConsultantHeader";

const ProfilePage = () => {
  const storedUser = JSON.parse(localStorage.getItem("user"));
  const consultantId = storedUser?.id;
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Experience view and update states
  const [selectedExperience, setSelectedExperience] = useState(null);
  const [updateField, setUpdateField] = useState(null);
  const [updateValue, setUpdateValue] = useState('');
  const [updatePrenom, setUpdatePrenom] = useState('');
  const [updateNom, setUpdateNom] = useState('');
  const [showUpdateModal, setShowUpdateModal] = useState(false);

  // Experience modal states
  const [showAddExperienceModal, setShowAddExperienceModal] = useState(false);
  const [newExpRole, setNewExpRole] = useState('');
  const [newExpEntreprise, setNewExpEntreprise] = useState('');
  const [newExpDateDebut, setNewExpDateDebut] = useState('');
  const [newExpDateFin, setNewExpDateFin] = useState('');
  const [newExpDescription, setNewExpDescription] = useState('');

  // Competence modal states
  const [showAddCompetenceModal, setShowAddCompetenceModal] = useState(false);
  const [allCompetences, setAllCompetences] = useState([]);
  const [selectedCompetence, setSelectedCompetence] = useState('');
  const [customCompetence, setCustomCompetence] = useState('');
  const [newCompetenceLevel, setNewCompetenceLevel] = useState('');

  // Domaine modal states
  const [showAddDomaineModal, setShowAddDomaineModal] = useState(false);
  const [allDomaines, setAllDomaines] = useState([]);
  const [selectedDomaine, setSelectedDomaine] = useState('');
  const [customDomaine, setCustomDomaine] = useState('');

  // CV preview modal states
  const [showCvModal, setShowCvModal] = useState(false);
  const [pdfPreviewUrl, setPdfPreviewUrl] = useState("");

  // Ref for file input
  const fileInputRef = useRef(null);

  // Langue modal states
  const [showAddLangueModal, setShowAddLangueModal] = useState(false);
  const [allLangues, setAllLangues] = useState([]);
  const [selectedLangue, setSelectedLangue] = useState('');
  const [customLangue, setCustomLangue] = useState('');
  const [newLangueLevel, setNewLangueLevel] = useState('');

  // Formation modal states
  const [showAddFormationModal, setShowAddFormationModal] = useState(false);
  const [newFormationDiplome, setNewFormationDiplome] = useState('');
  const [newFormationUniversite, setNewFormationUniversite] = useState('');
  const [newFormationDateDebut, setNewFormationDateDebut] = useState('');
  const [newFormationDateFin, setNewFormationDateFin] = useState('');

  // Certification modal states
  const [showAddCertificationModal, setShowAddCertificationModal] = useState(false);
  const [newCertificationNom, setNewCertificationNom] = useState('');
  const [newCertificationOrganisme, setNewCertificationOrganisme] = useState('');
  const [newCertificationDateObtention, setNewCertificationDateObtention] = useState('');

  // Formation modal handlers
  const openAddFormationModal = () => setShowAddFormationModal(true);
  const closeAddFormationModal = () => {
    setShowAddFormationModal(false);
    setNewFormationDiplome('');
    setNewFormationUniversite('');
    setNewFormationDateDebut('');
    setNewFormationDateFin('');
  };

  // Certification modal handlers
  const openAddCertificationModal = () => setShowAddCertificationModal(true);
  const closeAddCertificationModal = () => {
    setShowAddCertificationModal(false);
    setNewCertificationNom('');
    setNewCertificationOrganisme('');
    setNewCertificationDateObtention('');
  };

  // Fetch consultant data on mount or when consultantId changes
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        const consultantData = await ConsultantService.getConsultantById(consultantId);
        console.log("Fetched consultantData:", consultantData); // Log the fetched data
        setUser(consultantData);
      } catch (error) {
        console.error("Erreur lors de la récupération:", error);
        toast.error("Erreur lors du chargement du profil");
      } finally {
        setLoading(false);
      }
    };
  
    if (consultantId) {
      fetchUserData();
    }
  }, [consultantId]);
  

  // Fetch options for competences, domaines, and langues
  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const [competences, domaines, langues] = await Promise.all([
          CompetenceService.getAllCompetences(),
          DomaineService.getAllDomaines(),
          LangueService.getAllLangues()
        ]);
        setAllCompetences(competences);
        setAllDomaines(domaines);
        setAllLangues(langues);
      } catch (error) {
        console.error("Erreur lors de la récupération des options:", error);
        toast.error("Erreur lors du chargement des options");
      }
    };

    fetchOptions();
  }, []);

  const handleExperienceClick = (exp) => setSelectedExperience(exp);
  const closeExperienceModal = () => setSelectedExperience(null);

  const openUpdateModal = (fieldName, currentValue) => {
    setUpdateField(fieldName);
    if (fieldName === 'nom complet') {
      setUpdatePrenom(user.prenom);
      setUpdateNom(user.nom);
    } else {
      setUpdateValue(currentValue || '');
    }
    setShowUpdateModal(true);
  };

  const closeUpdateModal = () => {
    setShowUpdateModal(false);
    setUpdateField(null);
    setUpdateValue('');
    setUpdatePrenom('');
    setUpdateNom('');
  };

  const handleUpdateSubmit = async () => {
    try {
      let updatedData;
      if (updateField === 'nom complet') {
        updatedData = { prenom: updatePrenom, nom: updateNom };
      } else {
        updatedData = { [updateField]: updateValue };
      }
      const updatedUser = await ConsultantService.updateConsultant(user.id, updatedData);
      setUser(updatedUser);
      await ConsultantService.saveCv(user.id);
      localStorage.setItem("user", JSON.stringify(updatedUser));
      toast.success("Profil mis à jour avec succès!");
      closeUpdateModal();
    } catch (error) {
      console.error("Erreur lors de la mise à jour:", error);
      toast.error("Erreur lors de la mise à jour du profil");
    }
  };

  const handleProfilePicClick = () => fileInputRef.current.click();

  const handleProfilePicChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      await ConsultantService.uploadProfilePicture(user.id, file);
      const updatedUser = await ConsultantService.getConsultantById(user.id);
      setUser(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));
      toast.success("Image de profil mise à jour avec succès!");
    } catch (error) {
      console.error("Erreur lors du téléchargement de l'image de profil:", error);
      toast.error("Erreur lors du téléchargement de l'image de profil");
    }
  };

  // Experience modal handlers
  const openAddExperienceModal = () => setShowAddExperienceModal(true);
  const closeAddExperienceModal = () => {
    setShowAddExperienceModal(false);
    setNewExpRole('');
    setNewExpEntreprise('');
    setNewExpDateDebut('');
    setNewExpDateFin('');
    setNewExpDescription('');
  };

  const handleAddExperienceSubmit = async (e) => {
    e.preventDefault();
    try {
      const newExperience = {
        role: newExpRole,
        entreprise: newExpEntreprise,
        dateDebut: newExpDateDebut,
        dateFin: newExpDateFin,
        description: newExpDescription,
      };
      const updatedUser = await ConsultantService.addExperience(user.id, newExperience);
      setUser(updatedUser);
      await ConsultantService.saveCv(user.id);
      localStorage.setItem("user", JSON.stringify(updatedUser));
      toast.success("Expérience ajoutée avec succès!");
    } catch (error) {
      console.error("Erreur lors de l'ajout de l'expérience:", error);
      toast.error("Erreur lors de l'ajout de l'expérience");
    }
  };

  // Competence modal handlers
  const openAddCompetenceModal = () => {
    setShowAddCompetenceModal(true);
    setSelectedCompetence('');
    setCustomCompetence('');
    setNewCompetenceLevel('');
  };

  const closeAddCompetenceModal = () => {
    setShowAddCompetenceModal(false);
    setSelectedCompetence('');
    setCustomCompetence('');
    setNewCompetenceLevel('');
  };

  const handleAddCompetenceSubmit = async (e) => {
    e.preventDefault();
    try {
      const competenceName = selectedCompetence === "other" ? customCompetence : selectedCompetence;
      if (!competenceName || !newCompetenceLevel) {
        toast.error("Veuillez remplir tous les champs");
        return;
      }
      const existing = allCompetences.find(c => c.nom.toLowerCase() === competenceName.toLowerCase());
      let competenceToAdd;
      if (existing) {
        competenceToAdd = existing;
      } else {
        competenceToAdd = { nom: competenceName, competenceNiveau: newCompetenceLevel };
      }
      const updatedUser = await ConsultantService.addCompetence(user.id, competenceToAdd);
      setUser(updatedUser);
      await ConsultantService.saveCv(user.id);
      localStorage.setItem("user", JSON.stringify(updatedUser));
      toast.success("Compétence ajoutée avec succès!");
      if (!existing) {
        setAllCompetences([...allCompetences, competenceToAdd]);
      }
      closeAddCompetenceModal();
    } catch (error) {
      console.error("Erreur lors de l'ajout de la compétence:", error);
      toast.error("Erreur lors de l'ajout de la compétence");
    }
  };

  // Domaine modal handlers
  const openAddDomaineModal = () => {
    setShowAddDomaineModal(true);
    setSelectedDomaine('');
    setCustomDomaine('');
  };

  const closeAddDomaineModal = () => {
    setShowAddDomaineModal(false);
    setSelectedDomaine('');
    setCustomDomaine('');
  };

  const handleAddDomaineSubmit = async (e) => {
    e.preventDefault();
    try {
      const domaineName = selectedDomaine === "other" ? customDomaine : selectedDomaine;
      if (!domaineName) {
        toast.error("Veuillez remplir le domaine");
        return;
      }
      const existing = allDomaines.find(d => d.nom.toLowerCase() === domaineName.toLowerCase());
      let domaineToAdd;
      if (existing) {
        domaineToAdd = existing;
      } else {
        domaineToAdd = { nom: domaineName, category: null };
      }
      const updatedUser = await ConsultantService.addDomaine(user.id, domaineToAdd);
      setUser(updatedUser);
      await ConsultantService.saveCv(user.id);
      localStorage.setItem("user", JSON.stringify(updatedUser));
      toast.success("Domaine ajouté avec succès!");
      if (!existing) {
        setAllDomaines([...allDomaines, domaineToAdd]);
      }
      closeAddDomaineModal();
    } catch (error) {
      console.error("Erreur lors de l'ajout du domaine:", error);
      toast.error("Erreur lors de l'ajout du domaine");
    }
  };

  // Langue modal handlers
  const openAddLangueModal = () => {
    setShowAddLangueModal(true);
    setSelectedLangue('');
    setCustomLangue('');
    setNewLangueLevel('');
  };

  const closeAddLangueModal = () => {
    setShowAddLangueModal(false);
    setSelectedLangue('');
    setCustomLangue('');
    setNewLangueLevel('');
  };

  const handleAddLangueSubmit = async (e) => {
    e.preventDefault();
    try {
      const langueName = selectedLangue === "other" ? customLangue : selectedLangue;
      if (!langueName || !newLangueLevel) {
        toast.error("Veuillez remplir tous les champs");
        return;
      }
      const existing = allLangues.find(l => l.nom.toLowerCase() === langueName.toLowerCase());
      let langueToAdd;
      if (existing) {
        langueToAdd = existing;
      } else {
        langueToAdd = { nom: langueName, niveau: newLangueLevel };
      }
      const updatedUser = await ConsultantService.addLangue(user.id, langueToAdd);
      setUser(updatedUser);
      await ConsultantService.saveCv(user.id);
      localStorage.setItem("user", JSON.stringify(updatedUser));
      toast.success("Langue ajoutée avec succès!");
      if (!existing) {
        setAllLangues([...allLangues, langueToAdd]);
      }
      closeAddLangueModal();
    } catch (error) {
      console.error("Erreur lors de l'ajout de la langue:", error);
      toast.error("Erreur lors de l'ajout de la langue");
    }
  };

  // Delete handlers
  const handleDeleteCompetence = async (competenceId) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer cette compétence ?")) {
      try {
        await ConsultantService.deleteCompetence(user.id, competenceId);
        const updatedUser = await ConsultantService.getConsultantById(user.id);
        setUser(updatedUser);
        await ConsultantService.saveCv(user.id);
        localStorage.setItem("user", JSON.stringify(updatedUser));
        toast.success("Compétence supprimée avec succès!");
      } catch (error) {
        console.error("Erreur lors de la suppression de la compétence:", error);
        toast.error("Erreur lors de la suppression de la compétence");
      }
    }
  };

  const handleDeleteDomaine = async (domaineId) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer ce domaine ?")) {
      try {
        await ConsultantService.deleteDomaine(user.id, domaineId);
        const updatedUser = await ConsultantService.getConsultantById(user.id);
        setUser(updatedUser);
        await ConsultantService.saveCv(user.id);
        localStorage.setItem("user", JSON.stringify(updatedUser));
        toast.success("Domaine supprimé avec succès!");
      } catch (error) {
        console.error("Erreur lors de la suppression du domaine:", error);
        toast.error("Erreur lors de la suppression du domaine");
      }
    }
  };

  const handleDeleteLangue = async (langueId) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer cette langue ?")) {
      try {
        await ConsultantService.deleteLangue(user.id, langueId);
        const updatedUser = await ConsultantService.getConsultantById(user.id);
        setUser(updatedUser);
        await ConsultantService.saveCv(user.id);
        localStorage.setItem("user", JSON.stringify(updatedUser));
        toast.success("Langue supprimée avec succès!");
      } catch (error) {
        console.error("Erreur lors de la suppression de la langue:", error);
        toast.error("Erreur lors de la suppression de la langue");
      }
    }
  };

  const handleDeleteFormation = async (formationId) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer cette formation ?")) {
      try {
        await ConsultantService.deleteFormation(user.id, formationId);
        const updatedUser = await ConsultantService.getConsultantById(user.id);
        setUser(updatedUser);
        await ConsultantService.saveCv(user.id);
        localStorage.setItem("user", JSON.stringify(updatedUser));
        toast.success("Formation supprimée avec succès!");
      } catch (error) {
        console.error("Erreur lors de la suppression de la formation:", error);
        toast.error("Erreur lors de la suppression de la formation");
      }
    }
  };

  const handleDeleteCertification = async (certificationId) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer cette certification ?")) {
      try {
        await ConsultantService.deleteCertification(user.id, certificationId);
        const updatedUser = await ConsultantService.getConsultantById(user.id);
        setUser(updatedUser);
        await ConsultantService.saveCv(user.id);
        localStorage.setItem("user", JSON.stringify(updatedUser));
        toast.success("Certification supprimée avec succès!");
      } catch (error) {
        console.error("Erreur lors de la suppression de la certification:", error);
        toast.error("Erreur lors de la suppression de la certification");
      }
    }
  };

  const handleAddFormationSubmit = async (e) => {
    e.preventDefault();
    try {
      const newFormation = {
        diplome: newFormationDiplome,
        universite: newFormationUniversite,
        dateDebut: newFormationDateDebut,
        dateFin: newFormationDateFin
      };
      const updatedUser = await ConsultantService.addFormation(user.id, newFormation);
      setUser(updatedUser);
      await ConsultantService.saveCv(user.id);
      localStorage.setItem("user", JSON.stringify(updatedUser));
      toast.success("Formation ajoutée avec succès!");
      closeAddFormationModal();
    } catch (error) {
      console.error("Erreur lors de l'ajout de la formation:", error);
      toast.error("Erreur lors de l'ajout de la formation");
    }
  };
  const handleDeleteExperience = async (expId) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer cette expérience ?")) {
      try {
        await ConsultantService.deleteExperience(user.id, expId);
        const updatedUser = await ConsultantService.getConsultantById(user.id);
        await ConsultantService.saveCv(user.id);
        setUser(updatedUser);
        localStorage.setItem("user", JSON.stringify(updatedUser));
        toast.success("Expérience supprimée avec succès!");
      } catch (error) {
        console.error("Erreur lors de la suppression de l'expérience:", error);
        toast.error("Erreur lors de la suppression de l'expérience");
      }
    }
  };
  const handleAddCertificationSubmit = async (e) => {
    e.preventDefault();
    try {
      const newCertification = {
        nom: newCertificationNom,
        organisme: newCertificationOrganisme,
        dateObtention: newCertificationDateObtention,
      };
      const updatedUser = await ConsultantService.addCertification(user.id, newCertification);
      setUser(updatedUser);
      await ConsultantService.saveCv(user.id);
      localStorage.setItem("user", JSON.stringify(updatedUser));
      toast.success("Certification ajoutée avec succès!");
      closeAddCertificationModal();
    } catch (error) {
      console.error("Erreur lors de l'ajout de la certification:", error);
      toast.error("Erreur lors de l'ajout de la certification");
    }
  };

  // CV generation and download functions
  const handleGenerateCV = async () => {
    try {
      const response = await ConsultantService.generateCv(user.id);
      const blob = new Blob([response], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      setPdfPreviewUrl(url);
      setShowCvModal(true);
    } catch (error) {
      console.error("Erreur lors de la génération du CV:", error);
      toast.error("Erreur lors de la génération du CV");
    }
  };

  const handleDownloadCV = () => {
    if (pdfPreviewUrl) {
      const link = document.createElement("a");
      link.href = pdfPreviewUrl;
      link.download = "cv.pdf";
      link.click();
    }
  };

  if (loading) return <div className={styles.loading}>Chargement...</div>;
  if (!user) return <div className={styles.error}>Erreur lors du chargement du profil</div>;

  // Create distinct options for competences and langues
  const distinctCompetenceOptions = Array.from(
    new Map(allCompetences.map(c => [c.nom.toLowerCase(), { id: c.id, nom: c.nom }])).values()
  );
  const distinctLangueOptions = Array.from(
    new Map(allLangues.map(l => [l.nom.toLowerCase(), { id: l.id, nom: l.nom }])).values()
  );
  return (
    <div className={styles.pageWrapper}>
      {/* Add ConsultantHeader here */}
      <ConsultantHeader />
    <div className={styles.profileContainer}>
      {/* Toast container to show notifications */}
      <ToastContainer position="top-right" />
      
      <div className={styles.profileHeader}>
        <button className={styles.cvButton} onClick={handleGenerateCV}>
          <i className={`bi bi-file-earmark-text ${styles.cvIcon}`}></i>
          <span className={styles.cvText}>Générer mon CV</span>
        </button>
        {/* Profile picture container with overlay edit button */}
        <div className={styles.profilePhotoContainer}>
          <img
            src={user.photoprofile || '/default-avatar.png'}
            alt="Profil"
            className={styles.profilePhoto}
          />
          <button
            className={styles.profilePhotoEditBtn}
            onClick={handleProfilePicClick}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-pencil-square" viewBox="0 1 16 16">
              <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z" />
              <path fillRule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z" />
            </svg>
          </button>
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            style={{ display: 'none' }}
            onChange={handleProfilePicChange}
          />
        </div>
        <h1 className={styles.profileName}>{user.prenom} {user.nom}</h1>
        <span className={`${styles.roleBadge} ${user.role === 'entreprise' ? styles.entrepriseBadge : styles.consultantBadge}`}>
          {user.role}
        </span>
      </div>

      {/* Informations de base */}
      <div className={styles.profileSection}>
      <h2 className={styles.sectionTitle}>Informations de base</h2>

      {/* Two-column layout */}
      <div className={styles.infoGridP}>
        {/* LEFT COLUMN: Basic Info */}
        <div className={styles.leftColumn}>
          {/* Nom complet */}
          <div className={styles.infoItem}>
            <div className={styles.infoHeader}>
              <label className={styles.infoLabel}>Nom complet</label>
              <button
                className={styles.editBtn}
                onClick={() =>
                  openUpdateModal("nom complet", {
                    prenom: user.prenom,
                    nom: user.nom,
                  })
                }
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="currentColor"
                  className="bi bi-pencil-square"
                  viewBox="0 1 16 16"
                >
                  <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z" />
                  <path
                    fillRule="evenodd"
                    d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z"
                  />
                </svg>
              </button>
            </div>
            <p className={styles.infoValue}>
              {user.prenom} {user.nom}
            </p>
          </div>

          {/* E-mail */}
          <div className={styles.infoItem}>
            <div className={styles.infoHeader}>
              <label className={styles.infoLabel}>E-mail</label>
              <button
                className={styles.editBtn}
                onClick={() => openUpdateModal("email", user.email)}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="currentColor"
                  className="bi bi-pencil-square"
                  viewBox="0 1 16 16"
                >
                  <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z" />
                  <path
                    fillRule="evenodd"
                    d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z"
                  />
                </svg>
              </button>
            </div>
            <p className={styles.infoValue}>{user.email}</p>
          </div>

          {/* Téléphone */}
          <div className={styles.infoItem}>
            <div className={styles.infoHeader}>
              <label className={styles.infoLabel}>Téléphone</label>
              <button
                className={styles.editBtn}
                onClick={() => openUpdateModal("telephone", user.telephone)}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="currentColor"
                  className="bi bi-pencil-square"
                  viewBox="0 1 16 16"
                >
                  <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z" />
                  <path
                    fillRule="evenodd"
                    d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z"
                  />
                </svg>
              </button>
            </div>
            <p className={styles.infoValue}>
              {user.telephone || "Non fourni"}
            </p>
          </div>

          {/* Adresse */}
          <div className={styles.infoItem}>
            <div className={styles.infoHeader}>
              <label className={styles.infoLabel}>Adresse</label>
              <button
                className={styles.editBtn}
                onClick={() => openUpdateModal("adresse", user.adresse)}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="currentColor"
                  className="bi bi-pencil-square"
                  viewBox="0 1 16 16"
                >
                  <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z" />
                  <path
                    fillRule="evenodd"
                    d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z"
                  />
                </svg>
              </button>
            </div>
            <p className={styles.infoValue}>
              {user.adresse || "Non fourni"}
            </p>
          </div>

          {/* Évaluation */}
          <div className={styles.infoItem}>
            <label className={styles.infoLabel}>Évaluation</label>
            <p className={styles.infoValue}>
              {user.rating ? `${user.rating}/5` : "Pas d’évaluation"}
            </p>
          </div>
        </div>

        {/* RIGHT COLUMN: Abonnement */}
        <div className={styles.rightColumn}>
  <div className={styles.infoItem}>
    <label className={styles.infoLabel}>Abonnement</label>
    <p className={styles.infoValue}>
      {user.subscriptions && user.subscriptions.length > 0
        ? user.subscriptions.find(
            (sub) =>
              sub.statut &&
              sub.statut.toLowerCase() === "actif"
          )?.planType || "Aucun abonnement renseigné"
        : "Aucun abonnement renseigné"}
    </p>
    <button className={styles.changeOfferButton}>
      Changer l'offre
    </button>
  </div>
</div>

      </div>
    </div>


      {/* Informations professionnelles */}
      {user.role === 'Consultant' && (
  <div className={styles.profileSection}>
    <h2 className={styles.sectionTitle}>Informations professionnelles</h2>
    <div className={styles.infoGrid}>
      {/* Compétences Section */}
      <div className={styles.infoItem}>
        <div className={styles.infoHeader}>
          <label className={styles.infoLabel}>Compétences</label>
          <button className={styles.addCompetenceBtn} onClick={openAddCompetenceModal}>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
              <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z"/>
            </svg>
          </button>
        </div>
        <div className={styles.competenceList}>
          {user.competences?.length > 0 ? (
            user.competences.map((c) => (
              <div key={c.id} className={styles.competenceItem}>
                <span className={styles.competenceName}>
                  {c.nom} ({c.competenceNiveau})
                </span>
                <button 
                  className={styles.deleteCompetenceBtn} 
                  onClick={() => handleDeleteCompetence(c.id)}
                  title="Supprimer la compétence"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z"/>
                    <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z"/>
                  </svg>
                </button>
              </div>
            ))
          ) : (
            <span className={styles.noData}>Aucune compétence listée</span>
          )}
        </div>
      </div>

      {/* Domaines Section */}
      <div className={styles.infoItem}>
        <div className={styles.infoHeader}>
          <label className={styles.infoLabel}>Domaines</label>
          <button className={styles.addDomaineBtn} onClick={openAddDomaineModal}>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
              <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z"/>
            </svg>
          </button>
        </div>
        <div className={styles.domainesList}>
          {user.domaines?.length > 0 ? (
            user.domaines.map((d) => (
              <div key={d.id} className={styles.domaineItem}>
                <span className={styles.domainName}>{d.nom}</span>
                <button 
                  className={styles.deleteDomaineBtn}
                  onClick={() => handleDeleteDomaine(d.id)}
                  title="Supprimer le domaine"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z"/>
                    <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z"/>
                  </svg>
                </button>
              </div>
            ))
          ) : (
            <span className={styles.noData}>Aucun domaine spécifié</span>
          )}
        </div>
      </div>

      {/* Langues Section */}
      <div className={styles.infoItem}>
  <div className={styles.infoHeader}>
    <label className={styles.infoLabel}>Langues</label>
    <button className={styles.addLangueBtn} onClick={openAddLangueModal}>
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
        <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z"/>
      </svg>
    </button>
  </div>
  <div className={styles.languesList}>
    {user.langues?.length > 0 ? (
      user.langues.map((langue) => (
        <div key={langue.id} className={styles.langueItem}>
          <span className={styles.langueName}>
            {langue.nom} ({langue.niveau})
          </span>
          <button 
            className={styles.deleteLangueBtn} 
            onClick={() => handleDeleteLangue(langue.id)}
            title="Supprimer la langue"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
              <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z"/>
              <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z"/>
            </svg>
          </button>
        </div>
      ))
    ) : (
      <span className={styles.noData}>Aucune langue renseignée</span>
    )}
  </div>
</div>
    </div>
  </div>
)}

      {/* Expériences professionnelles */}
      {user.experiences && (
        <div className={styles.profileSection}>
          <div className={styles.infoHeader}>
            <h2 className={styles.sectionTitle}>Expériences professionnelles</h2>
            <button className={styles.addExperienceBtn} onClick={openAddExperienceModal}>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z"/>
              </svg>
            </button>
          </div>
          {user.experiences.length > 0 ? (
            <div className={styles.experiencesGrid}>
              {user.experiences.map((exp) => (
                <div key={exp.id} className={styles.experienceCard}>
                  <div className={styles.experienceHeader}>
                    <h3 className={styles.experienceRole}>{exp.role}</h3>
                    <p className={styles.experienceDates}>( {exp.dateDebut} - {exp.dateFin} )</p>
                  </div>
                  <p className={styles.experienceEntreprise}>{exp.entreprise}</p>
                  <div className={styles.descriptionContainer}>
                    <button className={styles.viewBtn} onClick={() => handleExperienceClick(exp)}>
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                        <path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8M1.173 8a13 13 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5s3.879 1.168 5.168 2.457A13 13 0 0 1 14.828 8q-.086.13-.195.288c-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5s-3.879-1.168-5.168-2.457A13 13 0 0 1 1.172 8z"/>
                        <path d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5M4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0"/>
                      </svg>
                    </button>
                    <button className={styles.deleteBtn} onClick={() => handleDeleteExperience(exp.id)}>
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                        <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z"/>
                        <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z"/>
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className={styles.noData}>Aucune expérience renseignée</p>
          )}
        </div>
      )}

{/* Formations Section */}
{user.formations && (
  <div className={styles.profileSection}>
    <div className={styles.infoHeader}>
      <h2 className={styles.sectionTitle}>Formations</h2>
      <button className={styles.addExperienceBtn} onClick={openAddFormationModal}>
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
          <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z"/>
        </svg>
      </button>
    </div>
    {user.formations.length > 0 ? (
      <div className={styles.experiencesGrid}>
        {user.formations.map((formation) => (
          <div key={formation.id} className={styles.experienceCard}>
            <div className={styles.experienceHeader}>
              <h3 className={styles.experienceRole}>{formation.diplome}</h3>
              <p className={styles.experienceDates}>({formation.dateDebut} - {formation.dateFin})</p>
            </div>
            <p className={styles.experienceEntreprise}>{formation.universite}</p>
            <div className={styles.descriptionContainer}>
              <button 
                className={styles.deleteBtn} 
                onClick={() => handleDeleteFormation(formation.id)}
                title="Supprimer la formation"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z"/>
                  <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z"/>
                </svg>
              </button>
            </div>
          </div>
        ))}
      </div>
    ) : (
      <p className={styles.noData}>Aucune formation renseignée</p>
    )}
  </div>
)}

{/* Certifications Section */}
{user.certifications && (
  <div className={styles.profileSection}>
    <div className={styles.infoHeader}>
      <h2 className={styles.sectionTitle}>Certifications</h2>
      <button className={styles.addExperienceBtn} onClick={openAddCertificationModal}>
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
          <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z"/>
        </svg>
      </button>
    </div>
    {user.certifications.length > 0 ? (
      <div className={styles.experiencesGrid}>
        {user.certifications.map((certification) => (
          <div key={certification.id} className={styles.experienceCard}>
            <div className={styles.experienceHeader}>
              <h3 className={styles.experienceRole}>{certification.nom}</h3>
              <p className={styles.experienceDates}>Obtenu le: {certification.dateObtention}</p>
            </div>
            <p className={styles.experienceEntreprise}>{certification.organisme}</p>
            <div className={styles.descriptionContainer}>
              <button 
                className={styles.deleteBtn} 
                onClick={() => handleDeleteCertification(certification.id)}
                title="Supprimer la certification"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z"/>
                  <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z"/>
                </svg>
              </button>
            </div>
          </div>
        ))}
      </div>
    ) : (
      <p className={styles.noData}>Aucune certification renseignée</p>
    )}
  </div>
)}

      {/* Avis */}
      <div className={styles.profileSection}>
        <h2 className={styles.sectionTitle}>Avis</h2>
        <div className={styles.reviewsWrapper}>
          <div className={styles.reviewsColumn}>
            <h3 className={styles.subSectionTitle}>Avis reçus</h3>
            {user.avisRecus?.length > 0 ? (
              user.avisRecus.map((review) => (
                <div key={review.id} className={styles.reviewCard}>
                  <p className={styles.reviewText}>{review.comment}</p>
                  <div className={styles.reviewRating}>
                    Évaluation : {review.rating}/5
                  </div>
                </div>
              ))
            ) : (
              <p className={styles.noReviews}>Aucun avis reçu</p>
            )}
          </div>
          <div className={styles.reviewsColumn}>
            <h3 className={styles.subSectionTitle}>Avis donnés</h3>
            {user.avisDonnes?.length > 0 ? (
              user.avisDonnes.map((review) => (
                <div key={review.id} className={styles.reviewCard}>
                  <p className={styles.reviewText}>{review.comment}</p>
                  <div className={styles.reviewRating}>
                    Évaluation : {review.rating}/5
                  </div>
                </div>
              ))
            ) : (
              <p className={styles.noReviews}>Aucun avis donné</p>
            )}
          </div>
        </div>
      </div>

      {showCvModal && (
        <div className={styles.modalOverlay} onClick={() => { setShowCvModal(false); setPdfPreviewUrl(""); }}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <h2 className={styles.pdfPreviewTitle} >Aperçu de mon CV</h2>
            {pdfPreviewUrl ? (
              <>
                <iframe src={pdfPreviewUrl} title="CV Preview" className={styles.pdfPreview} />
                <div className={styles.modalActions}>
                  <button onClick={handleDownloadCV} className={styles.downloadButton}>
                    Télécharger le CV
                  </button>
                </div>
              </>
            ) : (
              <div>Chargement du CV...</div>
            )}
            <button className={styles.modalCloseBtn} onClick={() => { setShowCvModal(false); setPdfPreviewUrl(""); }}>
              X
            </button>
          </div>
        </div>
      )}
{selectedExperience && (
        <div className={styles.modalOverlay} onClick={closeExperienceModal}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <button className={styles.modalCloseBtn} onClick={closeExperienceModal}>
              &times;
            </button>
            <h2>{selectedExperience.role}</h2>
            <p>
              <strong>Entreprise:</strong> {selectedExperience.entreprise}
            </p>
            <p>
              <strong>De</strong> {selectedExperience.dateDebut} <strong>à</strong> {selectedExperience.dateFin}
            </p>
            <p>
              <strong>Description:</strong> {selectedExperience.description}
            </p>
          </div>
        </div>
      )}
      {/* Modal for adding a new experience */}
      {showAddExperienceModal && (
        <div className={styles.modalOverlay} onClick={closeAddExperienceModal}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <button
              className={styles.modalCloseBtn}
              onClick={closeAddExperienceModal}
            >
              &times;
            </button>
            <h2>Ajouter une nouvelle expérience</h2>
            <form onSubmit={handleAddExperienceSubmit}>
              <div className={styles.formGroup}>
                <label>Rôle</label>
                <input
                  type="text"
                  value={newExpRole}
                  onChange={(e) => setNewExpRole(e.target.value)}
                  required
                />
              </div>
              <div className={styles.formGroup}>
                <label>Entreprise</label>
                <input
                  type="text"
                  value={newExpEntreprise}
                  onChange={(e) => setNewExpEntreprise(e.target.value)}
                  required
                />
              </div>
              <div className={styles.formGroup}>
                <label>Date de début</label>
                <input
                  type="date"
                  value={newExpDateDebut}
                  onChange={(e) => setNewExpDateDebut(e.target.value)}
                  required
                />
              </div>
              <div className={styles.formGroup}>
                <label>Date de fin</label>
                <input
                  type="date"
                  value={newExpDateFin}
                  onChange={(e) => setNewExpDateFin(e.target.value)}
                />
              </div>
              <div className={styles.formGroup}>
                <label>Description</label>
                <textarea
                  value={newExpDescription}
                  onChange={(e) => setNewExpDescription(e.target.value)}
                  required
                ></textarea>
              </div>
              <button type="submit" className={styles.modalSubmitBtn}>
                Enregistrer
              </button>
            </form>
          </div>
        </div>
      )}
      {/* Modal for adding a new competence */}
      {showAddCompetenceModal && (
        <div className={styles.modalOverlay} onClick={closeAddCompetenceModal}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <button className={styles.modalCloseBtn} onClick={closeAddCompetenceModal}>X</button>
            <h2>Ajouter une compétence</h2>
            <form onSubmit={handleAddCompetenceSubmit}>
              <div className={styles.formGroup}>
                <label>Choisir une compétence</label>
                <select
                  value={selectedCompetence}
                  onChange={(e) => setSelectedCompetence(e.target.value)}
                  required
                  className="form-select"
                >
                  <option value="">--Choisir une compétence--</option>
                  {distinctCompetenceOptions.map(c => (
                    <option key={c.nom} value={c.nom}>{c.nom}</option>
                  ))}
                  <option value="other">Autre</option>
                </select>
                {selectedCompetence === "other" && (
                  <input
                    type="text"
                    value={customCompetence}
                    onChange={(e) => setCustomCompetence(e.target.value)}
                    placeholder="Entrer une compétence personnalisée"
                    required
                    className="form-control mt-2"
                  />
                )}
              </div>
              <div className={styles.formGroup}>
                <label>Niveau</label>
                <select
                  value={newCompetenceLevel}
                  onChange={(e) => setNewCompetenceLevel(e.target.value)}
                  required
                  className="form-select"
                >
                  <option value="">--Choisir un niveau--</option>
                  <option value="Débutant">Débutant</option>
                  <option value="Intermédiaire">Intermédiaire</option>
                  <option value="Expert">Expert</option>
                </select>
              </div>
              <button type="submit" className={styles.modalSubmitBtn}>Enregistrer</button>
            </form>
          </div>
        </div>
      )}

      {/* Modal for adding a domaine */}
      {showAddDomaineModal && (
        <div className={styles.modalOverlay} onClick={closeAddDomaineModal}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <button className={styles.modalCloseBtn} onClick={closeAddDomaineModal}>X</button>
            <h2>Ajouter un domaine</h2>
            <form onSubmit={handleAddDomaineSubmit}>
              <div className={styles.formGroup}>
                <label>Choisir un domaine</label>
                <select
                  value={selectedDomaine}
                  onChange={(e) => setSelectedDomaine(e.target.value)}
                  required
                  className="form-select"
                >
                  <option value="">--Choisir un domaine--</option>
                  {allDomaines.map(d => (
                    <option key={d.id} value={d.nom}>{d.nom}</option>
                  ))}
                  <option value="other">Autre</option>
                </select>
                {selectedDomaine === "other" && (
                  <input
                    type="text"
                    value={customDomaine}
                    onChange={(e) => setCustomDomaine(e.target.value)}
                    placeholder="Entrer un domaine personnalisé"
                    required
                    className="form-control mt-2"
                  />
                )}
              </div>
              <button type="submit" className={styles.modalSubmitBtn}>Enregistrer</button>
            </form>
          </div>
        </div>
      )}
      {/* Update the langue modal select to use distinct options */}
{showAddLangueModal && (
  <div className={styles.modalOverlay} onClick={closeAddLangueModal}>
    <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
      <button className={styles.modalCloseBtn} onClick={closeAddLangueModal}>X</button>
      <h2>Ajouter une langue</h2>
      <form onSubmit={handleAddLangueSubmit}>
        <div className={styles.formGroup}>
          <label>Choisir une langue</label>
          <select
            value={selectedLangue}
            onChange={(e) => setSelectedLangue(e.target.value)}
            required
            className="form-select"
          >
            <option value="">--Choisir une langue--</option>
            {distinctLangueOptions.map(l => (
              <option key={l.nom} value={l.nom}>{l.nom}</option>
            ))}
            <option value="other">Autre</option>
          </select>
          {selectedLangue === "other" && (
            <input
              type="text"
              value={customLangue}
              onChange={(e) => setCustomLangue(e.target.value)}
              placeholder="Entrer une langue personnalisée"
              required
              className="form-control mt-2"
            />
          )}
        </div>
        <div className={styles.formGroup}>
          <label>Niveau</label>
          <select
            value={newLangueLevel}
            onChange={(e) => setNewLangueLevel(e.target.value)}
            required
            className="form-select"
          >
            <option value="">--Choisir un niveau--</option>
            <option value="Débutant">Débutant</option>
            <option value="Courant">Courant</option>
            <option value="Bilingue">Bilingue</option>
          </select>
        </div>
        <button type="submit" className={styles.modalSubmitBtn}>Enregistrer</button>
      </form>
    </div>
  </div>
)}
{/* Formation Modal */}
{showAddFormationModal && (
  <div className={styles.modalOverlay} onClick={closeAddFormationModal}>
    <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
      <button className={styles.modalCloseBtn} onClick={closeAddFormationModal}>X</button>
      <h2>Ajouter une formation</h2>
      <form onSubmit={handleAddFormationSubmit}>
        <div className={styles.formGroup}>
          <label>Diplôme</label>
          <input
            type="text"
            value={newFormationDiplome}
            onChange={(e) => setNewFormationDiplome(e.target.value)}
            required
          />
        </div>
        <div className={styles.formGroup}>
          <label>Établissement</label>
          <input
            type="text"
            value={newFormationUniversite}
            onChange={(e) => setNewFormationUniversite(e.target.value)}
            required
          />
        </div>
        <div className={styles.formGroup}>
          <label>Date de début</label>
          <input
            type="date"
            value={newFormationDateDebut}
            onChange={(e) => setNewFormationDateDebut(e.target.value)}
            required
          />
        </div>
        <div className={styles.formGroup}>
          <label>Date de fin</label>
          <input
            type="date"
            value={newFormationDateFin}
            onChange={(e) => setNewFormationDateFin(e.target.value)}
          />
        </div>
        <button type="submit" className={styles.modalSubmitBtn}>Enregistrer</button>
      </form>
    </div>
  </div>
)}

{/* Certification Modal */}
{showAddCertificationModal && (
  <div className={styles.modalOverlay} onClick={closeAddCertificationModal}>
    <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
      <button className={styles.modalCloseBtn} onClick={closeAddCertificationModal}>X</button>
      <h2>Ajouter une certification</h2>
      <form onSubmit={handleAddCertificationSubmit}>
        <div className={styles.formGroup}>
          <label>Nom de la certification</label>
          <input
            type="text"
            value={newCertificationNom}
            onChange={(e) => setNewCertificationNom(e.target.value)}
            required
          />
        </div>
        <div className={styles.formGroup}>
          <label>Organisme émetteur</label>
          <input
            type="text"
            value={newCertificationOrganisme}
            onChange={(e) => setNewCertificationOrganisme(e.target.value)}
            required
          />
        </div>
        <div className={styles.formGroup}>
          <label>Date d'obtention</label>
          <input
            type="date"
            value={newCertificationDateObtention}
            onChange={(e) => setNewCertificationDateObtention(e.target.value)}
            required
          />
        </div>
        <button type="submit" className={styles.modalSubmitBtn}>Enregistrer</button>
      </form>
    </div>
  </div>
)}
      {/* Modal for Updating Field */}
      {showUpdateModal && (
        <div className={styles.modalOverlay} onClick={closeUpdateModal}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <button className={styles.modalCloseBtn} onClick={closeUpdateModal}>X</button>
            {updateField === 'nom complet' ? (
              <>
                <h2 className="mb-3">Mettre à jour Nom complet</h2>
                <div className="mb-3">
                  <label className="form-label">Prénom</label>
                  <input
                    type="text"
                    value={updatePrenom}
                    onChange={(e) => setUpdatePrenom(e.target.value)}
                    className="form-control"
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Nom</label>
                  <input
                    type="text"
                    value={updateNom}
                    onChange={(e) => setUpdateNom(e.target.value)}
                    className="form-control"
                  />
                </div>
              </>
            ) : updateField === "type d'abonnement" ? (
              <>
                <h2 className="mb-3">Mettre à jour {updateField}</h2>
                <div className="mb-3">
                  <label className="form-label">{updateField}</label>
                  <p className="form-control-plaintext">{updateValue}</p>
                </div>
              </>
            ) : (
              <>
                <h2 className="mb-3">Mettre à jour {updateField}</h2>
                <div className="mb-3">
                  <label className="form-label">{updateField}</label>
                  <input
                    type="text"
                    value={updateValue}
                    onChange={(e) => setUpdateValue(e.target.value)}
                    className="form-control"
                  />
                </div>
              </>
            )}
            {updateField !== "type d'abonnement" && (
              <button
                className={`${styles.modalSubmitBtn} btn btn-primary mt-3`}
                onClick={handleUpdateSubmit}
              >
                Enregistrer
              </button>
            )}
          </div>
        </div>
      )}
      <ToastContainer />
    </div>
    </div>
  );
};

export default ProfilePage;
