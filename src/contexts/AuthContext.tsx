import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { authApi } from "@/api/auth.api";
import { setAuthAccessToken } from "@/api/axiosInstance";
import type { AuthResponse, LoginRequest, RegisterRequest } from "@/types/user.types";
import { useToast } from "@/hooks/use-toast";

const AUTH_TOKEN_KEY = "authToken";
const AUTH_EMAIL_KEY = "authEmail";

interface AuthContextType {
  accessToken: string | null;
  email: string | null;
  isAuthenticated: boolean;
  isBootstrapping: boolean;
  login: (email: string, password: string) => Promise<AuthResponse>;
  logout: () => void;
  register: (data: RegisterRequest) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [accessToken, setAccessToken] = useState<string | null>(() =>
    localStorage.getItem(AUTH_TOKEN_KEY),
  );
  const [email, setEmail] = useState<string | null>(() => localStorage.getItem(AUTH_EMAIL_KEY));
  const [isBootstrapping, setIsBootstrapping] = useState(true);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const clearAuthState = useCallback(() => {
    setAccessToken(null);
    setEmail(null);
    setAuthAccessToken(null);
    localStorage.removeItem(AUTH_EMAIL_KEY);
    localStorage.removeItem(AUTH_TOKEN_KEY);
  }, []);

  const loginMutation = useMutation<AuthResponse, Error, LoginRequest>({
    mutationFn: authApi.login,
    onSuccess: (response, variables) => {
      setAccessToken(response.token);
      setEmail(variables.email);
      setAuthAccessToken(response.token);
      localStorage.setItem(AUTH_TOKEN_KEY, response.token);
      localStorage.setItem(AUTH_EMAIL_KEY, variables.email);

      // Dispatch login event for other components
      window.dispatchEvent(
        new CustomEvent("auth:login", {
          detail: { token: response.token, user: null },
        }),
      );

      toast({
        title: "Connexion réussie",
        description: "Bienvenue sur votre espace.",
      });
    },
    onError: (error) => {
      toast({
        title: "Erreur de connexion",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const login = useCallback(
    async (userEmail: string, password: string): Promise<AuthResponse> => {
      const response = await loginMutation.mutateAsync({
        email: userEmail,
        password,
      });

      return response;
    },
    [loginMutation],
  );

  const logout = useCallback(async () => {
    clearAuthState();
    queryClient.clear();
    window.location.assign("/login");
  }, [clearAuthState, queryClient]);

  const registerMutation = useMutation<unknown, Error, RegisterRequest>({
    mutationFn: authApi.register,
    onSuccess: (response) => {
      toast({
        title: "Inscription réussie",
        description:
          (response as { message?: string })?.message ??
          "Vérifiez votre email pour valider votre compte.",
      });
    },
    onError: (error) => {
      toast({
        title: "Erreur d'inscription",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const register = useCallback(
    async (data: RegisterRequest): Promise<void> => {
      await registerMutation.mutateAsync(data);
    },
    [registerMutation],
  );

  // Bootstrap auth on mount
  useEffect(() => {
    let isMounted = true;

    const bootstrapAuth = () => {
      const storedToken = localStorage.getItem(AUTH_TOKEN_KEY);
      const storedEmail = localStorage.getItem(AUTH_EMAIL_KEY);

      // If we have a token, use it directly
      if (storedToken) {
        setAccessToken(storedToken);
        setAuthAccessToken(storedToken);
        if (storedEmail) {
          setEmail(storedEmail);
        }
      }

      if (isMounted) {
        setIsBootstrapping(false);
      }
    };

    bootstrapAuth();

    return () => {
      isMounted = false;
    };
  }, []);

  // Listen for unauthorized events from axios interceptor
  useEffect(() => {
    const onUnauthorized = () => {
      clearAuthState();
      window.location.assign("/login");
    };

    window.addEventListener("unauthorized", onUnauthorized);

    return () => {
      window.removeEventListener("unauthorized", onUnauthorized);
    };
  }, [clearAuthState]);

  const value = useMemo(
    () => ({
      accessToken,
      email,
      isAuthenticated: Boolean(accessToken),
      isBootstrapping,
      login,
      logout,
      register,
    }),
    [accessToken, email, isBootstrapping, login, logout, register],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
};
