import { useNavigate } from "react-router-dom";
import styles from "./CreateProfile.module.css"; // Using CSS modules

const CreateProfile = () => {
  const storedUser = JSON.parse(localStorage.getItem("user"));
  console.log(storedUser)
  const navigate = useNavigate(); // React Router navigation

  return (
    <div className={styles.container}>
      {/* Profile Section */}
      <div className={styles.profileContainer}>
        <div className={styles.texts}>
          <h1>Bienvenue, {storedUser?.prenom} {storedUser?.nom}!</h1>
          <h1>Prêt à conquérir votre prochaine grande opportunité ?</h1>
        </div>

        {/* Additional Information */}
        <div className={styles.additionalTexts}>
          <p><i className="bi bi-person"></i> Répondez à quelques questions pour finaliser votre profil</p>
          <p><i className="bi bi-envelope-open"></i> Postulez à des rôles ouverts ou proposez des services </p>
          <p><i className="bi bi-cash-coin"></i> Recevez des paiements en toute sécurité</p>
        </div>

        {/* Button with Navigation */}
        <div className={styles.buttonContainer}>
          <button className={styles.showExp} onClick={() => navigate("/experience")}>
            Commencer
          </button>
          <p className={styles.timeInfo}>Cela ne prend que 5 à 10 minutes et vous pouvez changer votre choix après.</p>
        </div>
      </div>
    </div>
  );
};

export default CreateProfile;
