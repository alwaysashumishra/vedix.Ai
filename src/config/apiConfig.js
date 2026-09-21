export const getApiBaseUrl = () => {
  const envBase = import.meta.env.VITE_API_BASE_URL;
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  // 1. Check browser environment
  if (typeof window !== "undefined") {
    const hostname = window.location.hostname;

    // Local development & LAN IP check (localhost, Wi-Fi 192.168.x, 10.x, Hotspot 172.x, or LAN IP)
    const isLocalNetwork =
      hostname === "localhost" ||
      hostname === "127.0.0.1" ||
      hostname.startsWith("192.168.") ||
      hostname.startsWith("10.") ||
      hostname.startsWith("172.") ||
      hostname.endsWith(".local") ||
      /^(\d{1,3}\.){3}\d{1,3}$/.test(hostname);

    if (isLocalNetwork) {
      if (hostname !== "localhost" && hostname !== "127.0.0.1") {
        // When opening frontend from a mobile phone via laptop IP
        if (envBase && envBase.includes("localhost")) {
          return envBase.replace("localhost", hostname).replace(/\/$/, "");
        }
        if (backendUrl && backendUrl.includes("localhost")) {
          return `${backendUrl.replace("localhost", hostname).replace(/\/$/, "")}/api`;
        }
        return `http://${hostname}:5000/api`;
      }

      if (envBase && envBase.trim() !== "") {
        return envBase.replace("localhost", "127.0.0.1").replace(/\/$/, "");
      }
      return `http://127.0.0.1:5000/api`;
    }
  }

  // 2. Production / Deployed environment
  if (envBase && !envBase.includes("localhost")) {
    return envBase.replace(/\/$/, "");
  }

  // Use VITE_BACKEND_URL if set and valid
  if (
    backendUrl &&
    !backendUrl.includes("localhost") &&
    !backendUrl.includes("web-production-f9e16.up.railway.app")
  ) {
    return `${backendUrl.replace(/\/$/, "")}/api`;
  }

  return "http://127.0.0.1:5000/api";
};

export const API_BASE = getApiBaseUrl();
