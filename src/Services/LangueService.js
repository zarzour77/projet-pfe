import axios from 'axios';

// Base API URL for Langues
const API_URL = 'http://localhost:8181/api/langues';

// Function to get all Langues
const getAllLangues = async () => {
  const token = localStorage.getItem("token");

  try {
    const response = await axios.get(API_URL, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // Add token to header
      },
    });
    return response.data; // Return the fetched langues
  } catch (error) {
    console.error("Error fetching langues:", error);
    throw error; // Propagate the error to be handled elsewhere
  }
};


// Export the service functions
export default {
  getAllLangues,
};
