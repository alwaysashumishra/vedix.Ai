import axios from "axios";

const API_BASE =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

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
