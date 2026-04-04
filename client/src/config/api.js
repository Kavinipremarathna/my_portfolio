const getDefaultApiUrl = () => {
  if (typeof window === "undefined") {
    return "http://localhost:5000";
  }

  const { protocol, hostname } = window.location;

  if (hostname === "localhost" || hostname === "127.0.0.1") {
    return `${protocol}//localhost:5000`;
  }

  return `${protocol}//${hostname}:5000`;
};

const API_BASE_URL = import.meta.env.VITE_API_URL?.trim() || getDefaultApiUrl();

export const API_URL = API_BASE_URL.replace(/\/$/, "");
