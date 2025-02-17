import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaUserTie, FaBuilding } from "react-icons/fa";
import styles from "./ProfileSelection.module.css";
import UserService from "../Services/UserService"; // Import UserService

const ProfileSelection = () => {
  const [selectedProfile, setSelectedProfile] = useState(null);
  const [isAnimating, setIsAnimating] = useState(false); // Animation effect
  const navigate = useNavigate();
  const storedUser = JSON.parse(localStorage.getItem("userWithToken"));
  const userId = storedUser?.id; // Assuming userId is saved in localStorage after login

  const handleSelect = (profile) => {
    setSelectedProfile(profile);
    setIsAnimating(true); // Trigger animation
    setTimeout(() => setIsAnimating(false), 1000); // Reset animation after 300ms
  };

  const handleContinue = async () => {
    if (!selectedProfile) {
      setIsAnimating(true); // Trigger animation on invalid selection
      setTimeout(() => setIsAnimating(false), 1000); // Reset animation

      return;
    }

    // Update the role using UserService
    try {
      const updatedUser = await UserService.updateRole(userId, selectedProfile); // Update role in backend
      localStorage.setItem("user", JSON.stringify(updatedUser));
      navigate("/UserInformation"); // Redirect to success page after role update
    } catch (error) {
      console.error("Error updating role:", error);
      // Optionally, display an error message to the user here
    }
  };

  return (
    <div className={styles.container}>
      <h2>Choisissez votre profil</h2>
      <div className={styles.options}>
        <div
          className={`${styles.option} ${selectedProfile === "Consultant" ? styles.selected : ""} ${isAnimating && !selectedProfile ? styles.animateOption : ""}`}
          onClick={() => handleSelect("Consultant")}
        >
          <FaUserTie className={styles.icon} />
          <h3>Consultant</h3>
          <p>Travaillez sur des missions adaptées à votre expertise.</p>
        </div>
        <div
          className={`${styles.option} ${selectedProfile === "Entreprise" ? styles.selected : ""} ${isAnimating && !selectedProfile ? styles.animateOption : ""}`}
          onClick={() => handleSelect("Entreprise")}
        >
          <FaBuilding className={styles.icon} />
          <h3>Entreprise</h3>
          <p>Recherchez et engagez des freelances qualifiés.</p>
        </div>
      </div>

      <div className={styles.buttonContainer}>
        <div className={styles.buttonDiv}>
          <button
            className={`${styles.nextButton} ${isAnimating && !selectedProfile ? styles.animateButton : ""}`}
            onClick={handleContinue}
          >
            Suivant
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileSelection;
