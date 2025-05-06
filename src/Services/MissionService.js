import axios from 'axios';

const API_URL = 'http://localhost:8181/api/missions';

const MissionService = {
  searchMissions: async (query) => {
    const token = localStorage.getItem("token");
    try {
      const response = await axios.get(`${API_URL}/search1`, {
        params: { q: query },
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error searching missions:", error);
      throw error;
    }
  },

  getMissionById: async (id) => {
    const token = localStorage.getItem("token");
    try {
      const response = await axios.get(`${API_URL}/${id}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error getting mission by id:", error);
      throw error;
    }
  }
};

export default MissionService;
