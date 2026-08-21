import axios from "axios";
import { API_BASE } from "./apiConfig";

export const fetchNewsFeed = async () => {
  const response = await axios.get(`${API_BASE}/news`);
  return response.data;
};
