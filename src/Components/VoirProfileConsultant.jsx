/* eslint-disable react/no-unescaped-entities */
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import VoirProfileConsultantService from '../services/VoirProfileConsultantService';
import styles from './ProfilePage.module.css';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ConsultantService from '../Services/ConsultantService';
import { Box, CircularProgress, Typography } from '@mui/material';

const VoirProfileConsultant = () => {
  const { consultantId } = useParams();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showCvModal, setShowCvModal] = useState(false);
  const [pdfPreviewUrl, setPdfPreviewUrl] = useState("");
  const [reviews, setReviews] = useState([]); // Add reviews state
  const [selectedReview, setSelectedReview] = useState(null);

  const handleReviewClick = (review) => {
    setSelectedReview(review);
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        const [consultantData, reviewsData] = await Promise.all([
          VoirProfileConsultantService.getConsultantById(consultantId),
          VoirProfileConsultantService.getConsultantReviews(consultantId)
        ]);
        setUser(consultantData);
        setReviews(reviewsData);        setUser(consultantData);
      } catch (error) {
        console.error("Erreur lors de la récupération:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchUserData();
  }, [consultantId]);

  const handleGenerateCV = async () => {
    try {
      const response = await ConsultantService.generateCv(consultantId);
      const blob = new Blob([response], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      setPdfPreviewUrl(url);
      setShowCvModal(true);
    } catch (error) {
      console.error("Erreur lors de la génération du CV:", error);
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

  return (
    <div className={styles.profileContainer}>
      <ToastContainer position="top-right" />
      
      <div className={styles.profileHeader}>
        <button className={styles.cvButton} onClick={handleGenerateCV}>
          <i className={`bi bi-file-earmark-text ${styles.cvIcon}`}></i>
          <span className={styles.cvText}>Aperçu du CV</span>
        </button>
        <div className={styles.profilePhotoContainer}>
          <img
            src={user.photoprofile || '/default-avatar.png'}
            alt="Profil"
            className={styles.profilePhoto}
          />
        </div>
        <h1 className={styles.profileName}>{user.prenom} {user.nom}</h1>
        <span className={`${styles.roleBadge} ${styles.consultantBadge}`}>
          Consultant
        </span>
      </div>

      <div className={styles.profileSection}>
        <h2 className={styles.sectionTitle}>Informations de base</h2>
        <div className={styles.basicInfoContainer}>
          <div className={styles.infoGrid}>
            <div className={styles.infoItem}>
              <label className={styles.infoLabel}>Nom complet</label>
              <p className={styles.infoValue}>{user.prenom} {user.nom}</p>
            </div>
            <div className={styles.infoItem}>
              <label className={styles.infoLabel}>E-mail</label>
              <p className={styles.infoValue}>{user.email}</p>
            </div>
            <div className={styles.infoItem}>
              <label className={styles.infoLabel}>Téléphone</label>
              <p className={styles.infoValue}>{user.telephone || "Non fourni"}</p>
            </div>
            <div className={styles.infoItem}>
              <label className={styles.infoLabel}>Adresse</label>
              <p className={styles.infoValue}>{user.adresse || "Non fourni"}</p>
            </div>
            <div className={styles.infoItem}>
              <label className={styles.infoLabel}>Évaluation</label>
              <p className={styles.infoValue}>
                {user.rating ? `${user.rating}/5` : "Pas d’évaluation"}
              </p>
            </div>
          </div>
          {/* Job Success Circular Progress */}
<div className={styles.jobSuccessContainer}>
  <Box 
    sx={{ 
      position: 'relative', 
      display: 'inline-flex',
      transition: 'transform 0.3s ease',
      '&:hover': {
        transform: 'scale(1.05)'
      }
    }}
    title={`Taux de réussite: ${user.jobSuccess || 0}%`}
  >
    <CircularProgress
      variant="determinate"
      value={100}
      size={100}
      thickness={6}
      sx={{ 
        color: '#f0f3f5',
        transition: 'opacity 0.3s ease' 
      }}
    />
    <CircularProgress
      variant="determinate"
      value={user.jobSuccess || 0}
      size={100}
      thickness={6}
      sx={{
        color: 'primary.main',
        position: 'absolute',
        left: 0,
        transition: 'stroke-dashoffset 0.5s ease-out 0.3s',
        '& .MuiCircularProgress-circle': {
          strokeLinecap: 'round'
        }
      }}
    />
    <Box
      sx={{
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
        position: 'absolute',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        animation: `${styles.bounce} 0.5s ease-out`
      }}
    >
      <Typography 
        variant="h6" 
        component="div" 
        sx={{ 
          fontWeight: '800',
          color: 'primary.main',
          textShadow: '0 2px 4px rgba(0, 121, 107, 0.2)'
        }}
      >
        {`${user.jobSuccess || 0}%`}
      </Typography>
    </Box>
  </Box>
  <Typography 
    variant="body2" 
    sx={{ 
      fontWeight: 600, 
      color: 'text.secondary', 
      mt: 2, 
      textAlign: 'center',
      animation: `${styles.fadeInUp} 0.5s ease-out`
    }}
  >
    Taux de réussite
  </Typography>
</div>
        </div>
      </div>

      <div className={styles.profileSection}>
        <h2 className={styles.sectionTitle}>Informations professionnelles</h2>
        <div className={styles.infoGrid}>
          <div className={styles.infoItem}>
            <label className={styles.infoLabel}>Compétences</label>
            <div className={styles.competenceList}>
              {user.competences?.length > 0 ? (
                user.competences.map((c) => (
                  <div key={c.id} className={styles.competenceItem}>
                    <span className={styles.competenceName}>
                      {c.nom} ({c.competenceNiveau})
                    </span>
                  </div>
                ))
              ) : (
                <span className={styles.noData}>Aucune compétence listée</span>
              )}
            </div>
          </div>

          <div className={styles.infoItem}>
            <label className={styles.infoLabel}>Domaines</label>
            <div className={styles.domainesList}>
              {user.domaines?.length > 0 ? (
                user.domaines.map((d) => (
                  <div key={d.id} className={styles.domaineItem}>
                    <span className={styles.domainName}>{d.nom}</span>
                  </div>
                ))
              ) : (
                <span className={styles.noData}>Aucun domaine spécifié</span>
              )}
            </div>
          </div>

          <div className={styles.infoItem}>
            <label className={styles.infoLabel}>Langues</label>
            <div className={styles.languesList}>
              {user.langues?.length > 0 ? (
                user.langues.map((langue) => (
                  <div key={langue.id} className={styles.langueItem}>
                    <span className={styles.langueName}>
                      {langue.nom} ({langue.niveau})
                    </span>
                  </div>
                ))
              ) : (
                <span className={styles.noData}>Aucune langue renseignée</span>
              )}
            </div>
          </div>
        </div>
      </div>

      {user.experiences && (
        <div className={styles.profileSection}>
          <h2 className={styles.sectionTitle}>Expériences professionnelles</h2>
          {user.experiences?.length > 0 ? (
          <div className={styles.experiencesGrid}>
            {user.experiences.map((exp) => (
              <div key={exp.id} className={styles.experienceCard}>
                <div className={styles.experienceHeader}>
                  <h3 className={styles.experienceRole}>{exp.role}</h3>
                  <p className={styles.experienceDates}>( {exp.dateDebut} - {exp.dateFin} )</p>
                </div>
                <p className={styles.experienceEntreprise}>{exp.entreprise}</p>
              </div>
            ))}
          </div>
          ) : (
            <span className={styles.noData}>Aucune expérience professionnelle à afficher</span>
          )}
        </div>
      )}

      {user.formations && (
        <div className={styles.profileSection}>
          <h2 className={styles.sectionTitle}>Formations</h2>
          {user.formations?.length > 0 ? (
          <div className={styles.experiencesGrid}>
            {user.formations.map((formation) => (
              <div key={formation.id} className={styles.experienceCard}>
                <div className={styles.experienceHeader}>
                  <h3 className={styles.experienceRole}>{formation.diplome}</h3>
                  <p className={styles.experienceDates}>({formation.dateDebut} - {formation.dateFin})</p>
                </div>
                <p className={styles.experienceEntreprise}>{formation.universite}</p>
              </div>
            ))}
          </div>
          ) : (
            <span className={styles.noData}>Aucune formation à afficher</span>
          )}
        </div>
      )}

      {user.certifications && (
        <div className={styles.profileSection}>
          <h2 className={styles.sectionTitle}>Certifications</h2>
          {user.certifications?.length > 0 ? (
          <div className={styles.experiencesGrid}>
            {user.certifications.map((certification) => (
              <div key={certification.id} className={styles.experienceCard}>
                <div className={styles.experienceHeader}>
                  <h3 className={styles.experienceRole}>{certification.nom}</h3>
                  <p className={styles.experienceDates}>Obtenu le: {certification.dateObtention}</p>
                </div>
                <p className={styles.experienceEntreprise}>{certification.organisme}</p>
              </div>
            ))}
          </div>
          ) : (
            <span className={styles.noData}>Aucune certification à afficher</span>
          )}
        </div>
      )}

<div className={styles.profileSection}>
        <h2 className={styles.sectionTitle}>Avis reçus</h2>
        <div className={styles.reviewsWrapper}>
          <div className={styles.reviewsColumn}>
            {reviews.length > 0 ? (
              reviews.map((review) => (
                <div 
                  key={review.id} 
                  className={styles.reviewCard}
                  onClick={() => handleReviewClick(review)}
                >
                  <p className={styles.reviewText}>
                    {review.commentaire.length > 100 
                      ? `${review.commentaire.substring(0, 100)}...` 
                      : review.commentaire}
                  </p>
                  <span className={styles.reviewDate}>
                    {new Date(review.dateAvis).toLocaleDateString('fr-FR')}
                  </span>
                </div>
              ))
            ) : (
              <p className={styles.noReviews}>Aucun avis reçu</p>
            )}
          </div>
        </div>
      </div>
{selectedReview && (
  <div className={styles.modalOverlay} onClick={() => setSelectedReview(null)}>
    <div className={styles.reviewModalContent} onClick={(e) => e.stopPropagation()}>
      <button 
        className={styles.modalCloseBtn} 
        onClick={() => setSelectedReview(null)}
      >
        &times; 
      </button>
      <h3 className={styles.reviewModalTitle}>Détails de l'avis</h3>
      <div className={styles.reviewModalMeta}>
        <div className={styles.reviewMetaItem}>
          <span className={styles.metaLabel}>Auteur:</span>
          <span className={styles.reviewAuthor}>{selectedReview.auteurNom}</span>
        </div>
        <div className={styles.reviewMetaItem}>
          <span className={styles.metaLabel}>Mission:</span>
          <span className={styles.reviewMission}>{selectedReview.missionTitre}</span>
        </div>
        <div className={styles.reviewMetaItem}>
          <span className={styles.metaLabel}>Note:</span>
          <span className={styles.reviewRating}>{selectedReview.note}/5</span>
        </div>
      </div>
      <div className={styles.reviewContent}>
        <span className={styles.metaLabel}>Commentaire:</span>
        <p className={styles.reviewFullText}>{selectedReview.commentaire}</p>
      </div>
      <span className={styles.reviewModalDate}>
        <span className={styles.metaLabel}>Posté le : </span> 
        {new Date(selectedReview.dateAvis).toLocaleDateString('fr-FR')}
      </span>
    </div>
  </div>
)}
      {/* Add CV Preview Modal */}
      {showCvModal && (
        <div className={styles.modalOverlay} onClick={() => { setShowCvModal(false); setPdfPreviewUrl(""); }}>
          <div className={`${styles.modalContent} ${styles.cvModalContentBig}`} onClick={(e) => e.stopPropagation()}>
            <h2 className={styles.pdfPreviewTitle}>Aperçu du CV</h2>
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
    </div>
  );
};

export default VoirProfileConsultant;
