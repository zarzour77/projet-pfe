import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { CheckCircle } from "lucide-react";
import { motion } from "framer-motion";
import Confetti from "react-confetti"; // 🎉 Confetti effect
import styles from "./PaymentSuccess.module.css"; // Import CSS module

const PaymentSuccess = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      //   navigate("/trade-for-talent");
    }, 5000);
    return () => clearTimeout(timer);
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
            <h2 className={styles.successTitle}>Payment Successful ! </h2>
            <p className={styles.successMessage}>
              Thank you for your payment. Your transaction has been successfully processed.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default PaymentSuccess;
