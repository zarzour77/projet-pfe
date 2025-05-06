import axios from 'axios';

const API_URL = 'http://localhost:8181/api/disputes'; // Adjust this URL as needed

export const getAllDisputes = async () => {
  const token = localStorage.getItem("token");
  try {
    const response = await axios.get(`${API_URL}/all`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Erreur lors de la récupération de tous les litiges :", error);
    throw error;
  }
};

export const updateDisputeStatus = async (id, status) => {
  const token = localStorage.getItem("token");
  try {
    const response = await axios.put(
      `${API_URL}/${id}/status`,
      { status },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Erreur lors de la mise à jour du statut :", error);
    throw error;
  }
};

export const updateAdminResponse = async (id, adminResponse, status) => {
  const token = localStorage.getItem("token");
  try {
    const response = await axios.put(
      `${API_URL}/${id}/response`,
      { adminResponse, status },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Erreur lors de la mise à jour de la réponse admin :", error);
    throw error;
  }
};

export const transferFunds = async (transferData) => {
  const token = localStorage.getItem("token");
  console.log(transferData)
  try {
    const response = await axios.post(
      `http://localhost:8181/api/payments/disputes/resolve`,
      {
        disputeId: transferData.disputeId,
        amount: transferData.amount,
        payerId: transferData.payerId,
        payeeId: transferData.payeeId,
        payerType: transferData.payerType
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Transfer error:", error.response?.data || error.message);
    throw error;
  }
};

export const getFrozenBalance = async (enterpriseId) => {
  const token = localStorage.getItem("token");
  try {
    const response = await axios.get(
      `${API_URL}/api/payments/disputes/frozen-balance/${enterpriseId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data.frozenBalance;
  } catch (error) {
    console.error("Error fetching frozen balance:", error);
    throw error;
  }
};

export default {
  getAllDisputes,
  updateDisputeStatus,
  updateAdminResponse,
  transferFunds,
  getFrozenBalance,
};
