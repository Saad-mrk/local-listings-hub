import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { setAuthAccessToken } from "@/api/axiosInstance";

const AUTH_TOKEN_KEY = "authToken";
const ACCESS_TOKEN_KEY = "accessToken";
const REFRESH_TOKEN_KEY = "refreshToken";
const AUTH_EMAIL_KEY = "authEmail";

const decodeJwtPayload = (token: string): Record<string, unknown> | null => {
  const parts = token.split(".");

  if (parts.length < 2) {
    return null;
  }

  try {
    const normalized = parts[1].replace(/-/g, "+").replace(/_/g, "/");
    const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, "=");
    const payload = atob(padded);

    return JSON.parse(payload) as Record<string, unknown>;
  } catch {
    return null;
  }
};

const extractEmailFromToken = (token: string): string | null => {
  const payload = decodeJwtPayload(token);

  if (!payload) {
    return null;
  }

  const candidate = payload.email ?? payload.sub ?? payload.preferred_username;

  return typeof candidate === "string" && candidate.includes("@") ? candidate : null;
};

const AuthCallback = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const accessToken = params.get("token") ?? params.get("accessToken");
    const refreshToken = params.get("refresh") ?? params.get("refreshToken");

    if (!accessToken || !refreshToken) {
      navigate("/login?error=google_failed", { replace: true });
      return;
    }

    localStorage.setItem(AUTH_TOKEN_KEY, accessToken);
    localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
    localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
    setAuthAccessToken(accessToken);

    const email = extractEmailFromToken(accessToken);
    if (email) {
      localStorage.setItem(AUTH_EMAIL_KEY, email);
    }

    navigate("/dashboard", { replace: true });
  }, [location.search, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="text-center space-y-2">
        <div className="text-sm text-muted-foreground">Connexion Google en cours...</div>
      </div>
    </div>
  );
};

export default AuthCallback;
