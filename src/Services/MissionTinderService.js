// MissionTinderService.js
import axios from 'axios';

// Remplacez l'URL par l'URL de votre API
const API_URL = 'http://localhost:8081/api/missions/stories';

export const getMissions = async () => {
  // Récupération du token stocké dans localStorage
  const storedUser = JSON.parse(localStorage.getItem("userWithToken"));
  const token = storedUser?.token;
  if (!token) {
    return Promise.reject(new Error("JWT Token is missing"));
  }

  try {
    const response = await axios.get(API_URL, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Erreur dans getMissions:", error);
    throw error;
  }
};
