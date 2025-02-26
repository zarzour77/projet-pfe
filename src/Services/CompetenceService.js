import axios from 'axios';

const API_URL = 'http://localhost:8181/api/competences';
const storedUser = JSON.parse(localStorage.getItem("userWithToken"));
const token = storedUser?.token;

const getAllCompetences = async () => {
  try {
    const response = await axios.get(API_URL, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Erreur lors de la récupération des compétences :", error);
    throw error;
  }
};

const createCompetence = async (competence) => {
  try {
    const response = await axios.post(API_URL, competence, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Erreur lors de la création de la compétence :", error);
    throw error;
  }
};

export default {
  getAllCompetences,
  createCompetence,
};