import axios from 'axios';

const API_URL = 'http://localhost:8081/api/entreprises'; // Adjust the API URL as needed

const EntrepriseService = {
  updateEntreprise: async (id, entrepriseData) => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    const token = storedUser?.token;
    try {
      const response = await axios.put(
        `${API_URL}/${id}`,
        entrepriseData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error updating entreprise:", error);
      throw error;
    }
  },
};

export default EntrepriseService;