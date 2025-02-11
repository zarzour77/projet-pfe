import axios from 'axios';

const API_URL = 'http://localhost:8181/api/users';
const storedUser = JSON.parse(localStorage.getItem("userWithToken"));
const token = storedUser?.token;

const UserService = {
  updateSubscriptionType: async (userId, subscriptionType) => {
    try {
      const response = await axios.put(
        `${API_URL}/${userId}/subscription`, // Endpoint for updating subscription type
        { subscriptionType }, // Request body with the new subscription type
        {
          headers: {
            Authorization: `Bearer ${token}`, // Bearer token for authentication
          },
        }
      );
      return response.data; // Return the updated user data
    } catch (error) {
      console.error("Error updating subscription:", error);
      throw error; // Throw error to handle it further
    }
  },

  // Method to get user by ID
  getById: async (userId) => {
    try {
      console.log(token)
      const response = await axios.get(
        `${API_URL}/${userId}`, // Endpoint for fetching user by ID
        {
          headers: {
            Authorization: `Bearer ${token}`, // Bearer token for authentication
          },
        }
      );
      return response.data; // Return the user data
    } catch (error) {
      console.error("Error fetching user by ID:", error);
      throw error; // Throw error to handle it further
    }
  },

  // Method to update the role of a user
  updateRole: async (userId, role) => {
    try {
      const response = await axios.put(
        `${API_URL}/${userId}/role`, // Endpoint for updating user role
        { role }, // Request body with the new role
        {
          headers: {
            Authorization: `Bearer ${token}`, // Bearer token for authentication
          },
        }
      );
      console.log(role)
      return response.data; // Return the updated user data
    } catch (error) {
      console.error("Error updating user role:", error);
      throw error; // Throw error to handle it further
    }
  },
};

export default UserService;
