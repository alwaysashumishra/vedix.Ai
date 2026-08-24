export const getApiBaseUrl = () => {
  const envBase = import.meta.env.VITE_API_BASE_URL;
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  // 1. If running locally on laptop (localhost / 127.0.0.1)
  if (
    typeof window !== "undefined" &&
    (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1")
  ) {
    return envBase || "http://localhost:5000/api";
  }

  // 2. If running on Vercel / Production (Mobile browser or live web)
  if (envBase && !envBase.includes("localhost")) {
    return envBase.replace(/\/$/, "");
  }
  if (backendUrl && !backendUrl.includes("localhost")) {
    return `${backendUrl.replace(/\/$/, "")}/api`;
  }

  return "http://localhost:5000/api";
};

export const API_BASE = getApiBaseUrl();


