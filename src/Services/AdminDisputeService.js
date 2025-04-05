import axios from 'axios';

const API_URL = 'http://localhost:8081/api/disputes'; // Ajustez cette URL selon votre configuration

export const getAllDisputes = async () => {
  const token = localStorage.getItem("token");
  try {
    const response = await axios.get(`${API_URL}/all`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Erreur lors de la récupération de tous les litiges :", error);
    throw error;
  }
};

export const updateDisputeStatus = async (id, status) => {
  const token = localStorage.getItem("token");
  try {
    const response = await axios.put(
      `${API_URL}/${id}/status`,
      { status },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Erreur lors de la mise à jour du statut :", error);
    throw error;
  }
};

export const updateAdminResponse = async (id, adminResponse, status) => {
  const token = localStorage.getItem("token");
  try {
    const response = await axios.put(
      `${API_URL}/${id}/response`,
      { adminResponse, status },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Erreur lors de la mise à jour de la réponse admin :", error);
    throw error;
  }
};
