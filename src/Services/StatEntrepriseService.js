// StatEntrepriseService.js
import axios from 'axios';

const API_URL = "http://localhost:8181/api"; // adapter l'URL de base de votre API


const StatEntrepriseService = {
  getDonutExpenseData: async (entrepriseId, period) => {
    const token = localStorage.getItem("token");
    try {
      const response = await axios.get(
        `${API_URL}/payments/donut/entreprise/${entrepriseId}?period=${period}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Erreur lors de la récupération des données du donut expense:", error);
      throw error;
    }
  },

  
    getProfileViews: async (entrepriseId, periodDays) => {
        const token = localStorage.getItem("token");
        try {
          const response = await axios.get(
            `${API_URL}/entreprises/${entrepriseId}/profile-views?periodDays=${periodDays}`,
            { headers: { Authorization: `Bearer ${token}` } }
          );
          return response.data;
        } catch (error) {
          console.error("Erreur lors de la récupération des profile views:", error);
          throw error;
        }
      },
  getMissionsByStatus: async (entrepriseId, statut) => {
    const token = localStorage.getItem("token");
    try {
      const response = await axios.get(
        `${API_URL}/entreprises/${entrepriseId}/missions/status?statut=${encodeURIComponent(statut)}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return response.data;
    } catch (error) {
      console.error(`Error fetching missions with status ${statut}:`, error);
      throw error;
    }
  },

getAggregatedMissions: async (entrepriseId, period) => {
    const token = localStorage.getItem("token");
    try {
      const response = await axios.get(
        `${API_URL}/entreprises/${entrepriseId}/missions/aggregate?period=${encodeURIComponent(period)}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return response.data;
    } catch (error) {
      console.error(`Error fetching aggregated missions for period ${period}:`, error);
      throw error;
    }
  }
};

export default StatEntrepriseService;