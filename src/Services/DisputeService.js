// DisputeService.js
import axios from 'axios';

const API_URL = 'http://localhost:8181/api/disputes';

/**
 * Crée un nouveau ticket de litige.
 * @param {Object} disputeData - Les données du litige, incluant subject, description, evidence et sender (objet contenant l'id de l'utilisateur).
 * @returns {Promise<Object>} - Le ticket créé.
 */
export const createDispute = async (disputeData) => {
  const token = localStorage.getItem("token");
  try {
    const response = await axios.post(API_URL, disputeData, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Erreur lors de la création du litige :", error);
    throw error;
  }
};

/**
 * Récupère la liste des tickets d'un utilisateur.
 * @param {number} userId - L'identifiant de l'utilisateur.
 * @returns {Promise<Array>} - La liste des tickets.
 */
export const getDisputesByUser = async (userId) => {
  const token = localStorage.getItem("token");
  try {
    const response = await axios.get(`${API_URL}?userId=${userId}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Erreur lors de la récupération des litiges :", error);
    throw error;
  }
};