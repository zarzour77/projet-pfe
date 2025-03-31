/* eslint-disable react/no-unescaped-entities */
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import EntrepriseService from '../Services/EntrepriseService'; // Adjust the import as needed
import styles from './EntrepriseProfilePage.module.css';

const EntrepriseProfilePage = () => {
  const storedUser = JSON.parse(localStorage.getItem("user"));
  const entrepriseId = storedUser?.id;
  const navigate = useNavigate();

  const [entreprise, setEntreprise] = useState(null);
  const [missions, setMissions] = useState([]);
  const [loading, setLoading] = useState(true);
  // Use one modal for updating all basic info
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [updatedEntrepriseData, setUpdatedEntrepriseData] = useState({
    nomEntreprise: '',
    email: '',
    telephone: '',
    adresse: '',
  });
  const [selectedMission, setSelectedMission] = useState(null);
  const fileInputRef = useRef(null);

  // Fetch entreprise data
  useEffect(() => {
    const fetchEntrepriseData = async () => {
      try {
        setLoading(true);
        const data = await EntrepriseService.getEntrepriseById(entrepriseId);
        setEntreprise(data);
        setUpdatedEntrepriseData({
          nomEntreprise: data.nomEntreprise || '',
          email: data.email || '',
          telephone: data.telephone || '',
          adresse: data.adresse || '',
        });
      } catch (error) {
        console.error("Erreur lors du chargement du profil", error);
        toast.error("Erreur lors du chargement du profil");
      } finally {
        setLoading(false);
      }
    };

    if (entrepriseId) {
      fetchEntrepriseData();
    }
  }, [entrepriseId]);

  // Fetch missions
  useEffect(() => {
    const fetchMissions = async () => {
      try {
        const missionsData = await EntrepriseService.getMissions(entrepriseId);
        setMissions(missionsData);
      } catch (error) {
        console.error("Erreur lors du chargement des missions", error);
        toast.error("Erreur lors du chargement des missions");
      }
    };

    if (entrepriseId) {
      fetchMissions();
    }
  }, [entrepriseId]);

  const handleProfilePicClick = () => fileInputRef.current.click();

  const handleProfilePicChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      await EntrepriseService.uploadProfilePicture(entreprise.id, file);
      const updatedEntreprise = await EntrepriseService.getEntrepriseById(entreprise.id);
      setEntreprise(updatedEntreprise);
      localStorage.setItem("user", JSON.stringify(updatedEntreprise));
      toast.success("Image de profil mise à jour avec succès!");
    } catch (error) {
      console.error("Erreur lors du téléchargement de l'image de profil", error);
      toast.error("Erreur lors du téléchargement de l'image de profil");
    }
  };

  const handleDeleteMission = async (missionId) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer cette mission ?")) {
      try {
        await EntrepriseService.deleteMission(entreprise.id, missionId);
        const updatedMissions = missions.filter(m => m.id !== missionId);
        setMissions(updatedMissions);
        toast.success("Mission supprimée avec succès!");
      } catch (error) {
        console.error("Erreur lors de la suppression de la mission", error);
        toast.error("Erreur lors de la suppression de la mission");
      }
    }
  };

  // Open the update modal for all basic info (instead of one field at a time)
  const openUpdateModal = () => {
    setUpdatedEntrepriseData({
      nomEntreprise: entreprise.nomEntreprise || '',
      email: entreprise.email || '',
      telephone: entreprise.telephone || '',
      adresse: entreprise.adresse || '',
    });
    setShowUpdateModal(true);
  };

  const closeUpdateModal = () => {
    setShowUpdateModal(false);
  };

  const handleUpdateSubmit = async () => {
    try {
      const updatedData = { ...updatedEntrepriseData };
      const updatedEntreprise = await EntrepriseService.updateEntreprise(entreprise.id, updatedData);
      setEntreprise(updatedEntreprise);
      localStorage.setItem("user", JSON.stringify(updatedEntreprise));
      toast.success("Profil mis à jour avec succès!");
      closeUpdateModal();
    } catch (error) {
      console.error("Erreur lors de la mise à jour", error);
      toast.error("Erreur lors de la mise à jour du profil");
    }
  };

  const handlePreviewMission = (mission) => {
    setSelectedMission(mission);
  };

  if (loading) return <div className={styles.loading}>Chargement du profil...</div>;
  if (!entreprise) return <div className={styles.error}>Erreur lors du chargement du profil</div>;

  return (
    <div className={styles.pageWrapper}>
      <div className={styles.profileContainer}>
        <ToastContainer position="top-right" />

        <div className={styles.profileHeader}>
          <div className={styles.profilePhotoContainer}>
            <img
              src={entreprise.photoprofile || '/default-avatar.png'}
              alt="Profil"
              className={styles.profilePhoto}
            />
            <button className={styles.profilePhotoEditBtn} onClick={handleProfilePicClick}>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-pencil-square" viewBox="0 1 16 16">
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
          <h1 className={styles.profileName}>{entreprise.nomEntreprise}</h1>
          <span className={`${styles.roleBadge} ${entreprise.role === 'ENTREPRISE' ? styles.entrepriseBadge : styles.consultantBadge}`}>
            {entreprise.role} {entreprise.typeEntreprise}
          </span>
        </div>

        {/* Informations de base Section with single edit button */}
        <div className={styles.profileSection}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Informations de base</h2>
            <button 
              className={styles.editSectionButton}
              onClick={openUpdateModal}
              title="Modifier les informations de base"
            >
              <svg className={styles.editIcon} viewBox="0 0 24 24">
                                              <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
                                            </svg>
            </button>
          </div>
          <div className={styles.infoGridP}>
              <div className={styles.infoItem}>
                <label className={styles.infoLabel}>Nom de l'entreprise</label>
                <p className={styles.infoValue}>{entreprise.nomEntreprise}</p>
              </div>
              <div className={styles.infoItem}>
                <label className={styles.infoLabel}>E-mail</label>
                <p className={styles.infoValue}>{entreprise.email}</p>
              </div>
              <div className={styles.infoItem}>
                <label className={styles.infoLabel}>Téléphone</label>
                <p className={styles.infoValue}>{entreprise.telephone || "Non fourni"}</p>
              </div>
          </div>
          <div className={styles.infoItem}>
            <label className={styles.infoLabel}>Localisation</label>
            <p className={styles.infoValue}>{entreprise.adresse ? entreprise.adresse : "Non renseignée"}</p>
          </div>
        </div>

        {/* Missions Section */}
        <div className={styles.profileSection}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Missions</h2>
            <button 
              className={styles.addMissionBtn} 
              onClick={() => navigate("/PublierMission")}
              title="Ajouter une mission"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z"/>
              </svg>
            </button>
          </div>
          <div className={styles.missionsList}>
            {missions.length > 0 ? (
              missions.map(mission => (
                <div key={mission.id} className={styles.missionItem}>
                  <div className={styles.missionHeader}>
                    <h3 className={styles.missionTitle}>{mission.titre}</h3>
                    <div className={styles.missionActions}>
                      <button 
                        className={styles.previewBtn} 
                        onClick={() => handlePreviewMission(mission)}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                          <path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8M1.173 8a13 13 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5s3.879 1.168 5.168 2.457A13 13 0 0 1 14.828 8q-.086.13-.195.288c-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5s-3.879-1.168-5.168-2.457A13 13 0 0 1 1.172 8z"/>
                          <path d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5M4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0"/>
                        </svg>
                      </button>
                      <button 
                        className={styles.deleteBtn} 
                        onClick={() => handleDeleteMission(mission.id)}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                          <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z"/>
                          <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z"/>
                        </svg>
                      </button>
                    </div>
                  </div>
                  <p className={styles.missionDescription}>
                    {mission.description || "Aucune description fournie"}
                  </p>
                </div>
              ))
            ) : (
              <p className={styles.noData}>Aucune mission enregistrée</p>
            )}
          </div>
        </div>
      </div>

      {/* Mission Preview Modal */}
      {selectedMission && (
        <div className={styles.modalOverlay} onClick={() => setSelectedMission(null)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <button className={styles.modalCloseBtn} onClick={() => setSelectedMission(null)}>
              &times;
            </button>
            <h2>{selectedMission.titre}</h2>
            <div className={styles.modalSection}>
              <h3 className={styles.modalSubtitle}>Description</h3>
              <p className={styles.modalText}>{selectedMission.description}</p>
            </div>
            <div className={styles.modalSection}>
              <h3 className={styles.modalSubtitle}>Détails</h3>
              <p className={styles.modalText}>
                <strong>Statut:</strong> {selectedMission.statut || 'Non spécifiée'}
              </p>
              <p className={styles.modalText}>
                <strong>Date de début:</strong> {selectedMission.startdate || 'Non spécifiée'}
              </p>
              <p className={styles.modalText}>
                <strong>Date de fin:</strong> {selectedMission.enddate || 'Non spécifiée'}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Update Modal for Basic Information */}
      {showUpdateModal && (
        <div className={styles.modalOverlay} onClick={closeUpdateModal}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <button className={styles.modalCloseBtn} onClick={closeUpdateModal}>
              &times;
            </button>
            <h2 className={styles.modalTitle}>Mettre à jour les informations de base</h2>
            <div className={styles.modalFormGroup}>
              <label className={styles.formLabel}>Nom de l'entreprise</label>
              <input 
                type="text"
                value={updatedEntrepriseData.nomEntreprise}
                onChange={(e) => setUpdatedEntrepriseData({
                  ...updatedEntrepriseData,
                  nomEntreprise: e.target.value,
                })}
                className={styles.formControl}
              />
            </div>
            <div className={styles.modalFormGroup}>
              <label className={styles.formLabel}>E-mail</label>
              <input 
                type="email"
                value={updatedEntrepriseData.email}
                onChange={(e) => setUpdatedEntrepriseData({
                  ...updatedEntrepriseData,
                  email: e.target.value,
                })}
                className={styles.formControl}
              />
            </div>
            <div className={styles.modalFormGroup}>
              <label className={styles.formLabel}>Téléphone</label>
              <input 
                type="text"
                value={updatedEntrepriseData.telephone}
                onChange={(e) => setUpdatedEntrepriseData({
                  ...updatedEntrepriseData,
                  telephone: e.target.value,
                })}
                className={styles.formControl}
              />
            </div>
            <div className={styles.modalFormGroup}>
              <label className={styles.formLabel}>Localisation</label>
              <input 
                type="text"
                value={updatedEntrepriseData.adresse}
                onChange={(e) => setUpdatedEntrepriseData({
                  ...updatedEntrepriseData,
                  adresse: e.target.value,
                })}
                className={styles.formControl}
              />
            </div>
            <div className={styles.modalActions}>
            <button className={styles.modalSubmitBtn} onClick={handleUpdateSubmit}>
              Enregistrer
            </button>
            </div>
          </div>
        </div>
      )}

      <ToastContainer />
    </div>
  );
};

export default EntrepriseProfilePage;