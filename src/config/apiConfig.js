export const getApiBaseUrl = () => {
  const envBase = import.meta.env.VITE_API_BASE_URL;
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  // If envBase is set and not pointing to localhost, use it
  if (envBase && !envBase.includes("localhost")) {
    return envBase.replace(/\/$/, "");
  }
  // If backendUrl is set (e.g. Railway deployment), use it
  if (backendUrl) {
    return `${backendUrl.replace(/\/$/, "")}/api`;
  }
  // Fallback to envBase or default localhost
  if (envBase) {
    return envBase.replace(/\/$/, "");
  }
  return "http://localhost:5000/api";
};

export const API_BASE = getApiBaseUrl();

