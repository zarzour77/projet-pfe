import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { CheckCircle } from "lucide-react";
import Confetti from "react-confetti";
import styles from "./PaymentSuccess.module.css";
import PaymentService from "../services/PaymentService";

const PaymentSuccess = () => {
  const [planDetails, setPlanDetails] = useState(null);
  const [error, setError] = useState("");
  const [paymentType, setPaymentType] = useState(null);
  const [fundsAdded, setFundsAdded] = useState(null);
  const navigate = useNavigate();
  const processed = useRef(false); // Prevent duplicate processing

  useEffect(() => {
    const processPayment = async () => {
      const subscriptionData = JSON.parse(localStorage.getItem("subscriptionData"));
      const addFundsData = JSON.parse(localStorage.getItem("addFundsData"));
      const user = JSON.parse(localStorage.getItem("user")); // Get current user
      console.log(subscriptionData)
      console.log(addFundsData)
      console.log(user)

      try {
        if (subscriptionData) {
          await PaymentService.processSubscription({
            sessionId: subscriptionData.sessionId,
            consultantId: subscriptionData.consultantId,
            planType: subscriptionData.planType
          });
          setPaymentType("subscription");
          setPlanDetails({
            type: subscriptionData.planType,
            features: getPlanFeatures(subscriptionData.planType)
          });
          localStorage.removeItem("subscriptionData");
        } else if (addFundsData) {
          await PaymentService.confirmAddFunds(addFundsData.sessionId);
          setPaymentType("addFunds");
          setFundsAdded(addFundsData.amount);
          localStorage.removeItem("addFundsData");
        } else {
          setError("Payment data not found");
          return;
        }

        // Determine redirect path based on user type
        const redirectPath = user?.role === 'Entreprise' 
          ? "/EntrepriseProfilePage" 
          : "/ProfilePage";

        setTimeout(() => navigate(redirectPath), 5000);
      } catch (error) {
        console.error("Payment processing failed:", error);
        setError("Error processing payment");
      }
    };

    if (!processed.current) {
      processed.current = true;
      processPayment();
    }
  }, [navigate]);

  const getPlanFeatures = (planType) => {
    switch (planType) {
      case "Premium":
        return [
          "Accès aux meilleurs talents (top 1%)",
          "Support prioritaire 24/7",
          "Analyses avancées",
          "Outils de gestion d'équipe",
          "Facturation personnalisée"
        ];
      default:
        return [
          "Accès au marché standard",
          "Support de base",
          "Rapports simples",
          "Paiement à la mission"
        ];
    }
  };

  return (
    <div className={styles.container}>
      <Confetti numberOfPieces={200} recycle={false} />
      
      <div className={styles.successCard}>
        <CheckCircle className={styles.checkIcon} size={64} />
        <h1>Payment Successful!</h1>
        
        {error ? (
          <p className={styles.error}>{error}</p>
        ) : (
          <>
            {paymentType === "subscription" && (
              <div className={styles.planDetails}>
                <h2>Fonctionnalités du plan {planDetails.type} :</h2>
                <ul>
                  {planDetails.features.map((feature, index) => (
                    <li key={index}>{feature}</li>
                  ))}
                </ul>
              </div>
            )}
            {paymentType === "addFunds" && (
              <div className={styles.planDetails}>
                <h2>Funds Added Successfully!</h2>
                <p>${fundsAdded} has been added to your account balance.</p>
              </div>
            )}
            <p>Redirection vers votre profil...</p>
          </>
        )}
      </div>
    </div>
  );
};

export default PaymentSuccess;