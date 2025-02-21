import axios from 'axios';

const API_URL = 'http://localhost:8181/api/consultants';

const storedUser = JSON.parse(localStorage.getItem("userWithToken"));
const token = storedUser?.token;
const ConsultantService = {
createConsultant: async (consultantData) => {
    try {
      const response = await axios.post(
        `${API_URL}`, // Adjust the endpoint if needed
        consultantData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error creating consultant:", error);
      throw error;
    }
  },
  updateConsultant: async (id, consultantData) => {
    try {
      const response = await axios.put(
        `${API_URL}/${id}`,
        consultantData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error updating consultant:", error);
      throw error;
    }
  }
  

}
export default ConsultantService;
