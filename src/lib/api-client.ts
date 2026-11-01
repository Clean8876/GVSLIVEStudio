import axios from "axios";

export const apiClient = axios.create({ baseURL: "/api" });

apiClient.interceptors.request.use(async (config) => {
  const { auth } = await import("@/lib/firebase/config");
  await auth.authStateReady();
  if (auth.currentUser) config.headers.set("Authorization", `Bearer ${await auth.currentUser.getIdToken()}`);
  return config;
});
