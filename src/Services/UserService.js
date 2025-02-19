import axios from 'axios';

const API_URL = 'http://localhost:8181/api/users';
const storedUser = JSON.parse(localStorage.getItem("userWithToken"));
const token = storedUser?.token;
console.log(token)

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
  updateUserRole: async (userId, role) => {
    console.log(role)
    console.log(token)
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
  updateUser: async (userId, updatedData) => {
    try {
      const response = await axios.put(
        `${API_URL}/${userId}`, // Endpoint for updating the user
        updatedData, // Request body with the fields to update
        {
          headers: {
            Authorization: `Bearer ${token}`, // Bearer token for authentication
          },
        }
      );
      return response.data; // Return the updated user data
    } catch (error) {
      console.error("Error updating user:", error);
      throw error; // Throw error to handle it further
    }
  },
  // New function: update the user's profile picture
  updateProfilePicture: async (userId, file) => {
    try {
      const response = await axios.put(
        `${API_URL}/${userId}/uploadProfilePic`, // Endpoint for updating profile picture
        file, // Pass the file (raw binary data)
        {
          headers: {
            Authorization: `Bearer ${token}`, // Bearer token for authentication
            'Content-Type': 'application/octet-stream', // Content type for raw binary data
          },
        }
      );
      return response.data; // Return the response message
    } catch (error) {
      console.error("Error updating profile picture:", error);
      throw error;
    }
  },
};

export default UserService;
