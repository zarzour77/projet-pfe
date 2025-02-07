// src/services/UserService.js
import axios from 'axios';
const API_URL = 'http://localhost:8181/api/users';
// Define the token
const TOKEN = 'eyJhbGciOiJIUzM4NCJ9.eyJzdWIiOiJhYWJiIiwiaWF0IjoxNzM4ODY4MjY1LCJleHAiOjE3Mzg5NTQ2NjV9.l2dM5pQ5f9u4cdcXgzsfeQfth-ehFnLlfPxq8C11RHigInkuKFMBDUa0RzBwJmH3';
const getUserById = async () => {
  try {
    // Add the Authorization header to the request
    const response = await axios.get(`${API_URL}/17`, {
      headers: {
        Authorization: `Bearer ${TOKEN}`, // Bearer token added here
      },
    });
    return response.data; // Return the user data
  } catch (error) {
    console.error('Error fetching user:', error);
    throw error; // Throw the error for further handling if needed
  }
};

export default {
  getUserById,
};
