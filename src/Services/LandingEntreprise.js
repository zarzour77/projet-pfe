import axios from 'axios';

const BASE_URL = 'http://localhost:8181/api';

// Retrieve all consultants
export async function getById(entrepriseId) {
  const token = localStorage.getItem("token");
  const response = await axios.get(`${BASE_URL}/entreprises/${entrepriseId}`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  console.log(response)
  return response.data;
}
// Retrieve all consultants
export async function getAllConsultants() {
  const token = localStorage.getItem("token");
  const response = await axios.get(`${BASE_URL}/consultants`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
}

// Retrieve all domaines
export async function getAllDomaines() {
  const token = localStorage.getItem("token");
  const response = await axios.get(`${BASE_URL}/domaines`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
}

// Retrieve all competences
export async function getAllCompetences() {
  const token = localStorage.getItem("token");

  const response = await axios.get(`${BASE_URL}/competences`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
}

// Retrieve published missions for an entreprise
export async function getPublishedMissionsForEntreprise(entrepriseId) {
  const token = localStorage.getItem("token");

  const response = await axios.get(`${BASE_URL}/entreprises/${entrepriseId}/missions`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
}

// Invite a consultant or send a recruitment invitation
export async function inviteConsultantToJob(entrepriseId, consultantId, propositionData) {
  const token = localStorage.getItem("token");
  console.log(propositionData);
  console.log(entrepriseId);
  console.log(consultantId);
  console.log(token);
  const response = await axios.post(
    `${BASE_URL}/propositions/entreprises/${entrepriseId}/consultants/${consultantId}`,
    propositionData,
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
}