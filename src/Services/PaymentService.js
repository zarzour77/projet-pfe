import axios from "axios";

const API_BASE_URL = 'http://localhost:8181/api/payments'; // Updated base URL

const PaymentService = {
  // Existing methods
  initiateSubscription: async (consultantId, paymentRequest) => {
    const token = localStorage.getItem("token");
    try {
      const response = await axios.post(
        `${API_BASE_URL}/subscription?consultantId=${consultantId}`,
        paymentRequest,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      localStorage.setItem("sessionId", response.data.sessionId);
      window.location.href = response.data.sessionUrl;
      return response.data;
    } catch (error) {
      console.error("Payment initiation error:", error);
      throw error;
    }
  },

  processSubscription: async ({ sessionId, consultantId, planType }) => {
    const token = localStorage.getItem("token");
    try {
      const response = await axios.post(
        `${API_BASE_URL}/process-subscription?sessionId=${sessionId}&consultantId=${consultantId}&planType=${planType}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Payment processing error:", error);
      throw error;
    }
  },
// PaymentService.js
getCustomerBalance: async (userId) => {
  const token = localStorage.getItem("token");
  console.log(userId)
  try {
      const response = await axios.get(
          `${API_BASE_URL}/customerBalance/${userId}`,
          {
              headers: {
                  Authorization: `Bearer ${token}`,
              },
          }
      );
      return response.data;
  } catch (error) {
      console.error("Error fetching balance:", error);
      throw error;
  }
},
  // Updated add funds methods
  createAddFundsSession: async (userId, amount) => {
    const token = localStorage.getItem("token");
    try {
      const response = await axios.post(
        `${API_BASE_URL}/add-funds?userId=${userId}&amount=${amount}`,
        {},
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      localStorage.setItem("addFundsSessionId", response.data.sessionId);
      window.location.href = response.data.sessionUrl;
      return response.data;
    } catch (error) {
      console.error("Add funds initiation error:", error);
      throw error;
    }
  },

  confirmAddFunds: async (sessionId) => {
    const token = localStorage.getItem("token");
    try {
      const response = await axios.post(
        `${API_BASE_URL}/confirm-add-funds?sessionId=${sessionId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Add funds confirmation error:", error);
      throw error;
    }
  },

  verifyPayment: async (sessionId) => {
    const token = localStorage.getItem("token");
    try {
      const response = await axios.get(
        `${API_BASE_URL}/verify-payment/${sessionId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Payment verification error:", error);
      throw error;
    }
  },
  
};

export default PaymentService;