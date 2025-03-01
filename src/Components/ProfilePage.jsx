/* eslint-disable react/no-unescaped-entities */
import { useEffect, useRef, useState } from 'react';
import ConsultantService from '../Services/ConsultantService';
import styles from './ProfilePage.module.css';
// Remove or comment out the Angular ToastrModule import if not used
// import { ToastrModule } from 'ngx-toastr';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // State for viewing an experience
  const [selectedExperience, setSelectedExperience] = useState(null);
  // State for update field modal (for text updates)
  const [updateField, setUpdateField] = useState(null);
  const [updateValue, setUpdateValue] = useState('');
  const [updatePrenom, setUpdatePrenom] = useState('');
  const [updateNom, setUpdateNom] = useState('');
  const [showUpdateModal, setShowUpdateModal] = useState(false);

  // State for adding a new experience modal and its form fields
  const [showAddExperienceModal, setShowAddExperienceModal] = useState(false);
  const [newExpRole, setNewExpRole] = useState('');
  const [newExpEntreprise, setNewExpEntreprise] = useState('');
  const [newExpDateDebut, setNewExpDateDebut] = useState('');
  const [newExpDateFin, setNewExpDateFin] = useState('');
  const [newExpDescription, setNewExpDescription] = useState('');

  // Ref for the hidden file input
  const fileInputRef = useRef(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const storedUser = JSON.parse(localStorage.getItem("userWithToken"));
        if (!storedUser?.id) throw new Error("Utilisateur non trouvé");
        const consultantData = await ConsultantService.getConsultantById(storedUser.id);
        setUser(consultantData);
      } catch (error) {
        console.error("Erreur lors de la récupération:", error);
        toast.error("Erreur lors du chargement du profil");
      } finally {
        setLoading(false);
      }
    };
    fetchUserData();
  }, []);

  const handleExperienceClick = (exp) => {
    setSelectedExperience(exp);
  };

  const closeExperienceModal = () => {
    setSelectedExperience(null);
  };

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
      localStorage.setItem("Consultant", JSON.stringify(updatedUser));
      toast.success("Profil mis à jour avec succès!");
      closeUpdateModal();
    } catch (error) {
      console.error("Erreur lors de la mise à jour:", error);
      toast.error("Erreur lors de la mise à jour du profil");
    }
  };

  const handleProfilePicClick = () => {
    // Trigger the file input dialog
    fileInputRef.current.click();
  };

  const handleProfilePicChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      await ConsultantService.uploadProfilePicture(user.id, file);
  
      // Fetch the updated user data after uploading the profile picture
      const updatedUser = await ConsultantService.getConsultantById(user.id);
      setUser(updatedUser);
      localStorage.setItem("Consultant", JSON.stringify(updatedUser));
      toast.success("Image de profil mise à jour avec succès!");
    } catch (error) {
      console.error("Erreur lors du téléchargement de l'image de profil:", error);
      toast.error("Erreur lors du téléchargement de l'image de profil");
    }
  };

  // Functions for handling adding a new experience
  const openAddExperienceModal = () => {
    setShowAddExperienceModal(true);
  };

  const closeAddExperienceModal = () => {
    setShowAddExperienceModal(false);
    // Clear form fields
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
      // Assume ConsultantService.addExperience adds the new experience and returns updated user data
      const updatedUser = await ConsultantService.addExperience(user.id, newExperience);
      setUser(updatedUser);
      localStorage.setItem("Consultant", JSON.stringify(updatedUser));
      toast.success("Expérience ajoutée avec succès!");
      closeAddExperienceModal();
    } catch (error) {
      console.error("Erreur lors de l'ajout de l'expérience:", error);
      toast.error("Erreur lors de l'ajout de l'expérience");
    }
  };

  // New function to handle deletion of an experience.
  // After deletion, we explicitly fetch the updated consultant data.
  const handleDeleteExperience = async (expId) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer cette expérience ?")) {
      try {
        // Delete the experience using ConsultantService
        await ConsultantService.deleteExperience(user.id, expId);
        // Then, fetch the updated consultant data
        const updatedUser = await ConsultantService.getConsultantById(user.id);
        setUser(updatedUser);
        localStorage.setItem("Consultant", JSON.stringify(updatedUser));
        toast.success("Expérience supprimée avec succès!");
      } catch (error) {
        console.error("Erreur lors de la suppression de l'expérience:", error);
        toast.error("Erreur lors de la suppression de l'expérience");
      }
    }
  };

  if (loading) return <div className={styles.loading}>Chargement...</div>;
  if (!user) return <div className={styles.error}>Erreur lors du chargement du profil</div>;

  return (
    <div className={styles.profileContainer}>
      {/* Toast container to show notifications */}
      <ToastContainer position="top-right" />
      
      <div className={styles.profileHeader}>
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
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-pencil-square" viewBox="0 0 16 16">
              <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"/>
              <path fillRule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z"/>
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
  <div className={styles.infoGrid}>
    {/* Nom complet */}
    <div className={styles.infoItem}>
      <div className={styles.infoHeader}>
        <label className={styles.infoLabel}>Nom complet</label>
        <button
          className={styles.editBtn}
          onClick={() =>
            openUpdateModal("nom complet", { prenom: user.prenom, nom: user.nom })
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
      <p className={styles.infoValue}>{user.telephone || "Non fourni"}</p>
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
            viewBox="0 0 16 16"
          >
            <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z" />
            <path
              fillRule="evenodd"
              d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z"
            />
          </svg>
        </button>
      </div>
      <p className={styles.infoValue}>{user.adresse || "Non fourni"}</p>
    </div>

    {/* Type d'abonnement (no edit button) */}
    <div className={styles.infoItem}>
      <label className={styles.infoLabel}>Type d'abonnement</label>
      <p className={styles.infoValue}>{user.subscriptionType || "Aucun"}</p>
    </div>

    {/* Évaluation (no edit button) */}
    <div className={styles.infoItem}>
      <label className={styles.infoLabel}>Évaluation</label>
      <p className={styles.infoValue}>
        {user.rating ? `${user.rating}/5` : "Pas d’évaluation"}
      </p>
    </div>
  </div>
</div>




      {/* Informations sur l'entreprise (if applicable) */}
      {user.role === 'entreprise' && (
        <div className={styles.profileSection}>
          <h2 className={styles.sectionTitle}>Informations sur l'entreprise</h2>
          <div className={styles.infoGrid}>
            <div className={styles.infoItem}>
              <label className={styles.infoLabel}>Nom de l'entreprise</label>
              <p className={styles.infoValue}>{user.nomEntreprise}</p>
            </div>
            <div className={styles.infoItem}>
              <label className={styles.infoLabel}>Localisation</label>
              <p className={styles.infoValue}>{user.latitude}, {user.longitude}</p>
            </div>
            <div className={styles.infoItem}>
              <label className={styles.infoLabel}>Missions actives</label>
              <p className={styles.infoValue}>{user.missions?.length || 0}</p>
            </div>
          </div>
        </div>
      )}

      {/* Informations professionnelles */}
{user.role === 'Consultant' && (
  <div className={styles.profileSection}>
    <h2 className={styles.sectionTitle}>Informations professionnelles</h2>
    <div className={styles.infoGrid}>
      {/* Compétences Section */}
      <div className={styles.infoItem}>
        <div className={styles.infoHeader}>
          <label className={styles.infoLabel}>Compétences</label>
          <button className={styles.addCompetenceBtn} onClick={openAddExperienceModal}>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-plus" viewBox="0 0 16 16">
              <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z"/>
            </svg>
          </button>
        </div>
        <div className={styles.competenceList}>
          {user.competences?.length > 0 ? (
            user.competences.map((c) => (
              <div key={c.id} className={styles.competenceItem}>
                <span className={styles.competenceName}>{c.nom}</span>
                <div className={styles.progressBarContainer}>
                  <div
                    className={styles.progressBar}
                    style={{ width: `${(c.competenceNiveaux / 5) * 100}%` }}
                  ></div>
                </div>
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
          <button className={styles.addDomaineBtn} onClick={openAddExperienceModal}>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-plus" viewBox="0 0 16 16">
              <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z"/>
            </svg>
          </button>
        </div>
        <div className={styles.tagsContainer}>
          {user.domaines?.length > 0 ? (
            user.domaines.map((d) => (
              <span key={d.id} className={styles.tag}>{d.nom}</span>
            ))
          ) : (
            <span className={styles.noData}>Aucun domaine spécifié</span>
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
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-plus" viewBox="0 0 16 16">
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
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-eye" viewBox="0 0 16 16">
                  <path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8M1.173 8a13 13 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5s3.879 1.168 5.168 2.457A13 13 0 0 1 14.828 8q-.086.13-.195.288c-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5s-3.879-1.168-5.168-2.457A13 13 0 0 1 1.172 8z"/>
                  <path d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5M4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0"/>
                </svg>
              </button>
              <button className={styles.deleteBtn} onClick={() => handleDeleteExperience(exp.id)}>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-trash" viewBox="0 0 16 16">
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






      {/* Modal for viewing an experience */}
      {selectedExperience && (
        <div className={styles.modalOverlay} onClick={closeExperienceModal}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <button
              className={styles.modalCloseBtn}
              onClick={closeExperienceModal}
            >
              &times;
            </button>
            <h2>{selectedExperience.role}</h2>
            <p>
              <strong>Entreprise:</strong> {selectedExperience.entreprise}
            </p>
            <p>
              <strong>De</strong> {selectedExperience.dateDebut} <strong>à</strong>  {selectedExperience.dateFin}
            </p>
            <p>
              <strong>Description:</strong> {selectedExperience.description}
            </p>
          </div>
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


    </div>
  );
};

export default ProfilePage;
