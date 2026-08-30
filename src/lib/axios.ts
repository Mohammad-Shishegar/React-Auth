import axios, { AxiosError, type InternalAxiosRequestConfig } from "axios";
import { useAuthStore } from "../store/auth.store";
const api = axios.create({
  baseURL: "http://localhost:3000/api",
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
});
type RequestConfig = InternalAxiosRequestConfig & { _retry?: boolean };
let isRefreshing = false;
let queue: {
  resolve: (token: string) => void;
  reject: (error: unknown) => void;
}[] = [];
const processQueue = (error: unknown, token: string | null) => {
  queue.forEach(({ resolve, reject }) => {
    if (error) {
      reject(error);
    } else if (token) {
      resolve(token);
    }
  });
  queue = [];
};
api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as RequestConfig;
    if (error.response?.status !== 401) {
      return Promise.reject(error);
    }
    if (originalRequest._retry || originalRequest.url === "/auth/refresh") {
      useAuthStore.getState().clearAuth();
      return Promise.reject(error);
    }
    originalRequest._retry = true;
    if (isRefreshing) {
      return new Promise<string>((resolve, reject) => {
        queue.push({ resolve, reject });
      }).then((token) => {
        originalRequest.headers.Authorization = `Bearer ${token}`;
        return api(originalRequest);
      });
    }
    isRefreshing = true;
    try {
      const { data } = await api.post<{ accessToken: string }>("/auth/refresh");
      const newToken = data.accessToken;
      useAuthStore.getState().setAccessToken(newToken);
      processQueue(null, newToken);
      originalRequest.headers.Authorization = `Bearer ${newToken}`;
      return api(originalRequest);
    } catch (refreshError) {
      processQueue(refreshError, null);
      useAuthStore.getState().clearAuth();
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  },
);
export default api;
