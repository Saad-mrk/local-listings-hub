// src/types/user.types.ts

export interface User {
  id: string;
  email: string;
  name: string;
  verified?: boolean;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  nom: string;
  prenom: string;
  email: string;
  password: string;
  telephone: string;
}

export interface VerifyEmailRequest {
  email: string;
  code: string;
}

export interface ApiMessageResponse {
  message: string;
}

export interface AuthResponse {
  token: string;
  user?: User;
  message?: string;
}
