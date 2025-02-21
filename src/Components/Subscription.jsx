    import { useState } from "react";
    import styles from "./Subscription.module.css";
    import PaymentService from "../Services/PaymentService"; // Import the PaymentService
    const Subscription = () => {
      const [selectedPlan, setSelectedPlan] = useState(null);
      const [message, setMessage] = useState("");
      const [loading, setLoading] = useState(false); // State to manage loading
      // Define pricing for each plan
      const planPrices = {
        silver: 30000,
        gold: 50000,
        platinum: 90000
      };

      const handleSelection = (plan) => {
        setSelectedPlan(plan);
        setMessage(""); // Clear any previous messages
      };

      // Handle subscription and payment creation
      const handleSubscribe = async () => {
        if (!selectedPlan) return;

        const amount = planPrices[selectedPlan]; // Get the amount for the selected plan
        localStorage.setItem("SubscriptionType",JSON.stringify(selectedPlan))
        // Show the success message immediately when the user clicks
        setMessage(`Paiement initié avec succès. Votre choix: ${selectedPlan.charAt(0).toUpperCase() + selectedPlan.slice(1)}`);

        // Start loading and show spinner
        setLoading(true);

        try {
          // Simulate delay before making the payment request
          setTimeout(async () => {
            await PaymentService.createPayment(amount);
            setLoading(false); // Stop loading after the payment request
            
          }, 1000); // 2 seconds delay to simulate loading
        } catch (error) {
          console.error("Erreur lors du paiement:", error);
          setMessage("Erreur lors du paiement. Veuillez réessayer.");
          setLoading(false); // Stop loading in case of error
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
                <i className={`bi ${plan === "silver" ? "bi-award" : plan === "gold" ? "bi-gem" : "bi-stars"}`}></i>
                <h3>{plan.charAt(0).toUpperCase() + plan.slice(1)}</h3>
                <p>
                  {plan === "silver" && "Accès limité aux fonctionnalités de base"}
                  {plan === "gold" && "Accès étendu avec plus de privilèges"}
                  {plan === "platinum" && "Accès premium à toutes les fonctionnalités"}
                </p>
                <span className={styles.price}>{planPrices[plan] / 1000}DT/mois</span>
              </div>
            ))}
          </div>
          
          <button className={styles.subscribeButton} disabled={!selectedPlan || loading} onClick={handleSubscribe}>
            {loading ? (
              <div className={styles.spinner}></div> // Add the spinner inside the button when loading
            ) : (
              selectedPlan ? `S'abonner à ${selectedPlan.charAt(0).toUpperCase() + selectedPlan.slice(1)}` : "Sélectionnez un plan"
            )}
          </button>

          {message && <p className={styles.message}>{message}</p>} {/* Show the message */}
        </div>
      );
    };

    export default Subscription;
