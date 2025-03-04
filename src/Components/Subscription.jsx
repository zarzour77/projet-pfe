import { useState } from "react";
import styles from "./Subscription.module.css";
import PaymentService from "../Services/PaymentService";

const Subscription = () => {
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // Define pricing for each plan
  const planPrices = {
    silver: 30000, // Price for display purposes (even though it's free)
    gold: 50000,
    platinum: 90000
  };

  const handleSelection = (plan) => {
    setSelectedPlan(plan);
    setMessage("");
  };

  // Handle subscription and payment creation
  const handleSubscribe = async () => {
    if (!selectedPlan) return;

    // Save the selected plan in local storage
    localStorage.setItem("SubscriptionType", JSON.stringify(selectedPlan));

    // Start loading spinner for all plans
    setLoading(true);

    // Simulate delay before processing subscription (free or paid)
    setTimeout(async () => {
      if (selectedPlan === "silver") {
        // For the silver plan, show free subscription message
        setMessage(
          `Abonnement gratuit activé pour ${selectedPlan.charAt(0).toUpperCase() + selectedPlan.slice(1)}.`
        );
      } else {
        // For non-free plans, proceed with payment
        const amount = planPrices[selectedPlan];
        setMessage(
          `Paiement initié avec succès. Votre choix: ${selectedPlan.charAt(0).toUpperCase() + selectedPlan.slice(1)}.`
        );
        try {
          await PaymentService.createPayment(amount);
        } catch (error) {
          console.error("Erreur lors du paiement:", error);
          setMessage("Erreur lors du paiement. Veuillez réessayer.");
        }
      }
      setLoading(false);
    }, 1000); // 1 second delay
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Choisissez votre abonnement</h2>
      <p className={styles.subtitle}>Sélectionnez le plan qui correspond le mieux à vos besoins.</p>
      
      <div className={styles.plans}>
        {Object.keys(planPrices).map((plan) => (
          <div
            key={plan}
            className={`${styles.plan} ${selectedPlan === plan ? styles.selected : ""}`}
            onClick={() => handleSelection(plan)}
          >
            <i className={`bi ${
              plan === "silver" ? "bi-award" : plan === "gold" ? "bi-gem" : "bi-stars"
            }`}></i>
            <h3>{plan.charAt(0).toUpperCase() + plan.slice(1)}</h3>
            <p>
              {plan === "silver" && "Accès limité aux fonctionnalités de base"}
              {plan === "gold" && "Accès étendu avec plus de privilèges"}
              {plan === "platinum" && "Accès premium à toutes les fonctionnalités"}
            </p>
            <span className={styles.price}>
              {plan === "silver" ? "Gratuit" : `${planPrices[plan] / 1000}DT/mois`}
            </span>
          </div>
        ))}
      </div>
      
      <button
        className={styles.subscribeButton}
        disabled={!selectedPlan || loading}
        onClick={handleSubscribe}
      >
        {loading ? (
          <div className={styles.spinner}></div>
        ) : (
          selectedPlan 
            ? `S'abonner à ${selectedPlan.charAt(0).toUpperCase() + selectedPlan.slice(1)}`
            : "Sélectionnez un plan"
        )}
      </button>

      {message && <p className={styles.message}>{message}</p>}
    </div>
  );
};

export default Subscription;