interface Env {
  apiUrl: string;
}

const normalizeUrl = (value: string): string => value.replace(/\/$/, "");

export const env: Env = {
  apiUrl: normalizeUrl(import.meta.env.VITE_API_URL || "https://localhost:7111"),
};
