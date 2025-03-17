import axios from 'axios';

const API_URL = 'http://localhost:8181/api/entreprises'; // Adjust the URL if needed

const getConsultantsForEntreprise = async (id) => {
  const storedUser = JSON.parse(localStorage.getItem("user"));
  const token = storedUser?.token;
  try {
    const response = await axios.get(`${API_URL}/${id}/consultants`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    console.error("Erreur lors de la récupération des consultants pour l'entreprise:", error);
    throw error;
  }
};

const getEntrepriseById = async (id) => {
  const storedUser = JSON.parse(localStorage.getItem("user"));
  const token = storedUser?.token;
  try {
    const response = await axios.get(`${API_URL}/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    console.error("Erreur lors de la récupération de l'entreprise:", error);
    throw error;
  }
};

const updateEntreprise = async (id, entrepriseData) => {
  const storedUser = JSON.parse(localStorage.getItem("user"));
  const token = storedUser?.token;
  try {
    const response = await axios.put(
      `${API_URL}/${id}`,
      entrepriseData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Erreur lors de la mise à jour de l'entreprise:", error);
    throw error;
  }
};

const getMissions = async (id) => {
  const storedUser = JSON.parse(localStorage.getItem("user"));
  const token = storedUser?.token;
  try {
    const response = await axios.get(`${API_URL}/${id}/missions`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    console.error("Erreur lors de la récupération des missions pour l'entreprise:", error);
    throw error;
  }
};

export default {
  getEntrepriseById,
  updateEntreprise,
  getConsultantsForEntreprise,
  getMissions,
};
