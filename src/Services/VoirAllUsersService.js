import axios from "axios";
import EntrepriseService from "./EntrepriseService"; // Assurez-vous du bon chemin relatif

const API_BASE_URL = "http://localhost:8081/api"; // À adapter selon votre configuration

export const fetchAllUsers = async () => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.get(`${API_BASE_URL}/users`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const users = Array.isArray(response.data) ? response.data : [];

    // Pour les entreprises, enrichir avec les infos étendues
    const updatedUsers = await Promise.all(
      users.map(async (user) => {
        if (user.role === "Entreprise") {
          try {
            const extendedUser = await EntrepriseService.getEntrepriseById(user.id);
            return extendedUser;
          } catch (error) {
            console.error(
              `Erreur lors de la récupération de l'entreprise étendue pour l'utilisateur ${user.id}:`,
              error
            );
            return user;
          }
        }
        return user;
      })
    );

    return updatedUsers;
  } catch (error) {
    console.error("Erreur lors de la récupération des utilisateurs :", error);
    throw error;
  }
};

export const updateUser = async (id, userData) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.put(`${API_BASE_URL}/users/${id}`, userData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error(`Erreur lors de la mise à jour de l'utilisateur ${id}:`, error);
    throw error;
  }
};

export const deleteUser = async (id) => {
  try {
    const token = localStorage.getItem("token");
    await axios.delete(`${API_BASE_URL}/users/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  } catch (error) {
    console.error(`Erreur lors de la suppression de l'utilisateur ${id}:`, error);
    throw error;
  }
};

/**
 * Suspend un utilisateur jusqu'à une date donnée.
 *
 * @param {number} id L'identifiant de l'utilisateur
 * @param {string} suspendedUntil La date de suspension au format ISO (ex: "2025-12-31T23:59")
 */
export const suspendUser = async (id, suspendedUntil) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.post(
      `${API_BASE_URL}/users/suspend/${id}?suspendedUntil=${encodeURIComponent(suspendedUntil)}`,
      null,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error(`Erreur lors de la suspension de l'utilisateur ${id}:`, error);
    throw error;
  }
};

/**
 * Lève la suspension d'un utilisateur.
 *
 * @param {number} id L'identifiant de l'utilisateur
 */
export const unsuspendUser = async (id) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.post(
      `${API_BASE_URL}/users/unsuspend/${id}`,
      null,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error(`Erreur lors de la levée de suspension de l'utilisateur ${id}:`, error);
    throw error;
  }
};

export default {
  fetchAllUsers,
  updateUser,
  deleteUser,
  suspendUser,
  unsuspendUser,
};
