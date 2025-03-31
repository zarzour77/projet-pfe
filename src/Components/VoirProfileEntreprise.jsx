/* eslint-disable react/no-unescaped-entities */
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import EntrepriseService from '../Services/EntrepriseService';
import styles from './ProfilePage.module.css';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const VoirProfileEntreprise = () => {
  const { entrepriseId } = useParams();
  const [entreprise, setEntreprise] = useState(null);
  const [missions, setMissions] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch enterprise profile data using the enterpriseId from the route
  useEffect(() => {
    const fetchEntrepriseData = async () => {
      try {
        setLoading(true);
        const data = await EntrepriseService.getEntrepriseById(entrepriseId);
        setEntreprise(data);
      } catch (error) {
        console.error("Erreur lors du chargement du profil", error);
      } finally {
        setLoading(false);
      }
    };

    if (entrepriseId) {
      fetchEntrepriseData();
    }
  }, [entrepriseId]);

  // Fetch missions of the enterprise
  useEffect(() => {
    const fetchMissions = async () => {
      try {
        const missionsData = await EntrepriseService.getMissions(entrepriseId);
        setMissions(missionsData);
      } catch (error) {
        console.error("Erreur lors du chargement des missions", error);
      }
    };

    if (entrepriseId) {
      fetchMissions();
    }
  }, [entrepriseId]);

  if (loading) return <div className={styles.loading}>Chargement...</div>;
  if (!entreprise) return <div className={styles.error}>Erreur lors du chargement du profil</div>;

  return (
    <div className={styles.profileContainer}>
      <ToastContainer position="top-right" />
      
      <div className={styles.profileHeader}>
        <div className={styles.profilePhotoContainer}>
          <img
            src={entreprise.photoprofile || '/default-avatar.png'}
            alt="Profil"
            className={styles.profilePhoto}
          />
        </div>
        <h1 className={styles.profileName}>{entreprise.nomEntreprise}</h1>
        <span className={`${styles.roleBadge} ${entreprise.role === 'ENTREPRISE' ? styles.entrepriseBadge : styles.consultantBadge}`}>
          {entreprise.role} {entreprise.typeEntreprise}
        </span>
      </div>

      {/* Basic Information Section */}
      <div className={styles.profileSection}>
        <h2 className={styles.sectionTitle}>Informations de base</h2>
        <div className={styles.infoGrid}>
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
          <div className={styles.infoItem}>
            <label className={styles.infoLabel}>Localisation</label>
            <p className={styles.infoValue}>{entreprise.adresse || "Non renseignée"}</p>
          </div>
        </div>
      </div>

      {/* Missions Section */}
      <div className={styles.profileSection}>
        <h2 className={styles.sectionTitle}>Missions</h2>
        <div className={styles.missionsList}>
          {missions.length > 0 ? (
            missions.map(mission => (
              <div key={mission.id} className={styles.missionItem}>
                <div className={styles.missionHeader}>
                  <h3 className={styles.missionTitle}>{mission.titre}</h3>
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
  );
};

export default VoirProfileEntreprise;
