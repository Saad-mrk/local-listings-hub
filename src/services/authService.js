import axiosInstance from "@/api/axiosInstance";

const REFRESH_TOKEN_KEY = "refreshToken";
const AUTH_EMAIL_KEY = "authEmail";

const extractResponseData = (response) => {
  const wrappedData = response?.data?.data;

  if (!wrappedData) {
    throw new Error("Reponse API invalide");
  }

  return wrappedData;
};

export const login = async (email, password) => {
  const response = await axiosInstance.post("/api/Auth/login", {
    email,
    password,
  });

  const authData = extractResponseData(response);

  if (!authData.accessToken || !authData.refreshToken) {
    throw new Error("Reponse de connexion invalide");
  }

  localStorage.setItem(REFRESH_TOKEN_KEY, authData.refreshToken);
  localStorage.setItem(AUTH_EMAIL_KEY, email);

  return authData;
};

export const refreshToken = async () => {
  const storedRefreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);
  const storedEmail = localStorage.getItem(AUTH_EMAIL_KEY);

  if (!storedRefreshToken || !storedEmail) {
    throw new Error("Aucune session a rafraichir");
  }

  const response = await axiosInstance.post("/api/Auth/refresh", {
    refreshToken: storedRefreshToken,
    email: storedEmail,
  });

  const authData = extractResponseData(response);

  if (!authData.accessToken || !authData.refreshToken) {
    throw new Error("Reponse de rafraichissement invalide");
  }

  localStorage.setItem(REFRESH_TOKEN_KEY, authData.refreshToken);
  localStorage.setItem(AUTH_EMAIL_KEY, storedEmail);

  return authData;
};

export const logout = async () => {
  const storedRefreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);
  const storedEmail = localStorage.getItem(AUTH_EMAIL_KEY);

  if (!storedRefreshToken || !storedEmail) {
    return { success: true };
  }

  const response = await axiosInstance.post("/api/Auth/logout", {
    refreshToken: storedRefreshToken,
    email: storedEmail,
  });

  const wrappedResponse = response?.data;

  if (!wrappedResponse || wrappedResponse.success !== true) {
    throw new Error(wrappedResponse?.message || "Echec de la deconnexion");
  }

  return wrappedResponse;
};
