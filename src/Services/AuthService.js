import axios from 'axios';

const API_URL = 'http://localhost:8181/api/auth'//djust the URL if needed

const AuthService = {
  async login(email, password) {
    const response = await axios.post(`${API_URL}/login`, {
  email: email,
  password: password,
}, {
  headers: {
    'Content-Type': 'application/json',
  },
})
;
    return response.data;
  },

  signup: async (userData) => {
    const response = await axios.post(`${API_URL}/signup`, userData);
    return response.data;
  },

  logout: () => {
    localStorage.removeItem('user');
  },

  getCurrentUser: () => {
    return JSON.parse(localStorage.getItem('user'));
  }
};

export default AuthService;
