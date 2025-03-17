import axios from 'axios';

const API_URL = 'http://localhost:8181/api/propositions/stats/consultant';
const API_URL1 = 'http://localhost:8181/api/consultants';


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
  

export default { getConsultantStats, updateBadge };