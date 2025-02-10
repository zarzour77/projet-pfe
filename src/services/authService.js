import axios from "axios";

const API_URL = "http://localhost:8081/api/auth"; // Change selon ton backend

// Fonction pour s'authentifier (login)
export const login = async (email, password) => {
  try {
    const response = await axios.post(`${API_URL}/login`, { email, password });
    return response.data;
  } catch (error) {
    console.error("Erreur de connexion :", error.response?.data || error.message);
    throw error;
  }
};

// Fonction pour s'inscrire (signup)
export const signup = async (userData) => {
  try {
    const response = await axios.post(`${API_URL}/signup`, userData);
    return response.data;
  } catch (error) {
    console.error("Erreur d'inscription :", error.response?.data || error.message);
    throw error;
  }
};
