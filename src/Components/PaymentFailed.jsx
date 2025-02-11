import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { XCircle } from "lucide-react";  // Import the error icon
import { motion } from "framer-motion";
import styles from "./PaymentFailed.module.css"; // Import CSS module

const PaymentFailed = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      // You can redirect after 5 seconds or do any other action
      // navigate("/retry-payment");
    }, 5000);
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className={styles.paymentFailedContainer}>

      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className={styles.paymentBox}
      >
        {/* ❌ Error Icon with text */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1.5 }}
          transition={{ duration: 0.5, yoyo: Infinity }}
          className={styles.iconTextContainer} // Apply flex layout here
        >
          <XCircle className={styles.errorIcon}  />
          <div>
            <h2 className={styles.errorTitle}>Payment Failed ! </h2>
            <p className={styles.errorMessage}>
              Something went wrong. Please try again later.
            </p>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default PaymentFailed;
