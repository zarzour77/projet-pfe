import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
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
      <h1 className={styles.fadeIn}>Félicitations !</h1>
      <p className={`${styles.fadeIn} ${styles.delay}`}>
        Votre compte a été créé avec succès.
      </p>
      <p className={`${styles.fadeIn} ${styles.delay}`}>
        Vous allez être redirigé vers la page de création de profil...
      </p>
    </div>
  );
};

export default SignupSuccess;