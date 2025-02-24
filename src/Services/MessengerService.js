// messengerService.js
import axios from 'axios';

const API_URL = 'http://localhost:8181/api';

// Fonction utilitaire pour récupérer les headers d'authentification
const getAuthHeaders = () => {
  const storedUser = JSON.parse(localStorage.getItem("userWithToken"));
  const token = storedUser?.token;
  if (!token) {
    throw new Error("JWT Token is missing");
  }
  return {
    "Content-Type": "application/json",
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
      headers: getAuthHeaders(),
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
      headers: getAuthHeaders(),
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
  console.log("[Messenger] Creating conversation with:", senderEmail, receiverEmail);
  try {
    const response = await axios.post(
      `${API_URL}/conversations?senderEmail=${encodeURIComponent(senderEmail)}&receiverEmail=${encodeURIComponent(receiverEmail)}`,
      null, // Aucun corps n'est envoyé
      {
        headers: getAuthHeaders(),
      }
    );
    return response.data;
  } catch (error) {
    console.error("Erreur dans createConversation:", error);
    throw error;
  }
};


/**
 * Envoie un message.
 * Exemple d'endpoint : POST /api/messages
 * Le corps de la requête doit correspondre à la structure de votre message.
 */
export const sendMessage = async (message) => {
  try {
    const response = await axios.post(`${API_URL}/messages`, message, {
      headers: getAuthHeaders(),
    });
    return response.data;
  } catch (error) {
    console.error("Erreur dans sendMessage:", error);
    throw error;
  }
};
