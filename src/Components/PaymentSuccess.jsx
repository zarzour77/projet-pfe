import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CheckCircle } from "lucide-react";
import { motion } from "framer-motion";
import Confetti from "react-confetti";
import styles from "./PaymentSuccess.module.css";
import UserService from "../Services/UserService";
import PaymentService from "../services/PaymentService";

const PaymentSuccess = () => {
  const [message, setMessage] = useState(""); 
  const navigate = useNavigate();

  useEffect(() => {
    // Check if the payment was already processed in this client session.
    if (localStorage.getItem("paymentProcessed") === "true") return;
    localStorage.setItem("paymentProcessed", "true");

    const storedUser = JSON.parse(localStorage.getItem("user"));
    const selectedPlan = JSON.parse(localStorage.getItem("SubscriptionType"));
    const subscriptionAmount = localStorage.getItem("SubscriptionAmount");
    const paymentId = localStorage.getItem("paymentId");

    if (storedUser?.id && selectedPlan && paymentId && subscriptionAmount) {
      const payload = {
        paymentId: paymentId,
        paymentFor: "subscription",
        userId: storedUser.id,
        amount: parseInt(subscriptionAmount),
        planType: selectedPlan,
      };

      PaymentService.processPayment(payload)
        .then(async () => {
          setMessage("Abonnement mis à jour avec succès !");
          const updatedUser = await UserService.getById(storedUser.id);
          localStorage.setItem("user", JSON.stringify(updatedUser));

          // Cleanup payment-related data
          localStorage.removeItem("paymentId");
          localStorage.removeItem("SubscriptionType");
          localStorage.removeItem("SubscriptionAmount");

          // Redirect after a delay
          setTimeout(() => {
            navigate("/ProfilePage");
            localStorage.removeItem("paymentProcessed"); // Reset flag for future payments
          }, 5000);
        })
        .catch((error) => {
          console.error("Erreur lors du traitement du paiement ou de la mise à jour:", error);
          setMessage("Erreur lors du traitement du paiement ou de la mise à jour.");
        });
    } else {
      setMessage("Erreur: Données de paiement manquantes.");
    }
  }, [navigate]);

  return (
    <div className={styles.paymentSuccessContainer}>
      <Confetti numberOfPieces={200} recycle={false} />
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className={styles.paymentBox}
      >
        <div className={styles.contentContainer}>
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1.5 }}
            transition={{ duration: 0.5, repeat: Infinity }}
            className={styles.iconContainer}
          >
            <CheckCircle className={styles.checkmarkIcon} style={{ color: "#4caf50" }} />
          </motion.div>
          <div>
            <h2 className={styles.successTitle}>Paiement réussi !</h2>
            <p className={styles.successMessage}>
              Merci pour votre paiement. Votre transaction a été traitée avec succès.
            </p>
            {message && <p>{message}</p>}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default PaymentSuccess;