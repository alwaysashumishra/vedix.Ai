export const getApiBaseUrl = () => {
  const envBase = import.meta.env.VITE_API_BASE_URL;
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  // 1. Check browser environment
  if (typeof window !== "undefined") {
    const hostname = window.location.hostname;

    // Local development (localhost, loopback, or LAN IP)
    const isLocalhost =
      hostname === "localhost" ||
      hostname === "127.0.0.1" ||
      hostname.startsWith("192.168.") ||
      hostname.startsWith("10.") ||
      hostname.endsWith(".local");

    if (isLocalhost) {
      if (envBase && envBase.trim() !== "") {
        if (envBase.includes("localhost") && hostname !== "localhost" && hostname !== "127.0.0.1") {
          return envBase.replace("localhost", hostname).replace(/\/$/, "");
        }
        return envBase.replace(/\/$/, "");
      }
      return `http://${hostname}:5000/api`;
    }
  }

  // 2. Production / Deployed environment
  if (envBase && !envBase.includes("localhost")) {
    return envBase.replace(/\/$/, "");
  }

  // Use VITE_BACKEND_URL if set and valid (ignoring dead placeholder URLs)
  if (
    backendUrl &&
    !backendUrl.includes("localhost") &&
    !backendUrl.includes("web-production-f9e16.up.railway.app")
  ) {
    return `${backendUrl.replace(/\/$/, "")}/api`;
  }

  return "http://localhost:5000/api";
};

export const API_BASE = getApiBaseUrl();



