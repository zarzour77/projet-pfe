import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CheckCircle } from "lucide-react";
import { motion } from "framer-motion";
import Confetti from "react-confetti"; // 🎉 Confetti effect
import styles from "./PaymentSuccess.module.css"; // Import CSS module
import UserService from "../Services/UserService";

const PaymentSuccess = () => {
  const [message, setMessage] = useState(""); // State for message
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    const selectedPlan = JSON.parse(localStorage.getItem("SubscriptionType")); // Retrieve the selected plan from localStorage

    if (storedUser?.id && selectedPlan) {
      // Call the service to update the subscription type for the user
      UserService.updateSubscriptionType(storedUser.id, selectedPlan)
        .then(async () => {
          setMessage("Abonnement mis à jour avec succès !");
          console.log("Abonnement mis à jour !");

          // After the subscription is updated, fetch the updated user info
          const updatedUser = await UserService.getById(storedUser.id); // Assuming you have a method to fetch the user by ID

          // Update localStorage with the new user data
          localStorage.setItem("user", JSON.stringify(updatedUser));
          console.log("Utilisateur mis à jour dans le localStorage.");
        })
        .catch((error) => {
          console.error("Erreur lors de la mise à jour de l'abonnement:", error);
          setMessage("Erreur lors de la mise à jour de l'abonnement.");
        });
    } else {
      setMessage("Erreur: Utilisateur ou abonnement non trouvé.");
    }

    // Optionally, you can redirect after a certain time (e.g., 5 seconds)
    const timer = setTimeout(() => {
      navigate("/TradeForTalent"); // Ensure you navigate correctly to the desired route
    }, 5000);

    return () => clearTimeout(timer); // Clean up the timer on component unmount
  }, [navigate]);

  return (
    <div className={styles.paymentSuccessContainer}>
      {/* 🎉 Confetti Effect */}
      <Confetti numberOfPieces={200} recycle={false} />

      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className={styles.paymentBox}
      >
        {/* ✅ Animated Checkmark and Text */}
        <div className={styles.contentContainer}>
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1.5 }}
            transition={{ duration: 0.5, yoyo: Infinity }}
            className={styles.iconContainer}
          >
            <CheckCircle className={styles.checkmarkIcon} style={{ color: "#4caf50" }} />
          </motion.div>

          <div>
            <h2 className={styles.successTitle}>Paiement réussi !</h2>
            <p className={styles.successMessage}>
              Merci pour votre paiement. Votre transaction a été traitée avec succès.
            </p>
            {message && <p>{message}</p>} {/* Display the success or error message */}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default PaymentSuccess;
