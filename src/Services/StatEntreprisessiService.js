import axios from 'axios';

const API_URL = 'http://localhost:8081/api/propositions/stats/entreprise';
const API_URL_EARNINGS = 'http://localhost:8081/api/payments/enterprise';
const API_URL_CONSULTANT_STATS = 'http://localhost:8081/api/entreprises'; // Base URL pour les endpoints liés aux entreprises

const getEntreprisessiStats = async (entrepriseId, periodDays) => {
  const token = localStorage.getItem("token");
  try {
    const response = await axios.get(`${API_URL}/${entrepriseId}?periodDays=${periodDays}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Erreur lors de la récupération des stats de l'entreprise :", error);
    throw error;
  }
};

const getEnterpriseEarnings = async (enterpriseId, period) => {
  const token = localStorage.getItem("token");
  try {
    const response = await axios.get(`${API_URL_EARNINGS}/${enterpriseId}?period=${period}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    console.log("Données de revenus reçues :", response.data);
    return response.data;
  } catch (error) {
    console.error("Erreur lors de la récupération des revenus de l'entreprise :", error);
    throw error;
  }
};

const getConsultantsStats = async (entrepriseId, period) => {
  const token = localStorage.getItem("token");
  try {
    const response = await axios.get(
      `${API_URL_CONSULTANT_STATS}/${entrepriseId}/consultants/stats?period=${period}`,
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    );
    console.log("Données des stats consultants depuis le back :", response.data);
    return response.data;
  } catch (error) {
    console.error("Erreur lors de la récupération des stats consultants :", error);
    throw error;
  }
};

// Nouvelle fonction pour récupérer la moyenne du jobSuccess
const getJobSuccessAverage = async (entrepriseId) => {
  const token = localStorage.getItem("token");
  try {
    const response = await axios.get(
      `${API_URL_CONSULTANT_STATS}/${entrepriseId}/jobsuccessaverage`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        }
      }
    );
    console.log("Moyenne du jobSuccess récupérée :", response.data);
    return response.data;
  } catch (error) {
    console.error("Erreur lors de la récupération de la moyenne du jobSuccess :", error);
    throw error;
  }
};

export default { 
  getEntreprisessiStats, 
  getEnterpriseEarnings, 
  getConsultantsStats,
  getJobSuccessAverage 
};
