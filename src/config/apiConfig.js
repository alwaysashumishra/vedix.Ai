export const getApiBaseUrl = () => {
  const envBase = import.meta.env.VITE_API_BASE_URL;
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  // 1. Check browser / native window environment
  if (typeof window !== "undefined") {
    const hostname = window.location.hostname;

    // Detect if running inside Capacitor Mobile APK (Android / iOS app)
    const isCapacitorNative =
      !!window.Capacitor?.isNativePlatform?.() ||
      window.Capacitor?.platform === "android" ||
      window.Capacitor?.platform === "ios" ||
      (window.location.origin.includes("localhost") &&
        /Android|iPhone|iPad|iPod/i.test(navigator.userAgent));

    if (isCapacitorNative) {
      // In native mobile app / APK, use deployed live backend or env configuration
      if (envBase && !envBase.includes("localhost")) {
        return envBase.replace(/\/$/, "");
      }
      if (backendUrl && !backendUrl.includes("localhost")) {
        return `${backendUrl.replace(/\/$/, "")}/api`;
      }
      if (envBase && envBase.trim() !== "") {
        return envBase.replace(/\/$/, "");
      }
      return "http://127.0.0.1:5000/api";
    }

    // Mobile Browser accessing frontend via Laptop Wi-Fi / Hotspot LAN IP (e.g., http://192.168.x.x:5174)
    const isLanIp =
      hostname.startsWith("192.168.") ||
      hostname.startsWith("10.") ||
      hostname.startsWith("172.") ||
      hostname.endsWith(".local") ||
      (/^(\d{1,3}\.){3}\d{1,3}$/.test(hostname) && hostname !== "127.0.0.1");

    if (isLanIp) {
      if (envBase && envBase.includes("localhost")) {
        return envBase.replace("localhost", hostname).replace(/\/$/, "");
      }
      if (backendUrl && backendUrl.includes("localhost")) {
        return `${backendUrl.replace("localhost", hostname).replace(/\/$/, "")}/api`;
      }
      return `http://${hostname}:5000/api`;
    }

    // Localhost desktop development (http://localhost:5174)
    if (hostname === "localhost" || hostname === "127.0.0.1") {
      if (envBase && envBase.trim() !== "") {
        return envBase.replace("localhost", "127.0.0.1").replace(/\/$/, "");
      }
      return "http://127.0.0.1:5000/api";
    }
  }

  // 2. Production / Deployed environment (Vercel, Netlify, Railway)
  if (envBase && !envBase.includes("localhost")) {
    return envBase.replace(/\/$/, "");
  }

  if (backendUrl && !backendUrl.includes("localhost")) {
    return `${backendUrl.replace(/\/$/, "")}/api`;
  }

  return "http://127.0.0.1:5000/api";
};

export const API_BASE = getApiBaseUrl();
