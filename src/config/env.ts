interface Env {
  apiUrl: string;
}

export const env: Env = {
  apiUrl: import.meta.env.VITE_API_URL ?? "",
};
