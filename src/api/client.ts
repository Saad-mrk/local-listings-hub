// src/api/client.ts
import axios from "axios";
import { env } from "../config/env";
import { STORAGE_KEYS } from "../config/constants";

export const apiClient = axios.create({
  baseURL: env.apiUrl || "https://localhost:7111",
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem(STORAGE_KEYS.TOKEN);
  if (token) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error?.response?.status === 401 && typeof window !== "undefined") {
      window.dispatchEvent(new Event("unauthorized"));
    }

    return Promise.reject(error);
  },
);
