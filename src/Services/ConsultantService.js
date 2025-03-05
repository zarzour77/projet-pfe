import axios from 'axios';

const API_URL = 'http://localhost:8181/api/consultants';
const API_cv = 'http://localhost:8181/api/cv';


const ConsultantService = {
  createConsultant: async (consultantData) => {
    const storedUser = JSON.parse(localStorage.getItem("userWithToken"));
    const token = storedUser?.token;
    try {
      const response = await axios.post(
        `${API_URL}`,
        consultantData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return response.data;
    } catch (error) {
      console.error("Error creating consultant:", error);
      throw error;
    }
  },

  getConsultantById: async (id) => {
    const storedUser = JSON.parse(localStorage.getItem("userWithToken"));
    const token = storedUser?.token;
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
    const storedUser = JSON.parse(localStorage.getItem("userWithToken"));
    const token = storedUser?.token;
    try {
      const response = await axios.put(
        `${API_URL}/${id}`,
        consultantData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return response.data;
    } catch (error) {
      console.error("Error updating consultant:", error);
      throw error;
    }
  },

  generateCv: async (id) => {
    const storedUser = JSON.parse(localStorage.getItem("userWithToken"));
    const token = storedUser?.token;
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

  saveCv: async (id) => {
    const storedUser = JSON.parse(localStorage.getItem("userWithToken"));
    const token = storedUser?.token;
    try {
      const response = await axios.post(
        `${API_cv}/saveCv/${id}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return response.data;
    } catch (error) {
      console.error("Error saving CV:", error);
      throw error;
    }
  },

  uploadProfilePicture: async (id, file) => {
    const storedUser = JSON.parse(localStorage.getItem("userWithToken"));
    const token = storedUser?.token;
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
    const storedUser = JSON.parse(localStorage.getItem("userWithToken"));
    const token = storedUser?.token;
    try {
      const response = await axios.post(
        `${API_URL}/${consultantId}/addExperience`,
        experienceData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return response.data;
    } catch (error) {
      console.error("Error adding experience:", error);
      throw error;
    }
  },

  deleteExperience: async (consultantId, experienceId) => {
    const storedUser = JSON.parse(localStorage.getItem("userWithToken"));
    const token = storedUser?.token;
    try {
      const response = await axios.delete(
        `${API_URL}/${consultantId}/deleteExperience/${experienceId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return response.data;
    } catch (error) {
      console.error("There was an error deleting the experience!", error);
      return error.response ? error.response.data : "Error deleting experience";
    }
  },

  // Competence methods
  addCompetence: async (consultantId, competenceData) => {
    const storedUser = JSON.parse(localStorage.getItem("userWithToken"));
    const token = storedUser?.token;
    try {
      const response = await axios.post(
        `${API_URL}/${consultantId}/addCompetence`,
        competenceData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return response.data;
    } catch (error) {
      console.error("Error adding competence:", error);
      throw error;
    }
  },

  deleteCompetence: async (consultantId, competenceId) => {
    const storedUser = JSON.parse(localStorage.getItem("userWithToken"));
    const token = storedUser?.token;
    try {
      const response = await axios.delete(
        `${API_URL}/${consultantId}/deleteCompetence/${competenceId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return response.data;
    } catch (error) {
      console.error("Error deleting competence:", error);
      throw error;
    }
  },

  // Domaine methods
  addDomaine: async (consultantId, domaineData) => {
    const storedUser = JSON.parse(localStorage.getItem("userWithToken"));
    const token = storedUser?.token;
    try {
      const response = await axios.post(
        `${API_URL}/${consultantId}/addDomaine`,
        domaineData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return response.data;
    } catch (error) {
      console.error("Error adding domaine:", error);
      throw error;
    }
  },

  deleteDomaine: async (consultantId, domaineId) => {
    const storedUser = JSON.parse(localStorage.getItem("userWithToken"));
    const token = storedUser?.token;
    try {
      const response = await axios.delete(
        `${API_URL}/${consultantId}/deleteDomaine/${domaineId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return response.data;
    } catch (error) {
      console.error("Error deleting domaine:", error);
      throw error;
    }
  },

  // New methods for Langue, Formation, Certification

  addLangue: async (consultantId, langueData) => {
    const storedUser = JSON.parse(localStorage.getItem("userWithToken"));
    const token = storedUser?.token;
    try {
      const response = await axios.post(
        `${API_URL}/${consultantId}/addLangue`,
        langueData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return response.data;
    } catch (error) {
      console.error("Error adding langue:", error);
      throw error;
    }
  },

  addFormation: async (consultantId, formationData) => {
    const storedUser = JSON.parse(localStorage.getItem("userWithToken"));
    const token = storedUser?.token;
    try {
      const response = await axios.post(
        `${API_URL}/${consultantId}/addFormation`,
        formationData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return response.data;
    } catch (error) {
      console.error("Error adding formation:", error);
      throw error;
    }
  },

  addCertification: async (consultantId, certificationData) => {
    const storedUser = JSON.parse(localStorage.getItem("userWithToken"));
    const token = storedUser?.token;
    try {
      const response = await axios.post(
        `${API_URL}/${consultantId}/addCertification`,
        certificationData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return response.data;
    } catch (error) {
      console.error("Error adding certification:", error);
      throw error;
    }
  },
// Add these methods to your ConsultantService object

deleteLangue: async (consultantId, langueId) => {
  const storedUser = JSON.parse(localStorage.getItem("userWithToken"));
  const token = storedUser?.token;
  try {
    const response = await axios.delete(
      `${API_URL}/${consultantId}/deleteLangue/${langueId}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data;
  } catch (error) {
    console.error("Error deleting langue:", error);
    throw error;
  }
},

deleteFormation: async (consultantId, formationId) => {
  const storedUser = JSON.parse(localStorage.getItem("userWithToken"));
  const token = storedUser?.token;
  try {
    const response = await axios.delete(
      `${API_URL}/${consultantId}/deleteFormation/${formationId}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data;
  } catch (error) {
    console.error("Error deleting formation:", error);
    throw error;
  }
},

deleteCertification: async (consultantId, certificationId) => {
  const storedUser = JSON.parse(localStorage.getItem("userWithToken"));
  const token = storedUser?.token;
  try {
    const response = await axios.delete(
      `${API_URL}/${consultantId}/deleteCertification/${certificationId}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data;
  } catch (error) {
    console.error("Error deleting certification:", error);
    throw error;
  }
},
  saveMissionForConsultant: async (consultantId, missionId) => {
    const storedUser = JSON.parse(localStorage.getItem("userWithToken"));
    const token = storedUser?.token;
    try {
      const response = await axios.post(
        `${API_URL}/${consultantId}/savedMissions?missionId=${missionId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return response.data;
    } catch (error) {
      console.error("Error saving mission:", error);
      throw error;
    }
  },

  getSavedMissionsForConsultant: async (consultantId) => {
    const storedUser = JSON.parse(localStorage.getItem("userWithToken"));
    const token = storedUser?.token;
    try {
      const response = await axios.get(
        `${API_URL}/${consultantId}/savedMissions`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return response.data;
    } catch (error) {
      console.error("Error getting saved missions:", error);
      throw error;
    }
  }
};

export default ConsultantService;
