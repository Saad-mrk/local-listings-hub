import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";

interface User {
  id: number;
  email: string;
  name: string;
  verified?: boolean;
}

interface UserContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, name: string) => void;
  logout: () => void;
  updateUser: (name: string) => void;
  registerAndSendCode: (email: string, name: string) => string;
  verifyCode: (code: string, email: string) => boolean;
}

export type { User, UserContextType };

const UserContext = createContext<UserContextType | undefined>(undefined);

export { UserContext };

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [verificationCode, setVerificationCode] = useState<string | null>(null);
  const [pendingEmail, setPendingEmail] = useState<string | null>(null);
  const [pendingName, setPendingName] = useState<string | null>(null);

  // Generate random 6-digit verification code
  const generateCode = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
  };

  useEffect(() => {
    // Load user from localStorage on app startup
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error("Error parsing stored user:", error);
        localStorage.removeItem("user");
      }
    }
    setIsLoading(false);
  }, []);

  const login = (email: string, name: string) => {
    const newUser: User = {
      id: Date.now(),
      email,
      name,
      verified: true,
    };
    setUser(newUser);
    localStorage.setItem("user", JSON.stringify(newUser));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  const updateUser = (name: string) => {
    if (user) {
      const updatedUser = { ...user, name };
      setUser(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));
    }
  };

  const registerAndSendCode = (email: string, name: string) => {
    const code = generateCode();
    // Store code and pending data
    setVerificationCode(code);
    setPendingEmail(email);
    setPendingName(name);

    // In production, you would send this via email service
    // For now, we'll log it and store it in sessionStorage for testing
    console.log(`Verification code for ${email}: ${code}`);
    sessionStorage.setItem("verificationCode", code);
    sessionStorage.setItem("pendingEmail", email);
    sessionStorage.setItem("pendingName", name);

    return code; // Return for testing purposes
  };

  const verifyCode = (code: string, email: string) => {
    const storedCode = sessionStorage.getItem("verificationCode");
    const storedEmail = sessionStorage.getItem("pendingEmail");

    if (storedCode === code && storedEmail === email) {
      const name = sessionStorage.getItem("pendingName") || "";

      // Clear verification data
      sessionStorage.removeItem("verificationCode");
      sessionStorage.removeItem("pendingEmail");
      sessionStorage.removeItem("pendingName");

      // Create user
      const newUser: User = {
        id: Date.now(),
        email,
        name,
        verified: true,
      };
      setUser(newUser);
      localStorage.setItem("user", JSON.stringify(newUser));

      // Clear context state
      setVerificationCode(null);
      setPendingEmail(null);
      setPendingName(null);

      return true;
    }
    return false;
  };

  const value = {
    user,
    isLoading,
    login,
    logout,
    updateUser,
    registerAndSendCode,
    verifyCode,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};
