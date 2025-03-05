// messengerService.js
import axios from 'axios';

const API_URL = 'http://localhost:8181/api';

// Récupère le token depuis le localStorage et construit les headers JSON
const getAuthHeaders = () => {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("JWT Token is missing");
  }
  return {
    Authorization: `Bearer ${token}`,
  };
};

/**
 * Récupère toutes les conversations de l'utilisateur (via son email).
 * Exemple d'endpoint : GET /api/conversations?email=utilisateur@mail.com
 */
export const getConversations = async (email) => {
  try {
    const response = await axios.get(`${API_URL}/conversations?email=${email}`, {
      headers: {
        ...getAuthHeaders(),
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Erreur dans getConversations:", error);
    throw error;
  }
};

/**
 * Récupère l'historique des messages pour une conversation donnée.
 * Exemple d'endpoint : GET /api/messages/conversation/:conversationId
 */
export const getConversationHistory = async (conversationId) => {
  try {
    const response = await axios.get(`${API_URL}/messages/conversation/${conversationId}`, {
      headers: {
        ...getAuthHeaders(),
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Erreur dans getConversationHistory:", error);
    throw error;
  }
};

/**
 * Crée une nouvelle conversation entre deux utilisateurs.
 * Exemple d'endpoint : POST /api/conversations
 * Le corps de la requête contient { senderEmail, receiverEmail }
 */
export const createConversation = async (senderEmail, receiverEmail) => {
  try {
    const response = await axios.post(
      `${API_URL}/conversations?senderEmail=${encodeURIComponent(senderEmail)}&receiverEmail=${encodeURIComponent(receiverEmail)}`,
      null,
      {
        headers: {
          ...getAuthHeaders(),
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Erreur dans createConversation:", error);
    throw error;
  }
};

/**
 * Envoie un message texte.
 * Exemple d'endpoint : POST /api/messages
 */
export const sendMessage = async (message) => {
  try {
    const response = await axios.post(`${API_URL}/messages`, message, {
      headers: {
        ...getAuthHeaders(),
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Erreur dans sendMessage:", error);
    throw error;
  }
};

/**
 * Envoie un fichier sous forme de message (multipart/form-data).
 * Exemple d'endpoint : POST /api/messages/file
 */
export const uploadFileMessage = async (formData) => {
  try {
    const response = await axios.post(`${API_URL}/messages/file`, formData, {
      headers: {
        ...getAuthHeaders(),
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Erreur dans uploadFileMessage:", error);
    throw error;
  }
};
