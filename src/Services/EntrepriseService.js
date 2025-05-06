import axios from 'axios';

const API_URL = 'http://localhost:8181/api/entreprises'; // Adjust the URL if needed

const getConsultantsForEntreprise = async (id) => {
  const token = localStorage.getItem("token");
  try {
    const response = await axios.get(`${API_URL}/${id}/consultants`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error("Erreur lors de la récupération des consultants pour l'entreprise:", error);
    throw error;
  }
};

const uploadProfilePicture = async (id, file) => {
  const token = localStorage.getItem("token");
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
};

const getEntrepriseById = async (id) => {
  const token = localStorage.getItem("token");
  try {
    const response = await axios.get(`${API_URL}/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    console.error("Erreur lors de la récupération de l'entreprise:", error);
    throw error;
  }
};

const updateEntreprise = async (id, entrepriseData) => {
  const token = localStorage.getItem("token");
  try {
    const response = await axios.put(`${API_URL}/${id}`, entrepriseData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Erreur lors de la mise à jour de l'entreprise:", error);
    throw error;
  }
};

const getMissions = async (id) => {
  const token = localStorage.getItem("token");
  try {
    const response = await axios.get(`${API_URL}/${id}/missions`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    console.error("Erreur lors de la récupération des missions pour l'entreprise:", error);
    throw error;
  }
};

const removeConsultant = async (entrepriseId, consultantId) => {
  const token = localStorage.getItem("token");
  try {
    const response = await axios.delete(`${API_URL}/${entrepriseId}/consultants/${consultantId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error("Erreur lors de la suppression du consultant:", error);
    throw error;
  }
};

const getFrozenBalance = async (userId) => {
  const token = localStorage.getItem("token");
  try {
    const response = await axios.get(`${API_URL}/frozen-balance/${userId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching frozen balance:", error);
    throw error;
  }
};

const searchEntreprises = async (query) => {
  const token = localStorage.getItem("token");
  try {
    const response = await axios.get(`${API_URL}/search?q=${encodeURIComponent(query)}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error("Error searching entreprises:", error);
    throw error;
  }
};

const getAllEntreprises = async () => {
  const token = localStorage.getItem("token");
  try {
    const response = await axios.get(`${API_URL}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    
    // Process each item. If the item has only an id (or is a number), fetch the full object.
    const processedData = await Promise.all(
      response.data.map(async (item) => {
        // Check if item is a number or if it is an object with only one property (id)
        if (typeof item === 'number' || (typeof item === 'object' && Object.keys(item).length === 1 && item.id)) {
          try {
            return await getEntrepriseById(item.id || item);
          } catch (error) {
            console.error(`Error fetching details for entreprise ID ${item.id || item}:`, error);
            return null;
          }
        }
        // Else, assume it's a full object
        return item;
      })
    );
    
    // Filter out any invalid entries and sort by the property nomEntreprise (fallback on nom)
    return processedData
      .filter(ent => ent && ent.id)
      .sort((a, b) => {
        const nameA = a.nomEntreprise || a.nom || '';
        const nameB = b.nomEntreprise || b.nom || '';
        return nameA.localeCompare(nameB);
      });
  } catch (error) {
    console.error("Error fetching all entreprises:", error);
    throw error;
  }
};

export default {
  getEntrepriseById,
  updateEntreprise,
  getConsultantsForEntreprise,
  getMissions,
  removeConsultant,
  uploadProfilePicture,
  getFrozenBalance,
  searchEntreprises,
  getAllEntreprises, // NEW METHOD exported
};
