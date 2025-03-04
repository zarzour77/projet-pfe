import axios from 'axios';

const BASE_URL = 'http://localhost:8081/api';

// Fonction pour récupérer le token JWT depuis le localStorage
function getToken() {
  const storedUser = JSON.parse(localStorage.getItem('userWithToken'));
  if (!storedUser) return null;
  return storedUser.token || storedUser.jwt;
}

// Configuration des headers d'authentification
function getAuthConfig() {
  const token = getToken();
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
}

// Récupérer tous les consultants
export async function getAllConsultants() {
  const response = await axios.get(`${BASE_URL}/consultants`, getAuthConfig());
  return response.data;
}

// Récupérer tous les domaines
export async function getAllDomaines() {
  const response = await axios.get(`${BASE_URL}/domaines`, getAuthConfig());
  return response.data;
}

// Récupérer toutes les compétences
export async function getAllCompetences() {
  const response = await axios.get(`${BASE_URL}/competences`, getAuthConfig());
  return response.data;
}

// Récupérer les missions publiées par l'entreprise
export async function getPublishedMissionsForEntreprise(entrepriseId) {
  // Par exemple, l'endpoint pourrait être /entreprises/{entrepriseId}/missions
  const response = await axios.get(`${BASE_URL}/entreprises/${entrepriseId}/missions`, getAuthConfig());
  return response.data;
}

// Envoyer une invitation à un consultant (utilise l'entité Proposition)
// On envoie une requête POST à /propositions avec les données de la proposition
export async function inviteConsultantToJob(entrepriseId, consultantId, propositionData) {
  const response = await axios.post(
    `${BASE_URL}/propositions`,
    propositionData,
    getAuthConfig()
  );
  return response.data;
}
