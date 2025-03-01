import axios from 'axios';

const API_URL = "http://localhost:8181/api/missions/search";
const API_URL_dom = "http://localhost:8181/api/missions/searchByDomain";
const API_URL_exp = "http://localhost:8181/api/missions/searchByExperience";
const API_URL_portetravail = "http://localhost:8181/api/missions/searchByPortetravail";
const API_URL_budget = "http://localhost:8181/api/missions/searchByBudget";
const API_URL_dureeEstime = "http://localhost:8181/api/missions/searchByDureeEstime";

// Récupération de toutes les missions
export const getMissions = () => {
  const storedUser = JSON.parse(localStorage.getItem("userWithToken"));
  const token = storedUser?.token;
  if (!token) {
    return Promise.reject(new Error("JWT Token is missing"));
  }
  return fetch(API_URL, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Erreur lors de la récupération des missions");
      }
      return response.json();
    })
    .catch((error) => {
      console.error("Erreur dans le service getMissions:", error);
      throw error;
    });
};

// Récupération des missions par domaine
export const getMissionsByDomaine = (domainIds = []) => {
  const storedUser = JSON.parse(localStorage.getItem("userWithToken"));
  const token = storedUser?.token;
  if (!token) {
    return Promise.reject(new Error("JWT Token is missing"));
  }
  let url = API_URL_dom;
  if (domainIds.length > 0) {
    const params = domainIds.map(id => `domaines=${id}`).join('&');
    url += `?${params}`;
  }
  return fetch(url, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Erreur lors de la récupération des missions");
      }
      return response.json();
    })
    .catch((error) => {
      console.error("Erreur dans le service getMissionsByDomaine:", error);
      throw error;
    });
};

// Récupération des missions par expérience
export const getMissionsByExperience = (experience) => {
  const storedUser = JSON.parse(localStorage.getItem("userWithToken"));
  const token = storedUser?.token;
  if (!token) {
    return Promise.reject(new Error("JWT Token is missing"));
  }
  let url = API_URL_exp;
  if (experience) {
    url += `?experience=${encodeURIComponent(experience)}`;
  }
  return fetch(url, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Erreur lors de la récupération des missions par expérience");
      }
      return response.json();
    })
    .catch((error) => {
      console.error("Erreur dans le service getMissionsByExperience:", error);
      throw error;
    });
};

// Récupération des missions par porte de travail
export const getMissionsByPorteDeTravail = (portetravail) => {
  const storedUser = JSON.parse(localStorage.getItem("userWithToken"));
  const token = storedUser?.token;
  if (!token) {
    return Promise.reject(new Error("JWT Token is missing"));
  }
  let url = API_URL_portetravail;
  if (portetravail) {
    url += `?portetravail=${encodeURIComponent(portetravail)}`;
  }
  return fetch(url, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Erreur lors de la récupération des missions par porte de travail");
      }
      return response.json();
    })
    .catch((error) => {
      console.error("Erreur dans le service getMissionsByPorteDeTravail:", error);
      throw error;
    });
};

// Récupération des missions par budget range
export const getMissionsByBudgetRange = async (minBudget, maxBudget) => {
  const storedUser = JSON.parse(localStorage.getItem("userWithToken"));
  const token = storedUser?.token;
  if (!token) {
    return Promise.reject(new Error("JWT Token is missing"));
  }
  try {
    const response = await axios.get(API_URL_budget, {
      params: { minBudget, maxBudget },
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Erreur lors de la récupération des missions par budget :", error);
    return [];
  }
};

// Récupération des missions par durée estimée
export const getMissionsByDureeEstime = (dureeEstime) => {
  const storedUser = JSON.parse(localStorage.getItem("userWithToken"));
  const token = storedUser?.token;
  if (!token) {
    return Promise.reject(new Error("JWT Token is missing"));
  }
  let url = API_URL_dureeEstime;
  if (dureeEstime) {
    url += `?dureeEstime=${encodeURIComponent(dureeEstime)}`;
  }
  return fetch(url, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Erreur lors de la récupération des missions par durée estimée");
      }
      return response.json();
    })
    .catch((error) => {
      console.error("Erreur dans le service getMissionsByDureeEstime:", error);
      throw error;
    });
};

// ==============================
// Fonctions pour les missions sauvegardées
// ==============================

// Sauvegarder une mission pour un consultant
export const saveMissionForConsultant = async (consultantId, missionId) => {
  const storedUser = JSON.parse(localStorage.getItem("userWithToken"));
  const token = storedUser?.token;
  if (!token) {
    return Promise.reject(new Error("JWT Token is missing"));
  }
  try {
    const response = await axios.post(
      `http://localhost:8181/api/consultants/${consultantId}/savedMissions`,
      null,
      {
        params: { missionId },
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Erreur lors de la sauvegarde de la mission :", error);
    throw error;
  }
};

// Récupérer les missions sauvegardées pour un consultant
export const getSavedMissions = async (consultantId) => {
  const storedUser = JSON.parse(localStorage.getItem("userWithToken"));
  const token = storedUser?.token;
  if (!token) {
    return Promise.reject(new Error("JWT Token is missing"));
  }
  try {
    const response = await axios.get(
      `http://localhost:8181/api/consultants/${consultantId}/savedMissions`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Erreur lors de la récupération des missions sauvegardées :", error);
    throw error;
  }
};