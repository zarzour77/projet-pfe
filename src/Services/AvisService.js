// src/Services/AvisService.js
import axios from 'axios';

const API_URL = 'http://localhost:8181/api/avis'; // Adjust based on your API base URL

const AvisService = {
  createAvis: async (auteurId, cibleId, note, commentaire, missionId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        API_URL,
        {
          auteurId,
          cibleId,
          note,
          commentaire
        },
        {
          params: { missionId },
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error creating avis:', error);
      throw error;
    }
  }
};

export default AvisService;
