import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { STORAGE_KEYS } from "@/config/constants";
import type { AuthResponse, User } from "@/types/user.types";

interface UserContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (authResponse: AuthResponse) => void;
  logout: () => void;
  updateUser: (name: string) => void;
}

export type { User, UserContextType };

const UserContext = createContext<UserContextType | undefined>(undefined);

export { UserContext };

const parseJwtPayload = (token: string): Record<string, unknown> | null => {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) {
      return null;
    }

    const base64 = parts[1].replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((char) => `%${`00${char.charCodeAt(0).toString(16)}`.slice(-2)}`)
        .join(""),
    );

    return JSON.parse(jsonPayload) as Record<string, unknown>;
  } catch {
    return null;
  }
};

const toStringClaim = (payload: Record<string, unknown> | null, keys: string[]): string => {
  if (!payload) {
    return "";
  }

  for (const key of keys) {
    const value = payload[key];
    if (typeof value === "string" && value.trim()) {
      return value;
    }
  }

  return "";
};

const buildUserFromToken = (token: string): User => {
  const payload = parseJwtPayload(token);
  const email = toStringClaim(payload, ["email", "upn", "unique_name"]);
  const name = toStringClaim(payload, ["name", "given_name"]) || email.split("@")[0] || "User";
  const id =
    toStringClaim(payload, [
      "sub",
      "nameid",
      "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier",
    ]) ||
    email ||
    `${Date.now()}`;
  const verifiedClaim = payload?.email_verified;

  return {
    id,
    email,
    name,
    verified: typeof verifiedClaim === "boolean" ? verifiedClaim : true,
  };
};

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem(STORAGE_KEYS.USER);
    const storedToken = localStorage.getItem(STORAGE_KEYS.TOKEN);

    if (storedToken) {
      setToken(storedToken);
    }

    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error("Error parsing stored user:", error);
        localStorage.removeItem(STORAGE_KEYS.USER);
      }
    } else if (storedToken) {
      setUser(buildUserFromToken(storedToken));
    }

    setIsLoading(false);
  }, []);

  const login = (authResponse: AuthResponse) => {
    const nextToken = authResponse.token;
    const nextUser = authResponse.user ?? buildUserFromToken(nextToken);

    setToken(nextToken);
    setUser(nextUser);

    localStorage.setItem(STORAGE_KEYS.TOKEN, nextToken);
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(nextUser));
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem(STORAGE_KEYS.USER);
    localStorage.removeItem(STORAGE_KEYS.TOKEN);
  };

  const updateUser = (name: string) => {
    if (user) {
      const updatedUser = { ...user, name };
      setUser(updatedUser);
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(updatedUser));
    }
  };

  const value = {
    user,
    token,
    isLoading,
    login,
    logout,
    updateUser,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};
