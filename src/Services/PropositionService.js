// src/Services/PropositionService.js

import axios from 'axios';

const API_BASE_URL = 'http://localhost:8181/api/propositions';

// Fonction qui appelle l'endpoint pour accepter une proposition de recrutement
export const acceptRecruitmentProposition = async (propositionId) => {
  const token = localStorage.getItem('token');
  console.log(token);
  if (!token) {
    throw new Error("JWT Token is missing");
  }
  try {
    const response = await axios.put(
      `${API_BASE_URL}/${propositionId}/accept`,
      {}, // pas de body spécifique
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Erreur lors de l'acceptation du recrutement :", error);
    throw error;
  }
};

export const getPropositionsByConsultant = async (consultantId) => {
  const token = localStorage.getItem('token');
  if (!token) {
    throw new Error("JWT Token is missing");
  }
  try {
    const response = await axios.get(`${API_BASE_URL}/consultant/${consultantId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error("Erreur lors de la récupération des propositions :", error);
    throw error;
  }
};

export const getAllPropositions = async () => {
  const token = localStorage.getItem('token');
  if (!token) {
    throw new Error("JWT Token is missing");
  }
  try {
    const response = await axios.get(API_BASE_URL, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error("Erreur lors de la récupération de toutes les propositions :", error);
    throw error;
  }
};

export const createProposition = async (payload) => {
  const token = localStorage.getItem('token');
  if (!token) {
    throw new Error("JWT Token is missing");
  }
  try {
    const response = await axios.post(API_BASE_URL, payload, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Erreur lors de la création d'une proposition :", error);
    throw error;
  }
};

export const updatePropositionStatus = async (propositionId, newStatus) => {
  const token = localStorage.getItem('token');
  if (!token) {
    throw new Error("JWT Token is missing");
  }
  try {
    const response = await axios.put(
      `${API_BASE_URL}/${propositionId}`,
      { statut: newStatus },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Erreur lors de la mise à jour du statut de la proposition :", error);
    throw error;
  }
};

export const deleteProposition = async (propositionId) => {
  const token = localStorage.getItem('token');
  if (!token) {
    throw new Error("JWT Token is missing");
  }
  try {
    await axios.delete(`${API_BASE_URL}/${propositionId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return true;
  } catch (error) {
    console.error("Erreur lors de la suppression de la proposition :", error);
    throw error;
  }

  
};
export const getMissionFromProposition = async (propositionId) => {
  const token = localStorage.getItem('token');
  if (!token) {
    throw new Error("JWT Token is missing");
  }
  try {
    const response = await axios.get(`${API_BASE_URL}/${propositionId}/mission`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error("Erreur lors de la récupération de la mission depuis la proposition :", error);
    throw error;
  }
  
};
