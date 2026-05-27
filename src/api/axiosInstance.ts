import axios, { AxiosError, InternalAxiosRequestConfig, AxiosResponse } from "axios";

const API_BASE_URL = "https://localhost:7111";
const REFRESH_TOKEN_KEY = "refreshToken";
const AUTH_EMAIL_KEY = "authEmail";

interface RefreshTokenData {
  accessToken: string;
  refreshToken: string;
}

interface RefreshTokenResponse {
  data: {
    data: RefreshTokenData;
  };
}

interface QueuedRequest {
  resolve: (token: string) => void;
  reject: (error: unknown) => void;
}

let accessToken: string | null = null;
let isRefreshing = false;
let refreshQueue: QueuedRequest[] = [];

const processRefreshQueue = (error: unknown = null, token: string | null = null): void => {
  refreshQueue.forEach(({ resolve, reject }) => {
    if (error) {
      reject(error);
    } else if (token) {
      resolve(token);
    }
  });

  refreshQueue = [];
};

export const setAuthAccessToken = (token: string | null): void => {
  accessToken = token;
};

export const getAuthAccessToken = (): string | null => accessToken;

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    if (accessToken) {
      config.headers = config.headers ?? {};
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    return config;
  },
  (error: AxiosError) => Promise.reject(error),
);

axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError) => {
    const originalRequest = error?.config as InternalAxiosRequestConfig & { _retry?: boolean };
    const status = error?.response?.status;
    const requestUrl = originalRequest?.url ?? "";

    // Skip refresh for auth endpoints
    const isAuthEndpoint =
      requestUrl.includes("/api/Auth/login") ||
      requestUrl.includes("/api/Auth/refresh") ||
      requestUrl.includes("/api/Auth/logout") ||
      requestUrl.includes("/api/Auth/register");

    if (status !== 401 || !originalRequest || originalRequest._retry || isAuthEndpoint) {
      return Promise.reject(error);
    }

    // If already refreshing, queue this request
    if (isRefreshing) {
      return new Promise<string>((resolve, reject) => {
        refreshQueue.push({ resolve, reject });
      })
        .then((token: string) => {
          originalRequest.headers = originalRequest.headers ?? {};
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return axiosInstance(originalRequest);
        })
        .catch(() => Promise.reject(error));
    }

    // Check if we have a refresh token
    const storedRefreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);
    const storedEmail = localStorage.getItem(AUTH_EMAIL_KEY);

    // If no refresh token, just reject (will trigger logout)
    if (!storedRefreshToken || !storedEmail) {
      setAuthAccessToken(null);
      window.dispatchEvent(new Event("unauthorized"));
      return Promise.reject(error);
    }

    originalRequest._retry = true;
    isRefreshing = true;

    try {
      const response = await axios.post<RefreshTokenResponse>(
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

      const envelope = response.data as unknown;
      const innerData = (envelope as { data?: { data?: RefreshTokenData } }).data?.data;

      if (!innerData?.accessToken || !innerData?.refreshToken) {
        throw new Error("Invalid refresh token response format");
      }

      setAuthAccessToken(innerData.accessToken);
      localStorage.setItem(REFRESH_TOKEN_KEY, innerData.refreshToken);

      // Process queued requests
      processRefreshQueue(null, innerData.accessToken);

      // Retry original request
      originalRequest.headers = originalRequest.headers ?? {};
      originalRequest.headers.Authorization = `Bearer ${innerData.accessToken}`;

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
