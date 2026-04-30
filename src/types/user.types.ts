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

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  errors: string[];
  timestamp: string;
}

export interface UserProfile {
  id: number;
  email: string;
  nom: string;
  prenom: string;
  telephone: string;
  role: string;
  estActif: boolean;
  dateInscription: string;
  derniereConnexion: string | null;
  isVerified: boolean;
}
