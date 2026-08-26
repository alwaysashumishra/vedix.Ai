import axios from "axios";
import { API_BASE } from "./apiConfig";

const API = `${API_BASE}/auth`;

export const registerUser = async (userData) => {
  const response = await axios.post(`${API}/register`, userData);
  return response.data;
};

export const loginUser = async (userData) => {
  const response = await axios.post(`${API}/login`, userData);
  return response.data;
};

export const googleAuthUser = async (credential) => {
  const response = await axios.post(`${API}/google`, { credential });
  return response.data;
};

export const resetPasswordUser = async (data) => {
  const response = await axios.post(`${API}/reset-password`, data);
  return response.data;
};

export const updateProfileUser = async (data) => {
  const response = await axios.put(`${API}/update-profile`, data);
  return response.data;
};
