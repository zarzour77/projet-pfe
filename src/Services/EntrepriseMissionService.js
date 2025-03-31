import axios from 'axios';

const API_URL = 'http://localhost:8181/api/entreprises';
const MISSION_API_URL = 'http://localhost:8181/api/missions';
const PROPOSITION_API_URL = 'http://localhost:8181/api/propositions';
const CONSULTANT_API_URL = 'http://localhost:8181/api/consultants';
const PAYMENT_API_URL = 'http://localhost:8181/api/payments';
const getTokenConfig = () => {
  const token = localStorage.getItem('token');
  return { headers: { Authorization: `Bearer ${token}` } };
};

export const getPublishedMissions = async (entrepriseId) => {
  const response = await axios.get(`${API_URL}/${entrepriseId}/missions`, getTokenConfig());
  return response.data;
};

export const getConsultantsForMission = async (missionId) => {
  const response = await axios.get(`${MISSION_API_URL}/${missionId}/consultants`, getTokenConfig());
  return response.data;
};

export const getPropositionsForMission = async (missionId) => {
  const response = await axios.get(`${PROPOSITION_API_URL}/mission/${missionId}`, getTokenConfig());
  return response.data;
};

export const updatePropositionStatus = async (propositionId, newStatus) => {
  const response = await axios.put(`${PROPOSITION_API_URL}/${propositionId}`, { statut: newStatus }, getTokenConfig());
  return response.data;
};

export const acceptMission = async (missionId) => {
  const response = await axios.post(`${MISSION_API_URL}/${missionId}/accept`, {}, getTokenConfig());
  return response.data;
};

export const incrementConsultantWorkload = async (consultantId) => {
  const response = await axios.put(`${CONSULTANT_API_URL}/${consultantId}/incrementWorkload`, {}, getTokenConfig());
  return response.data;
};

export const terminateMission = async (missionId, endDate) => {
  const response = await axios.put(`${MISSION_API_URL}/${missionId}/terminate`, { endDate }, getTokenConfig());
  return response.data;
};

export const decrementConsultantWorkload = async (consultantId) => {
  const response = await axios.put(`${CONSULTANT_API_URL}/${consultantId}/decrementWorkload`, {}, getTokenConfig());
  return response.data;
};

export const getMissionPaymentDetails = async (missionId) => {
  const response = await axios.get(
    `${PAYMENT_API_URL}/${missionId}/payment-details`,
    getTokenConfig()
  );
  return response.data;
};

export const initiateFirstPayment = async (missionId) => {
  const response = await axios.post(`${PAYMENT_API_URL}/${missionId}/first-payment`, {}, getTokenConfig());
  return response.data;
};

export const initiateFinalPayment = async (missionId) => {
  const response = await axios.post(`${PAYMENT_API_URL}/${missionId}/final-payment`, {}, getTokenConfig());
  return response.data;
};

export default { 
  getPublishedMissions, 
  getConsultantsForMission, 
  getPropositionsForMission, 
  updatePropositionStatus,
  acceptMission,
  incrementConsultantWorkload,
  terminateMission,
  decrementConsultantWorkload,
  getMissionPaymentDetails,
  initiateFirstPayment,
  initiateFinalPayment
};