import axios from "axios";

const API_BASE_URL = "https://localhost:7111";
const REFRESH_TOKEN_KEY = "refreshToken";
const AUTH_EMAIL_KEY = "authEmail";

let accessToken = null;
let isRefreshing = false;
let refreshQueue = [];

const processRefreshQueue = (error, token = null) => {
  refreshQueue.forEach(({ resolve, reject }) => {
    if (error) {
      reject(error);
    } else {
      resolve(token);
    }
  });

  refreshQueue = [];
};

export const setAuthAccessToken = (token) => {
  accessToken = token;
};

export const getAuthAccessToken = () => accessToken;

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

axiosInstance.interceptors.request.use((config) => {
  if (accessToken) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${accessToken}`;
  }

  return config;
});

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error?.config;
    const status = error?.response?.status;
    const requestUrl = originalRequest?.url ?? "";
    const isAuthEndpoint =
      requestUrl.includes("/api/Auth/login") ||
      requestUrl.includes("/api/Auth/refresh") ||
      requestUrl.includes("/api/Auth/logout");

    if (status !== 401 || !originalRequest || originalRequest._retry || isAuthEndpoint) {
      return Promise.reject(error);
    }

    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        refreshQueue.push({ resolve, reject });
      })
        .then((token) => {
          originalRequest.headers = originalRequest.headers ?? {};
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return axiosInstance(originalRequest);
        })
        .catch((queueError) => Promise.reject(queueError));
    }

    originalRequest._retry = true;
    isRefreshing = true;

    const storedRefreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);
    const storedEmail = localStorage.getItem(AUTH_EMAIL_KEY);

    if (!storedRefreshToken || !storedEmail) {
      setAuthAccessToken(null);
      localStorage.removeItem(REFRESH_TOKEN_KEY);
      localStorage.removeItem(AUTH_EMAIL_KEY);
      window.dispatchEvent(new Event("unauthorized"));
      isRefreshing = false;
      return Promise.reject(error);
    }

    try {
      const refreshResponse = await axios.post(
        `${API_BASE_URL}/api/Auth/refresh`,
        {
          refreshToken: storedRefreshToken,
          email: storedEmail,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      const refreshedData = refreshResponse?.data?.data;

      if (!refreshedData?.accessToken || !refreshedData?.refreshToken) {
        throw new Error("Invalid refresh token response format");
      }

      setAuthAccessToken(refreshedData.accessToken);
      localStorage.setItem(REFRESH_TOKEN_KEY, refreshedData.refreshToken);
      localStorage.setItem(AUTH_EMAIL_KEY, storedEmail);

      processRefreshQueue(null, refreshedData.accessToken);

      originalRequest.headers = originalRequest.headers ?? {};
      originalRequest.headers.Authorization = `Bearer ${refreshedData.accessToken}`;

      return axiosInstance(originalRequest);
    } catch (refreshError) {
      processRefreshQueue(refreshError, null);
      setAuthAccessToken(null);
      localStorage.removeItem(REFRESH_TOKEN_KEY);
      localStorage.removeItem(AUTH_EMAIL_KEY);
      window.dispatchEvent(new Event("unauthorized"));
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  },
);

export default axiosInstance;
