// Dans StatAdminService.js
import axios from 'axios';

const INSCRIPTIONS_API_URL = 'http://localhost:8181/api/entreprises/inscriptions';
const TOP_TALENTS_API_URL = 'http://localhost:8181/api/missions/top-talents';
const USER_ROLE_STATS_API_URL = 'http://localhost:8181/api/users/role-stats';
const CONSULTANT_COUNTRY_STATS_API_URL = 'http://localhost:8181/api/consultants/countrystats';
const CONNECTION_STATS_API_URL = 'http://localhost:8181/api/users/connection-stats';
const TRANSACTIONS_VOLUME_API_URL = 'http://localhost:8181/api/payments/transactions/volume/all';


export const fetchGlobalApplicationFeeStats = async (period = "6months") => {
  const token = localStorage.getItem("token");
  try {
    const response = await axios.get(
      `http://localhost:8181/api/payments/global/applicationFee?period=${period}`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data; // doit renvoyer { labels: [...], data: [...] }
  } catch (error) {
    console.error("Erreur lors de la récupération des stats globales d'applicationFee :", error);
    throw error;
  }
};
export const fetchTransactionsVolume = async (period = "month") => {
  const token = localStorage.getItem("token");
  try {
    const response = await axios.get(`${TRANSACTIONS_VOLUME_API_URL}?period=${period}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Erreur lors de la récupération du volume des transactions :", error);
    throw error;
  }
};
export const fetchInscriptions = async (filter = "all") => {
  const token = localStorage.getItem("token");
  try {
    const response = await axios.get(`${INSCRIPTIONS_API_URL}?filter=${filter}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Erreur lors de la récupération des inscriptions :", error);
    throw error;
  }
};

export const fetchTopTalents = async () => {
  const token = localStorage.getItem("token");
  try {
    const response = await axios.get(TOP_TALENTS_API_URL, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Erreur lors de la récupération des données Top Talents :", error);
    throw error;
  }
};

export const fetchUserRoleStats = async () => {
  const token = localStorage.getItem("token");
  try {
    const response = await axios.get(USER_ROLE_STATS_API_URL, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Erreur lors de la récupération des statistiques des rôles :", error);
    throw error;
  }
};

export const fetchCountryStats = async () => {
  const token = localStorage.getItem("token");
  try {
    const response = await axios.get(CONSULTANT_COUNTRY_STATS_API_URL, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Erreur lors de la récupération des statistiques géographiques :", error);
    throw error;
  }
};

export const fetchConnectionStats = async () => {
  const token = localStorage.getItem("token");
  try {
    const response = await axios.get(CONNECTION_STATS_API_URL, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Erreur lors de la récupération des statistiques de connexion :", error);
    throw error;
  }
};