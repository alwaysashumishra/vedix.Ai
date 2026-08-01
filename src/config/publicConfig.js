import axios from "axios";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";
const CONFIG_API = `${API_BASE}/admin/public-config`;

export const getPublicConfig = async () => {
  const response = await axios.get(CONFIG_API);
  return response.data.config || {};
};
