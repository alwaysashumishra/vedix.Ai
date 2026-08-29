import axios from "axios";
import { API_BASE } from "./apiConfig";

const ADMIN_API = `${API_BASE}/admin`;
const PAYMENTS_API = `${API_BASE}/payments`;

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const getAdminSummary = async () => {
  const response = await axios.get(`${ADMIN_API}/summary`, {
    headers: getAuthHeaders(),
  });
  return response.data;
};

export const getAdminUsers = async (params = {}) => {
  const query = new URLSearchParams(params).toString();
  const response = await axios.get(`${ADMIN_API}/users${query ? `?${query}` : ""}`, {
    headers: getAuthHeaders(),
  });
  return response.data;
};

export const deleteAdminUser = async (userId) => {
  const response = await axios.delete(`${ADMIN_API}/users/${userId}`, {
    headers: getAuthHeaders(),
  });
  return response.data;
};

export const getAdminConfig = async () => {
  const response = await axios.get(`${ADMIN_API}/config`, {
    headers: getAuthHeaders(),
  });
  return response.data;
};

export const updateAdminConfig = async (config) => {
  const response = await axios.put(`${ADMIN_API}/config`, config, {
    headers: getAuthHeaders(),
  });
  return response.data;
};

export const updateAdminUser = async (userId, updates) => {
  const response = await axios.patch(`${ADMIN_API}/users/${userId}`, updates, {
    headers: getAuthHeaders(),
  });
  return response.data;
};

export const getServerStatus = async () => {
  const response = await axios.get(`${ADMIN_API}/server/status`, {
    headers: getAuthHeaders(),
  });
  return response.data;
};

export const clearServerCache = async () => {
  const response = await axios.post(`${ADMIN_API}/server/clear-cache`, {}, {
    headers: getAuthHeaders(),
  });
  return response.data;
};

export const restartServer = async () => {
  const response = await axios.post(`${ADMIN_API}/server/restart`, {}, {
    headers: getAuthHeaders(),
  });
  return response.data;
};

export const getAdminPayments = async (status = "") => {
  const response = await axios.get(`${PAYMENTS_API}/admin/all${status ? `?status=${status}` : ""}`, {
    headers: getAuthHeaders(),
  });
  return response.data;
};

export const updateAdminPaymentStatus = async (paymentId, updates) => {
  const response = await axios.patch(`${PAYMENTS_API}/admin/${paymentId}`, updates, {
    headers: getAuthHeaders(),
  });
  return response.data;
};
