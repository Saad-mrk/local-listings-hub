// src/api/auth.api.ts
import { apiClient } from "./client";
import {
  LoginRequest,
  RegisterRequest,
  VerifyEmailRequest,
  AuthResponse,
  ApiMessageResponse,
} from "../types/user.types";

export const authApi = {
  login: async (data: LoginRequest): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>("/api/Auth/login", data);
    return response.data;
  },

  register: async (data: RegisterRequest): Promise<ApiMessageResponse> => {
    const response = await apiClient.post<ApiMessageResponse>("/api/Auth/register", data);
    return response.data;
  },

  verifyEmail: async (data: VerifyEmailRequest): Promise<ApiMessageResponse> => {
    const response = await apiClient.post<ApiMessageResponse>("/api/Auth/verify-email", null, {
      params: data,
    });
    return response.data;
  },
};
