import axios from "axios";

const API_BASE_URL = 'http://localhost:8081/payment';

const PaymentService = {
  createPayment: async (amount) => {
    const token = localStorage.getItem("token");

    try {
      if (!token) throw new Error("JWT Token is missing");

      const response = await axios.post(
        `${API_BASE_URL}/create`,
        { amount },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      // Save the paymentId in localStorage for later processing
      localStorage.setItem("paymentId", response.data.result.payment_id);
      const link = response.data.result.link;
      console.log("Redirecting to:", link);
      window.location.href = link;
      return response.data;
    } catch (error) {
      console.error("Erreur lors du paiement:", error);
      throw error;
    }
  },

  verifyPayment: async (paymentId) => {
    const token = localStorage.getItem("token");
    try {
      if (!token) throw new Error("JWT Token is missing");

      const response = await axios.get(`${API_BASE_URL}/success`, {
        params: { payment_id: paymentId },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return response.data;
    } catch (error) {
      console.error("Erreur de vérification de paiement:", error);
      throw error;
    }
  },

  processPayment: async (payload) => {
    const token = localStorage.getItem("token");
    try {
      if (!token) throw new Error("JWT Token is missing");

      const response = await axios.post(
        `${API_BASE_URL}/process`,
        payload,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Erreur lors du traitement du paiement:", error);
      throw error;
    }
  },
};

export default PaymentService;