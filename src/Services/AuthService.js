import axios from 'axios';

const API_URL = 'http://localhost:8081/api/auth'; // Ajustez l'URL si besoin

const AuthService = {
  async login(email, password) {
    const response = await axios.post(`${API_URL}/login`, {
      email: email,
      password: password,
    }, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  },

  signup: async (userData) => {
    const response = await axios.post(`${API_URL}/signup`, userData);
    return response.data;
  },

  // Nouvelle méthode pour vérifier le code de validation de l'email
  async verifyEmail(email, code) {
    const response = await axios.post(`${API_URL}/verify-email`, null, {
      params: { email, code },
      headers: {
        'Content-Type': 'application/json',
      },
    });
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
