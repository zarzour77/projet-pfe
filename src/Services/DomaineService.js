// src/services/DomaineService.js
import axios from "axios";

const API_URL = "http://localhost:8081/api/domaines";

// Récupération de l'utilisateur avec le token depuis le localStorage
const storedUser = JSON.parse(localStorage.getItem("userWithToken"));
const token = storedUser?.token;

const DomaineService = {
  getAllDomaines: async () => {
    try {
      const response = await axios.get(API_URL, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error("Erreur lors de la récupération des domaines :", error);
      throw error;
    }
  },

  createDomaine: async (domaineData) => {
    try {
      const response = await axios.post(API_URL, domaineData, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error("Erreur lors de la création du domaine :", error);
      throw error;
    }
  },

  updateDomaine: async (id, domaineData) => {
    try {
      const response = await axios.put(`${API_URL}/${id}`, domaineData, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error("Erreur lors de la mise à jour du domaine :", error);
      throw error;
    }
  },

  deleteDomaine: async (id) => {
    try {
      const response = await axios.delete(`${API_URL}/${id}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error("Erreur lors de la suppression du domaine :", error);
      throw error;
    }
  },
};

export default DomaineService;
