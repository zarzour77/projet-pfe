// src/Services/TransactionService.js
import axios from "axios";

const API_URL = "http://localhost:8081/api/transactions"; // Adjust if needed

const TransactionService = {
  getUserTransactions: async (userId) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("JWT Token is missing");

      // Example: GET /api/transactions/user/{userId}
      const response = await axios.get(`${API_URL}/user/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error("[getUserTransactions] Error:", error);
      throw error;
    }
  },
};

export default TransactionService;