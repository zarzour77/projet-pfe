import axios from 'axios';

const API_URL = 'http://localhost:8081/api/entreprises'; // Adjust the URL if needed

const getConsultantsForEntreprise = async (id) => {
  const token = localStorage.getItem("token");

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
const uploadProfilePicture= async (id, file) => {
  const token = localStorage.getItem("token");

  try {
    const formData = new FormData();
    formData.append("file", file);
    const response = await axios.post(
      `http://localhost:8081/api/users/${id}/uploadProfilePic`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error uploading profile picture:", error);
    throw error;
  }
};
const getEntrepriseById = async (id) => {
  const token = localStorage.getItem("token");

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
  const token = localStorage.getItem("token");

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
  const token = localStorage.getItem("token");

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
const removeConsultant = async (entrepriseId, consultantId) => {
  const token = localStorage.getItem("token");

  try {
    const response = await axios.delete(`${API_URL}/${entrepriseId}/consultants/${consultantId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error("Erreur lors de la suppression du consultant:", error);
    throw error;
  }

};
const getFrozenBalance = async (userId) => {
  const token = localStorage.getItem("token");
  
  try {
    const response = await axios.get(
      `${API_URL}/frozen-balance/${userId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching frozen balance:", error);
    throw error;
  }
};
export default {
  getEntrepriseById,
  updateEntreprise,
  getConsultantsForEntreprise,
  getMissions,
  removeConsultant,
  uploadProfilePicture,
  getFrozenBalance
};