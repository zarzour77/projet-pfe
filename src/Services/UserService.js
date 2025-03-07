import axios from 'axios';

const API_URL = 'http://localhost:8081/api/users';

const UserService = {
  updateSubscriptionType: async (userId, subscriptionType) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.put(
        `${API_URL}/${userId}/subscription`,
        { subscriptionType },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("[updateSubscriptionType] Response:", response.data);
      return response.data;
    } catch (error) {
      console.error("[updateSubscriptionType] Error:", error);
      throw error;
    }
  },

  getById: async (userId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `${API_URL}/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("[getById] Response:", response.data);
      return response.data;
    } catch (error) {
      console.error("[getById] Error:", error);
      throw error;
    }
  },

  updateUserRole: async (userId, role) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.put(
        `${API_URL}/${userId}/role`,
        { role },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("[updateUserRole] Response:", response.data);
      return response.data;
    } catch (error) {
      console.error("[updateUserRole] Error:", error);
      throw error;
    }
  },

  updateUser: async (userId, updatedData) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.put(
        `${API_URL}/${userId}`,
        updatedData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("[updateUser] Response:", response.data);
      return response.data;
    } catch (error) {
      console.error("[updateUser] Error:", error);
      throw error;
    }
  },

  uploadProfilePicture: async (id, file) => {
    try {
      const token = localStorage.getItem("token");
      const formData = new FormData();
      formData.append("file", file);
      const response = await axios.post(
        `${API_URL}/${id}/uploadProfilePic`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log("[uploadProfilePicture] Response:", response.data);
      return response.data;
    } catch (error) {
      console.error("[uploadProfilePicture] Error:", error);
      throw error;
    }
  },
};

export default UserService;