import axios from "axios";
import { useState } from "react";
import { authApi } from "@/api/auth.api";
import type {
  AuthResponse,
  LoginRequest,
  RegisterRequest,
  VerifyEmailRequest,
} from "@/types/user.types";
import { useToast } from "@/hooks/use-toast";

interface AuthValues {
  nom: string;
  prenom: string;
  email: string;
  password: string;
  telephone: string;
}

interface UseAuthFormReturn {
  values: AuthValues;
  error: string;
  isLoading: boolean;
  setEmail: (value: string) => void;
  setPassword: (value: string) => void;
  setNom: (value: string) => void;
  setPrenom: (value: string) => void;
  setTelephone: (value: string) => void;
  setError: (value: string) => void;
  reset: () => void;
  submitLogin: (credentials: LoginRequest) => Promise<AuthResponse>;
  submitRegister: (payload: RegisterRequest) => Promise<void>;
  submitVerifyEmail: (payload: VerifyEmailRequest) => Promise<void>;
}

const getErrorMessage = (error: unknown): string => {
  if (axios.isAxiosError(error)) {
    const apiMessage =
      (error.response?.data as { message?: string } | undefined)?.message ?? error.message;
    return apiMessage || "Une erreur est survenue";
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "Une erreur est survenue";
};

export const useAuthForm = (): UseAuthFormReturn => {
  const [values, setValues] = useState<AuthValues>({
    nom: "",
    prenom: "",
    email: "",
    password: "",
    telephone: "",
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const setEmail = (email: string) => {
    setValues((prev) => ({ ...prev, email }));
  };

  const setPassword = (password: string) => {
    setValues((prev) => ({ ...prev, password }));
  };

  const setNom = (nom: string) => {
    setValues((prev) => ({ ...prev, nom }));
  };

  const setPrenom = (prenom: string) => {
    setValues((prev) => ({ ...prev, prenom }));
  };

  const setTelephone = (telephone: string) => {
    setValues((prev) => ({ ...prev, telephone }));
  };

  const reset = () => {
    setValues({ nom: "", prenom: "", email: "", password: "", telephone: "" });
    setError("");
  };

  const submitLogin = async (credentials: LoginRequest): Promise<AuthResponse> => {
    setIsLoading(true);
    setError("");

    try {
      const response = await authApi.login(credentials);
      toast({
        title: "Connexion reussie",
        description: response.message ?? "Bienvenue sur votre espace.",
      });
      return response;
    } catch (err) {
      const message = getErrorMessage(err);
      setError(message);
      toast({
        title: "Erreur de connexion",
        description: message,
        variant: "destructive",
      });
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const submitRegister = async (payload: RegisterRequest): Promise<void> => {
    setIsLoading(true);
    setError("");

    try {
      const response = await authApi.register(payload);
      toast({
        title: "Inscription envoyee",
        description: response.message ?? "Verifiez votre email pour valider votre compte.",
      });
    } catch (err) {
      const message = getErrorMessage(err);
      setError(message);
      toast({
        title: "Erreur d'inscription",
        description: message,
        variant: "destructive",
      });
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const submitVerifyEmail = async (payload: VerifyEmailRequest): Promise<void> => {
    setIsLoading(true);
    setError("");

    try {
      const response = await authApi.verifyEmail(payload);
      toast({
        title: "Email verifie",
        description: response.message ?? "Votre adresse email a ete verifiee.",
      });
    } catch (err) {
      const message = getErrorMessage(err);
      setError(message);
      toast({
        title: "Erreur de verification",
        description: message,
        variant: "destructive",
      });
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    values,
    error,
    isLoading,
    setEmail,
    setPassword,
    setNom,
    setPrenom,
    setTelephone,
    setError,
    reset,
    submitLogin,
    submitRegister,
    submitVerifyEmail,
  };
};
