import { useState } from "react";

interface AuthValues {
  email: string;
  password: string;
  name: string;
}

interface UseAuthFormReturn {
  values: AuthValues;
  error: string;
  setEmail: (value: string) => void;
  setPassword: (value: string) => void;
  setName: (value: string) => void;
  setError: (value: string) => void;
  reset: () => void;
}

export const useAuthForm = (): UseAuthFormReturn => {
  const [values, setValues] = useState<AuthValues>({
    email: "",
    password: "",
    name: "",
  });
  const [error, setError] = useState("");

  const setEmail = (email: string) => {
    setValues((prev) => ({ ...prev, email }));
  };

  const setPassword = (password: string) => {
    setValues((prev) => ({ ...prev, password }));
  };

  const setName = (name: string) => {
    setValues((prev) => ({ ...prev, name }));
  };

  const reset = () => {
    setValues({ email: "", password: "", name: "" });
    setError("");
  };

  return {
    values,
    error,
    setEmail,
    setPassword,
    setName,
    setError,
    reset,
  };
};
