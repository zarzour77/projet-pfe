import { useState } from "react";
import styles from "./Subscription.module.css";
import PaymentService from "../Services/PaymentService";
import UserService from "../Services/UserService";
import { useNavigate } from "react-router-dom";
const storedConsultant = JSON.parse(localStorage.getItem("user"));
const consultantId=storedConsultant?.id;
const Subscription = () => {
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Define pricing for each plan
  const planPrices = {
    Silver: 0, // Price for display purposes (even though it's free)
    Gold: 50000,
    Platinum: 90000
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
    setLoading(true);

    // Show message immediately upon button click
    if (selectedPlan === "Silver") {
      setMessage("Abonnement gratuit activé pour Silver.");
    } else {
      setMessage(
        `Paiement initié avec succès. Votre choix: ${selectedPlan.charAt(0).toUpperCase() + selectedPlan.slice(1)}.`
      );
    }

    setTimeout(async () => {
      if (selectedPlan === "Silver") {
        try {
          await UserService.updateSubscriptionType(consultantId, "Silver");
          setTimeout(() => {
            navigate("/ProfilePage");
            setLoading(false);
          }, 2000);
        } catch (error) {
          console.error("Erreur lors de la mise à jour de l'abonnement:", error);
          setMessage("Erreur lors de la mise à jour de l'abonnement. Veuillez réessayer.");
          setLoading(false);
        }
      } else {
        const amount = planPrices[selectedPlan];
        try {
          await PaymentService.createPayment(amount);
          await UserService.updateSubscriptionType(consultantId, selectedPlan);
          setTimeout(() => {
            navigate("/PaymentSuccess");
            setLoading(false);
          }, 2000);
        } catch (error) {
          console.error("Erreur lors du paiement:", error);
          setMessage("Erreur lors du paiement. Veuillez réessayer.");
          setLoading(false);
        }
      }
    }, 1000); // 1 second delay before processing starts
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
              plan === "Silver" ? "bi-award" : plan === "Gold" ? "bi-gem" : "bi-stars"
            }`}></i>
            <h3>{plan.charAt(0).toUpperCase() + plan.slice(1)}</h3>
            <p>
              {plan === "Silver" && "Accès limité aux fonctionnalités de base"}
              {plan === "Gold" && "Accès étendu avec plus de privilèges"}
              {plan === "Platinum" && "Accès premium à toutes les fonctionnalités"}
            </p>
            <span className={styles.price}>
              {plan === "Silver" ? "Gratuit" : `${planPrices[plan] / 1000}DT/mois`}
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