export const getApiBaseUrl = () => {
  const envBase = import.meta.env.VITE_API_BASE_URL;
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  if (envBase) {
    return envBase.replace(/\/$/, "");
  }
  if (backendUrl) {
    return `${backendUrl.replace(/\/$/, "")}/api`;
  }
  return "http://localhost:5000/api";
};

export const API_BASE = getApiBaseUrl();
