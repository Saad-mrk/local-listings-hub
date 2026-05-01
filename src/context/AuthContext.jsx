import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import * as authService from "@/services/authService";
import { setAuthAccessToken } from "@/api/axiosInstance";

const REFRESH_TOKEN_KEY = "refreshToken";
const AUTH_EMAIL_KEY = "authEmail";

const AuthContext = createContext(undefined);

export const AuthProvider = ({ children }) => {
  const [accessToken, setAccessToken] = useState(null);
  const [email, setEmail] = useState(() => localStorage.getItem(AUTH_EMAIL_KEY));
  const [isBootstrapping, setIsBootstrapping] = useState(true);

  const clearAuthState = useCallback(() => {
    setAccessToken(null);
    setEmail(null);
    setAuthAccessToken(null);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    localStorage.removeItem(AUTH_EMAIL_KEY);
  }, []);

  const login = useCallback(async (nextEmail, password) => {
    const authData = await authService.login(nextEmail, password);

    setAccessToken(authData.accessToken);
    setEmail(nextEmail);
    setAuthAccessToken(authData.accessToken);

    return authData;
  }, []);

  const logout = useCallback(async () => {
    try {
      await authService.logout();
    } catch {
      // Local cleanup should happen even when API logout fails.
    } finally {
      clearAuthState();
      window.location.assign("/login");
    }
  }, [clearAuthState]);

  useEffect(() => {
    let isMounted = true;

    const bootstrapAuth = async () => {
      const storedRefreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);
      const storedEmail = localStorage.getItem(AUTH_EMAIL_KEY);

      if (!storedRefreshToken || !storedEmail) {
        if (isMounted) {
          setIsBootstrapping(false);
        }
        return;
      }

      try {
        const refreshed = await authService.refreshToken();

        if (!isMounted) {
          return;
        }

        setAccessToken(refreshed.accessToken);
        setEmail(storedEmail);
        setAuthAccessToken(refreshed.accessToken);
      } catch {
        if (isMounted) {
          clearAuthState();
        }
      } finally {
        if (isMounted) {
          setIsBootstrapping(false);
        }
      }
    };

    bootstrapAuth();

    return () => {
      isMounted = false;
    };
  }, [clearAuthState]);

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
    }),
    [accessToken, email, isBootstrapping, login, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
};
