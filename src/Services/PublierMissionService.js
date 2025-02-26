// src/services/publiermissionService.js
import axios from "axios";

const API_URL = "http://localhost:8181/api/missions";

const publishMission = async (missionData) => {
  // Récupération de l'utilisateur avec le token depuis le localStorage
  const storedUser = JSON.parse(localStorage.getItem("userWithToken"));
  const token = storedUser?.token;
  if (!token) {
    return Promise.reject(new Error("JWT Token is missing"));
  }
  
  // Si missionData.entreprise est null ou ne contient pas d'ID, on le remplace par l'ID de l'utilisateur
  if (!missionData.entreprise || !missionData.entreprise.id) {
    missionData.entreprise = { id: storedUser.id };
  }
  
  try {
    const response = await axios.post(`${API_URL}/add`, missionData, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Erreur lors de la publication de la mission :", error);
    throw error;
  }
};

export default {
  publishMission,
};