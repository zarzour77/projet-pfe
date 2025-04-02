import axios from 'axios';

const API_URL = 'http://localhost:8081/api/propositions/stats/consultant';
const API_URL1 = 'http://localhost:8081/api/consultants';
const API_URL2 = 'http://localhost:8081/api/conversations';
const API_URL_EARNINGS = 'http://localhost:8081/api/payments'; // notre endpoint backend

// Nouvel endpoint pour le donut chart
const getDonutData = async (consultantId, period) => {
  const token = localStorage.getItem("token");
  try {
    const response = await axios.get(`${API_URL_EARNINGS}/donut/${consultantId}?period=${period}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Erreur lors de la récupération des données du donut :", error);
    throw error;
  }
};

const getConsultantEarnings = async (consultantId, period) => {
  const token = localStorage.getItem("token");
  try {
    const response = await axios.get(`${API_URL_EARNINGS}/${consultantId}?period=${period}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Erreur lors de la récupération des earnings :", error);
    throw error;
  }
};
const getConsultantStats = async (consultantId, periodDays) => {
  const token = localStorage.getItem("token");
  try {
    const response = await axios.get(`${API_URL}/${consultantId}?periodDays=${periodDays}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Erreur lors de la récupération des stats du consultant :", error);
    throw error;
  }
};

const updateBadge = async (consultantId, badgeName) => {
  const token = localStorage.getItem("token");
  try {
    const response = await axios.put(
      `${API_URL1}/${consultantId}/badge`,
      { badge: badgeName },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Erreur lors de l'association du badge :", error);
    throw error;
  }
};

const getConversationCount = (consultantId) => {
  const token = localStorage.getItem("token");
  console.log(token);

  return axios.get(`${API_URL2}/count/${consultantId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }).then(response => response.data);
};

export default { getConsultantStats, updateBadge, getConversationCount , getConsultantEarnings, getDonutData};
