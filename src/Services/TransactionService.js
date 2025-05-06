// src/Services/TransactionService.js
import axios from "axios";

const API_URL = "http://localhost:8181/api/transactions";
const MISSIONS_URL = `http://localhost:8181/api/missions`;

const TransactionService = {
  getUserTransactions: async (userId) => {
    try {
      const storedUser = JSON.parse(localStorage.getItem("user"));
      const userRole = storedUser?.role;
      const userTypeEntreprise = storedUser?.typeEntreprise;
      const token = localStorage.getItem("token");
      if (!token) throw new Error("JWT Token is missing");

      const response = await axios.get(`${API_URL}/user/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Map transactions with a placeholder missionName (empty string)
      return response.data.map(tx => {
        const isAdminMissionFee = userRole === "Admin" && tx.paymentType === 'MISSION_FIRST_SLICE';
        const isSSICommission = tx.paymentType === 'SSI_COMMISSION';

        // Transaction type mapping
        let typeLabel = "";
        if (tx.paymentType === 'Subscription') {
          typeLabel = 'Abonnement';
        } else if (tx.paymentType === 'MISSION_FIRST_SLICE') {
          typeLabel = isAdminMissionFee ? 'Frais de mission' : 'Première tranche de mission';
        } else if (tx.paymentType === 'FUND_ADDITION') {
          typeLabel = 'Ajout de fonds';
        } else if (tx.paymentType === 'FROZEN_FUNDS') {
          typeLabel = 'Fonds gelés';
        } else if (tx.paymentType === 'SSI_COMMISSION') {
          typeLabel = 'Commission SSI';
        } else if (tx.paymentType === 'DISPUTE_RESOLUTION') { // Add this
          typeLabel = 'Résolution de litige';
        } else {
          typeLabel = 'Mission';
        }

        // Transaction direction logic
        let isIncoming = false;
let isOutgoing = false;
if (tx.paymentType === 'DISPUTE_RESOLUTION') {
  // Generic logic based on sender/receiver IDs
  isOutgoing = tx.senderId === userId;
  isIncoming = tx.receiverId === userId;
} else if (isSSICommission) {
          const isSSIReceiver = tx.receiverId === userId && userTypeEntreprise === "SSI";
          const isSSISender = tx.senderId === userId && userTypeEntreprise === "SSI";
          if (isSSIReceiver) {
            isIncoming = true;
          } else if (isSSISender) {
            isOutgoing = true;
          } else {
            isIncoming = userRole === "Entreprise" && tx.receiverId === userId;
            isOutgoing = tx.senderId === userId;
          }
        } else {
          if (
            tx.paymentType === 'FUND_ADDITION' ||
            (tx.paymentType === 'MISSION_FIRST_SLICE' && tx.receiverId === userId) ||
            (tx.paymentType === 'Subscription' && tx.adminReceiver?.id === userId) ||
            (tx.paymentType === 'Subscription' && userRole === "Admin") ||
            (tx.paymentType === 'MISSION_FINAL_PAYMENT' && tx.receiverId === userId)
          ) {
            isIncoming = true;
          }
          if (
            (tx.paymentType === 'Subscription' && tx.senderId === userId) ||
            (tx.paymentType === 'MISSION_FIRST_SLICE' && tx.senderId === userId) ||
            (tx.paymentType === 'MISSION_FINAL_PAYMENT' && tx.senderId === userId)
          ) {
            isOutgoing = true;
          }
          
        }

        return {
          id: tx.id,
          date: new Date(tx.createdAt),
          type: typeLabel,
          montant: tx.paymentType === 'SSI_COMMISSION'
            ? (tx.ssiCommission / 100).toFixed(2)
            : (tx.amount / 100).toFixed(2),
          // Set missionName to an empty string if missionId exists; otherwise, a dash
          missionId:tx.missionId,
          missionName: tx.missionId ? "" : "-",
          statut: tx.paymentType === 'FROZEN_FUNDS'
            ? 'Montant gelé'
            : (tx.status === 'succeeded' || tx.status === 'PROCESSED')
              ? 'Réussi'
              : 'Échoué',
          currency: tx.currency,
          applicationFee: tx.applicationFee,
          isIncoming,
          isOutgoing,
          isAdminMissionFee,
          senderId: tx.senderId,
          receiverId: tx.receiverId,
          ssiEnterprise: tx.ssiEnterpriseId
        };
      });
      
    } catch (error) {
      console.error("[getUserTransactions] Error:", error);
      throw error;
    }
  },

  getMissionById: async (missionId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${MISSIONS_URL}/${missionId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data;
    } catch (error) {
      console.error("[getMissionById] Error:", error);
      throw error;
    }
  }
};

export default TransactionService;
