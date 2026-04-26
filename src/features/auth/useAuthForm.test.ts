// src/features/auth/useAuthForm.ts
import { useState } from "react";
import { authApi } from "../../api/auth.api";
import { LoginRequest } from "../../types/user.types";
import { useToast } from "../../hooks/use-toast"; // Vu que tu utilises shadcn/ui
import axios from "axios";

export const useAuthForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleLogin = async (credentials: LoginRequest) => {
    setIsLoading(true);
    try {
      const response = await authApi.login(credentials);

      // Sauvegarder le token (tu peux aussi utiliser ton UserContext ici)
      localStorage.setItem("token", response.token);

      toast({
        title: "Connexion réussie",
        description: "Bienvenue sur votre espace.",
      });

      return response;
    } catch (error: unknown) {
      let errorMessage = "Une erreur est survenue";

      // Si c'est une erreur qui vient d'Axios (donc de ton API)
      if (axios.isAxiosError(error)) {
        // TypeScript comprend automatiquement ici que "error" a une propriété .response
        errorMessage = error.response?.data?.message || errorMessage;
      }
      // Si c'est une erreur classique du navigateur ou de JS
      else if (error instanceof Error) {
        errorMessage = error.message;
      }

      toast({
        title: "Erreur de connexion",
        description: errorMessage,
        variant: "destructive",
      });

      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Tu peux ajouter handleRegister et handleVerifyEmail de la même façon

  return { handleLogin, isLoading };
};
