import axios from 'axios';
const API_URL = 'http://localhost:8081/api/users'; // Adjust the URL if needed

const UserService = {
  updateSubscriptionType : async (userId, subscriptionType) => {
    try {
      const storedUser = JSON.parse(localStorage.getItem("user"));
      const token = storedUser?.token;
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
  }
};

export default UserService;