import axios from "axios";
import { API_BASE } from "./apiConfig";

const CONFIG_API = `${API_BASE}/admin/public-config`;

export const getPublicConfig = async () => {
  const response = await axios.get(CONFIG_API);
  return response.data.config || {};
};
