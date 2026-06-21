import axios from "axios";

// =============================================
// Axios Instance
// Pre-configured with the backend base URL.
// Automatically attaches the JWT token from
// localStorage to every request.
// =============================================

const api = axios.create({
  baseURL: "http://localhost:5000/api",
});

// Request interceptor: attach JWT token to every request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
