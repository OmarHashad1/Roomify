import axios from "axios";
import { toast } from "sonner";

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || "").replace(
  /\/+$/,
  "",
);
const buildApiUrl = (path) => {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return API_BASE_URL ? `${API_BASE_URL}${normalizedPath}` : normalizedPath;
};

export const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

let refreshTokenRequest = null;
let hasHandledInvalidSession = false;

function handleInvalidSessionRedirect() {
  if (hasHandledInvalidSession) return;

  hasHandledInvalidSession = true;
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");

  if (!["/login", "/register"].includes(window.location.pathname)) {
    toast.error("Invalid login session, please login again");
    window.location.href = "/login";
  }
}

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  config.headers = config.headers || {};
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config;
    const isAuthPage = ["/login", "/register"].includes(
      window.location.pathname,
    );

    if (error.response?.status === 401 && !original?._retry) {
      const refreshToken = localStorage.getItem("refreshToken");

      if (refreshToken) {
        try {
          original._retry = true;

          if (!refreshTokenRequest) {
            refreshTokenRequest = axios.get(
              `${import.meta.env.VITE_API_BASE_URL}/auth/access-token`,
              { headers: { Authorization: `Bearer ${refreshToken}` } },
            );
          }

          const { data } = await refreshTokenRequest;
          const newToken = data.data.accessToken;
          localStorage.setItem("accessToken", newToken);
          original.headers = original.headers || {};
          original.headers.Authorization = `Bearer ${newToken}`;

          refreshTokenRequest = null;
          hasHandledInvalidSession = false;

          return api(original);
        } catch {
          refreshTokenRequest = null;
          if (!isAuthPage) handleInvalidSessionRedirect();
          return Promise.reject(error);
        }
      }

      if (!isAuthPage) handleInvalidSessionRedirect();
    }

    return Promise.reject(error);
  },
);

export default api;
