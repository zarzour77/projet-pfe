/* eslint-disable react/no-unescaped-entities */
import { useState } from "react";
import styles from "./Subscription.module.css";
import PaymentService from "../Services/PaymentService";
import { useNavigate } from "react-router-dom";

const Subscription = () => {
  const [selectedPlan, setSelectedPlan] = useState("Standard");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const storedUser = JSON.parse(localStorage.getItem("user"));
  const consultantId = storedUser?.id;

  const plans = {
    Standard: {
      price: 0,
      features: [
        "Marché mondial des freelances d'Upwork",
        "Fonctionnalités alimentées par l'IA",
        "Outils de collaboration",
        "Rapports standard",
        "Paiement au fil du travail"
      ],
      fee: "Frais de service : 5%"
    },
    Premium: {
      price: 30000, // Montant en centimes (30000 = 300.00€)
      features: [
        "Tout inclus dans Standard",
        "Top 1% des talents présélectionnés",
        "Appariement expert des talents",
        "Support premium 24/7",
        "Facturation mensuelle"
      ],
      fee: "Frais de service : 10%"
    }
  };

  const handleSubscribe = async (planType) => {
    if (planType === "Premium") {
      setLoading(true);
      try {
        const response = await PaymentService.initiateSubscription(consultantId, {
          amount: 30000,
          currency: "usd",
          planType: "Premium",
          quantity: 1,
          name: "Subscription"
        });
  
        // Sauvegarder toutes les données nécessaires pour le traitement ultérieur
        localStorage.setItem("subscriptionData", JSON.stringify({
          sessionId: response.sessionId,
          consultantId,
          planType: "Premium"
        }));
      } catch (error) {
        setMessage("Échec de l'initialisation du paiement");
      }
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <button 
        className={styles.backButton}
        onClick={() => navigate("/profilePage")}
      >
        ← Retour au Profil
      </button>
      <h1 className={styles.header}>Plans d'abonnement</h1>
      <p className={styles.subheader}>Choisissez le plan qui correspond à vos besoins</p>
      
      <div className={styles.plansContainer}>
        {Object.entries(plans).map(([planKey, details]) => (
          <div 
            key={planKey}
            className={`${styles.planCard} ${selectedPlan === planKey ? styles.selected : ""}`}
            onClick={() => setSelectedPlan(planKey)}
          >
            <div className={styles.planHeader}>
              <h3>{planKey}</h3>
              <span className={styles.serviceFee}>{details.fee}</span>
            </div>
            
            <div className={styles.priceSection}>
              {planKey === "Standard" ? (
                <div className={styles.currentPlan}>Plan standard activé</div>
              ) : (
                <button 
                  className={styles.selectButton}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSubscribe(planKey);
                  }}
                  disabled={loading}
                >
                  {loading ? "Traitement..." : "Sélectionner le plan"}
                </button>
              )}
            </div>

            <ul className={styles.featuresList}>
              {details.features.map((feature, index) => (
                <li key={index} className={styles.featureItem}>
                  <span className={styles.checkIcon}>✓</span>
                  {feature}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {message && <div className={styles.message}>{message}</div>}
    </div>
  );
};

export default Subscription;
