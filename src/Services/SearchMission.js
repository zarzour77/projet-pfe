// searchMission.js

const API_URL = "http://localhost:8081/api/missions/search";

export const getMissions = () => {
  // Récupération du token stocké dans localStorage
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
