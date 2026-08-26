import axios from "axios";
import { API_BASE } from "./apiConfig";

export const fetchNewsFeed = async (lang = "en") => {
  const response = await axios.get(`${API_BASE}/news?lang=${lang}`);
  return response.data;
};
