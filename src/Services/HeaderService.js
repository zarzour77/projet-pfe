// services/HeaderService.js
import axios from 'axios';

export const fetchNotifications = (entrepriseId, token) => {
  const url = `http://localhost:8181/api/entreprises/${entrepriseId}/notifications`;
  console.log("Appel API vers:", url);
  return axios.get(url, {
    headers: { Authorization: `Bearer ${token}` },
  })
  .then(response => {
    return response;
  })
  .catch(error => {
    throw error;
  });
};