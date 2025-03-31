// src/Services/TransactionService.js
import axios from "axios";

const API_URL = "http://localhost:8081/api/transactions";

const TransactionService = {

  getUserTransactions: async (userId) => {
    try {
      const storedUser = JSON.parse(localStorage.getItem("user"));
      const userRole = storedUser?.role;

      const token = localStorage.getItem("token");
      if (!token) throw new Error("JWT Token is missing");

      const response = await axios.get(`${API_URL}/user/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("Transaction:", JSON.stringify(response.data, null, 2)); // Log each transaction

      // Transform the received data
      return response.data.map(tx => {

        const isAdminMissionFee = userRole === "Admin" && tx.paymentType === 'MISSION_FIRST_SLICE';
        
        return {
          id: tx.id,
          date: new Date(tx.createdAt), // Date conversion
          type: 
            tx.paymentType === 'Subscription'
              ? 'Abonnement'
              : tx.paymentType === 'MISSION_FIRST_SLICE'
              ? isAdminMissionFee ? 'Frais de mission' : 'Première tranche de mission'
              : tx.paymentType === 'FUND_ADDITION'
              ? 'Ajout de fonds'
              : tx.paymentType === 'FROZEN_FUNDS'
              ? 'Fonds gelés'
              : 'Mission',
          montant: (tx.amount / 100).toFixed(2), // Convert cents to desired unit
          statut: tx.paymentType === 'FROZEN_FUNDS'
            ? 'Montant gelé'
            : (tx.status === 'succeeded' || tx.status === 'PROCESSED')
            ? 'Réussi'
            : 'Échoué',
          currency: tx.currency,
          applicationFee: tx.applicationFee,
          isIncoming: tx.paymentType === 'FUND_ADDITION' || 
             (tx.paymentType === 'MISSION_FIRST_SLICE' && tx.receiverId === userId) ||
             (tx.paymentType === 'Subscription' && tx.adminReceiver?.id === userId)||
             (tx.paymentType === 'Subscription' && userRole === "Admin")||
             (tx.paymentType === 'MISSION_FINAL_PAYMENT' && tx.receiverId === userId),
          isOutgoing:  (tx.paymentType === 'Subscription' && tx.senderId === userId) ||
             (tx.paymentType === 'MISSION_FIRST_SLICE' && tx.senderId === userId)||
             (tx.paymentType === 'MISSION_FINAL_PAYMENT' && tx.senderId === userId),
          isAdminMissionFee,
        };
      });
      
    } catch (error) {
      console.error("[getUserTransactions] Error:", error);
      throw error;
    }
  },
};

export default TransactionService;
