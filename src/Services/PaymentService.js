import axios from "axios";

const API_BASE_URL = 'http://localhost:8081/payment' //st the URL if needed

const PaymentService = {
  createPayment: async (amount) => {
    try {
      const storedUser = JSON.parse(localStorage.getItem("userWithToken"));
      console.log(storedUser);

      // Define token before checking it
      const token = storedUser?.token;
      if (!token) throw new Error("JWT Token is missing");

      console.log(token);

      const response = await axios.post(
        `${API_BASE_URL}/create`,
        { amount }, // Request body
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // Attach the token in the Authorization header
          },
        }
      );
      const link = response.data.result.link;
      console.log("Redirecting to:", link);      
      window.location.href = link; // Redirects in the same tab

      return response.data; // Axios automatically parses the response JSON
    } catch (error) {
      console.error("Erreur lors du paiement:", error);
      throw error;
    }
  },

  verifyPayment: async (paymentId) => {
    try {
      const storedUser = JSON.parse(localStorage.getItem("user"));
      const token = storedUser?.token;
      if (!token) throw new Error("JWT Token is missing");

      const response = await axios.get(`${API_BASE_URL}/success`, {
        params: { payment_id: paymentId },
        headers: {
          Authorization: `Bearer ${token}`, // Attach the token in the Authorization header
        },
      });

      return response.data; // Axios automatically parses the response JSON
    } catch (error) {
      console.error("Erreur de vérification de paiement:", error);
      throw error;
    }
  },
};

export default PaymentService;
