import axios from "axios";

const API_BASE =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

export const fetchNewsFeed = async () => {
  const response = await axios.get(`${API_BASE}/news`);
  return response.data;
};
