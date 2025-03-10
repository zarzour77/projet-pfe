import axios from 'axios';

const API_URL = 'http://localhost:8181/api/consultants';

// Fonction utilitaire pour récupérer la configuration avec le token JWT
const getTokenConfig = () => {
  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("JWT Token is missing");
  }
  return {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  };
};

const getConsultantById = async (consultantId) => {
  try {
    const config = getTokenConfig();
    const response = await axios.get(`${API_URL}/${consultantId}`, config);
    return response.data;
  } catch (error) {
    throw new Error('Erreur lors de la récupération du consultant');
  }
};

const getConsultantCompetences = async (consultantId) => {
  try {
    const config = getTokenConfig();
    const response = await axios.get(`${API_URL}/${consultantId}/competences`, config);
    return response.data;
  } catch (error) {
    throw new Error('Erreur lors de la récupération des compétences');
  }
};

const getConsultantExperiences = async (consultantId) => {
  try {
    const config = getTokenConfig();
    const response = await axios.get(`${API_URL}/${consultantId}/experiences`, config);
    return response.data;
  } catch (error) {
    throw new Error('Erreur lors de la récupération des expériences');
  }
};

export default {
  getConsultantById,
  getConsultantCompetences,
  getConsultantExperiences,
};