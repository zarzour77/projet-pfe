import axios from 'axios';

const API_URL = '/api/notifications';

const getTokenConfig = () => {
  const token = localStorage.getItem('token');
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

const getNotifications = async (userId) => {
  const config = getTokenConfig();
  const response = await axios.get(`${API_URL}/${userId}`, config);
  return response.data;
};

const markAsRead = async (notificationId) => {
  const config = getTokenConfig();
  const response = await axios.put(`${API_URL}/${notificationId}/read`, {}, config);
  return response.data;
};

const deleteNotification = async (notificationId) => {
  const config = getTokenConfig();
  const response = await axios.delete(`${API_URL}/${notificationId}`, config);
  return response.data;
};

export default {
  getNotifications,
  markAsRead,
  deleteNotification,
};
