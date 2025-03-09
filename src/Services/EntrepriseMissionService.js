import axios from 'axios';

const API_URL = 'http://localhost:8081/api/entreprises';
const MISSION_API_URL = 'http://localhost:8081/api/missions';
const PROPOSITION_API_URL = 'http://localhost:8081/api/propositions';
const CONSULTANT_API_URL = 'http://localhost:8081/api/consultants';

// Configuration de l'authentification
const getTokenConfig = () => {
  const token = localStorage.getItem('token');
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

// Récupère les missions publiées par une entreprise
export const getPublishedMissions = async (entrepriseId) => {
  const config = getTokenConfig();
  const response = await axios.get(`${API_URL}/${entrepriseId}/missions`, config);
  return response.data;
};

// Récupère les consultants associés à une mission
export const getConsultantsForMission = async (missionId) => {
  const config = getTokenConfig();
  const response = await axios.get(`${MISSION_API_URL}/${missionId}/consultants`, config);
  return response.data;
};

// Récupère toutes les propositions pour une mission donnée
export const getPropositionsForMission = async (missionId) => {
  const config = getTokenConfig();
  const response = await axios.get(`${PROPOSITION_API_URL}/mission/${missionId}`, config);
  return response.data;
};
export const updatePropositionStatus = async (propositionId, newStatus) => {
  const config = getTokenConfig();
  // On envoie uniquement le champ 'statut' à mettre à jour
  const response = await axios.put(`${PROPOSITION_API_URL}/${propositionId}`, { statut: newStatus }, config);
  return response.data;
};

export const acceptMission = async (missionId) => {
  const config = getTokenConfig();
  const response = await axios.put(`${MISSION_API_URL}/${missionId}/accept`, {}, config);
  return response.data;
};
export const incrementConsultantWorkload = async (consultantId) => {
  const config = getTokenConfig();
  const response = await axios.put(`${CONSULTANT_API_URL}/${consultantId}/incrementWorkload`, {}, config);
  return response.data;
};



export default { 
  getPublishedMissions, 
  getConsultantsForMission, 
  getPropositionsForMission, 
  updatePropositionStatus,
  acceptMission,
  incrementConsultantWorkload
};

