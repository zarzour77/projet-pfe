import axios from 'axios';

const API_URL = 'http://localhost:8081/api/consultants';
const API_URL1 = 'http://localhost:8081/api/profile-views';

const createProfileView = async (consultantId) => {
  const token = localStorage.getItem("token");
  try {
    const response = await axios.post(API_URL1, { consultantId }, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  } catch (error) {
    console.error("Erreur lors de la création de la vue de profil :", error);
    throw error;
  }
};


const getProfileViews = async (consultantId, periodDays) => {
  const token = localStorage.getItem("token");
  try {
    const response = await axios.get(`${API_URL}/${consultantId}/profile-views?periodDays=${periodDays}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Erreur lors de la récupération des profile views:", error);
    throw error;
  }
};

export default { getProfileViews, createProfileView };
