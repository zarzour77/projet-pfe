import { useState } from "react";
import styles from "./Subscription.module.css";
import PaymentService from "../services/PaymentService";
import UserService from "../Services/UserService";
import { useNavigate } from "react-router-dom";

const storedConsultant = JSON.parse(localStorage.getItem("user"));
const consultantId = storedConsultant?.id;
console.log(storedConsultant.token)
const Subscription = () => {
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Define pricing for each plan
  const planPrices = {
    Silver: 0, // Free plan
    Gold: 50000,
    Platinum: 90000,
  };

  const handleSelection = (plan) => {
    setSelectedPlan(plan);
    setMessage("");
  };

  // Handle subscription and payment creation/processing
  const handleSubscribe = async () => {
    if (!selectedPlan) return;

    setLoading(true);

    if (selectedPlan === "Silver") {
      // For Silver plan, no payment processing is needed.
      setMessage("Abonnement gratuit activé pour Silver.");
      try {
        await UserService.createSilverSubscription(consultantId);
        setTimeout(() => {
          navigate("/ProfilePage");
          setLoading(false);
        }, 2000);
      } catch (error) {
        console.error("Erreur lors de la création de l'abonnement Silver:", error);
        setMessage("Erreur lors de la création de l'abonnement. Veuillez réessayer.");
        setLoading(false);
      }
    } else {
      // For paid plans: create payment then process it.
      const amount = planPrices[selectedPlan];
      // Store selected plan and amount in localStorage for later use in PaymentSuccess
      localStorage.setItem("SubscriptionType", JSON.stringify(selectedPlan));
      localStorage.setItem("SubscriptionAmount", amount.toString());
      try {
        // Create payment and retrieve the payment details (including payment_id)
        await PaymentService.createPayment(amount);
        // PaymentService.createPayment will store the paymentId in localStorage and redirect the user.
      } catch (error) {
        console.error("Erreur lors du paiement:", error);
        setMessage("Erreur lors du paiement. Veuillez réessayer.");
        setLoading(false);
      }
    }
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
            <i className={`bi ${plan === "Silver" ? "bi-award" : plan === "Gold" ? "bi-gem" : "bi-stars"}`}></i>
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