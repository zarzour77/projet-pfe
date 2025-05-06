import { useNavigate } from "react-router-dom";
import { RocketLaunch, Description, Payment, ArrowForward } from "@mui/icons-material";
import styles from "./CreateProfile.module.css";
import ProfileSetup from '../assets/Profile-setup.gif';
const CreateProfile = () => {
  const storedConsultant = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();

  return (
    <div className={styles.container}>
      <div className={styles.profileContainer}>
        <div className={styles.header}>
          <h1 className={styles.welcomeTitle}>
            Bienvenue, <span className={styles.nameHighlight}>{storedConsultant?.prenom} {storedConsultant?.nom}</span>!
          </h1>
          <p className={styles.subtitle}>Prêt à conquérir votre prochaine grande opportunité ?</p>
        </div>

        <div className={styles.contentGrid}>
          <div className={styles.illustrationSection}>
          <img 
  src={ProfileSetup}
  alt="Configuration du profil" 
  className={styles.illustration}
/>

          </div>

          <div className={styles.stepsSection}>
            <div className={styles.stepCard}>
              <RocketLaunch className={styles.stepIcon} />
              <div className={styles.stepContent}>
                <h3>Configuration du Profil</h3>
                <p>Répondez à quelques questions pour finaliser votre profil</p>
              </div>
              <span className={styles.stepBadge}>Étape 1/3</span>
            </div>

            <div className={styles.benefitsList}>
              <div className={styles.benefitItem}>
                <Description className={styles.benefitIcon} />
                <span>Postulez à des rôles ouverts ou proposez des services</span>
              </div>
              <div className={styles.benefitItem}>
                <Payment className={styles.benefitIcon} />
                <span>Recevez des paiements en toute sécurité</span>
              </div>
            </div>

            <div className={styles.actionSection}>
              <button 
                className={styles.ctaButton}
                onClick={() => navigate("/ProfessionalDetails")}
              >
                Commencer la configuration
                <ArrowForward className={styles.buttonIcon} />
              </button>
              <p className={styles.timeInfo}>
                <span className={styles.timeEstimate}>5-10 minutes</span>
                Vous pourrez modifier vos choix ultérieurement
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateProfile;