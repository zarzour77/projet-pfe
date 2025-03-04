import axios from 'axios';

const API_URL = 'http://localhost:8081/api/consultants';
const API_cv = 'http://localhost:8081/api/cv';
const storedUser = JSON.parse(localStorage.getItem("userWithToken"));
const token = storedUser?.token;

const ConsultantService = {
  createConsultant: async (consultantData) => {
    try {
      const response = await axios.post(
        `${API_URL}`,
        consultantData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error creating consultant:", error);
      throw error;
    }
  },

  getConsultantById: async (id) => {
    try {
      const response = await axios.get(`${API_URL}/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching consultant:", error);
      throw error;
    }
  },

  updateConsultant: async (id, consultantData) => {
    try {
      const response = await axios.put(
        `${API_URL}/${id}`,
        consultantData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error updating consultant:", error);
      throw error;
    }
  },

  // Generate CV (PDF preview)
  generateCv: async (id) => {
    try {
      const response = await axios.get(
        `${API_cv}/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
          responseType: 'arraybuffer'
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error generating CV:", error);
      throw error;
    }
  },

  // Save CV in the database and subscribe
  saveCv: async (id) => {
    try {
      const response = await axios.post(
        `${API_cv}/saveCv/${id}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error saving CV:", error);
      throw error;
    }
  },

  // New method to update the profile picture
  uploadProfilePicture: async (id, file) => {
    try {
      const formData = new FormData();
      formData.append("file", file);
      const response = await axios.post(
        `http://localhost:8181/api/users/${id}/uploadProfilePic`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error uploading profile picture:", error);
      throw error;
    }
  },
  addExperience: async (consultantId, experienceData) => {
    try {
      const response = await axios.post(
        `${API_URL}/${consultantId}/addExperience`,
        experienceData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error adding experience:", error);
      throw error;
    }
  },
  deleteExperience: async (consultantId, experienceId) => {
    try {
      const response = await axios.delete(
        `${API_URL}/${consultantId}/deleteExperience/${experienceId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return response.data; // Assuming the response is a success message
    } catch (error) {
      console.error("There was an error deleting the experience!", error);
      return error.response ? error.response.data : "Error deleting experience";
    }
  }
  
};

export default ConsultantService;