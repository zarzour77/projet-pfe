import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { CheckCircleOutline } from "@mui/icons-material";
import styles from "./SignupSuccess.module.css";

const SignupSuccess = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/CreateProfile");
    }, 4000);
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className={styles.signupSuccessContainer}>
      <div className={styles.contentWrapper}>
        <CheckCircleOutline className={styles.successIcon} />
        <h1 className={styles.fadeIn}>Félicitations !</h1>
        <p className={styles.message}>
          Votre compte a été créé avec succès.
        </p>
        <p className={styles.redirectMessage}>
          Vous allez être redirigé vers la page de création de profil...
        </p>
        <div className={styles.progressBar}>
          <div className={styles.progressFill} />
        </div>
        <button 
          className={styles.manualButton}
          onClick={() => navigate("/CreateProfile")}
        >
          Continuer maintenant
        </button>
      </div>
    </div>
  );
};

export default SignupSuccess;