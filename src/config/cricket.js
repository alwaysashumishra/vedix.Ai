import axios from "axios";
import { API_BASE } from "./apiConfig";

export const fetchLiveMatches = async (lang = "en") => {
  const response = await axios.get(`${API_BASE}/cricket/matches?lang=${lang}`);
  return response.data;
};
