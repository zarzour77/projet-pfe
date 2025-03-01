import axios from 'axios';

const BASE_URL = 'http://localhost:8081/api';

function getToken() {
  const storedUser = JSON.parse(localStorage.getItem('userWithToken'));
  if (!storedUser) return null;
  return storedUser.token || storedUser.jwt;
}

function getAuthConfig() {
  const token = getToken();
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
}

export async function getAllConsultants() {
  const response = await axios.get(`${BASE_URL}/consultants`, getAuthConfig());
  return response.data;
}

export async function getAllDomaines() {
  const response = await axios.get(`${BASE_URL}/domaines`, getAuthConfig());
  return response.data;
}

export async function getAllCompetences() {
  const response = await axios.get(`${BASE_URL}/competences`, getAuthConfig());
  return response.data;
}
