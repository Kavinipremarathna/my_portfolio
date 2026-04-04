const getDefaultApiUrl = () => {
  // In local development we proxy /api through Vite, so keep API same-origin.
  return "";
};

const API_BASE_URL = import.meta.env.VITE_API_URL?.trim() || getDefaultApiUrl();

export const API_URL = API_BASE_URL.replace(/\/$/, "");
