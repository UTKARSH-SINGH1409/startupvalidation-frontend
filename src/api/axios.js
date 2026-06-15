import axios from "axios";

const apiBaseURL = import.meta.env.VITE_API_BASE_URL;

if (!apiBaseURL) {
  throw new Error(
    "Missing VITE_API_BASE_URL in environment. Add it to .env or Vite environment variables."
  );
}

const api = axios.create({
  baseURL: apiBaseURL,
  headers: {
    "Content-Type": "application/json",
  },
});


// Request interceptor to add Authorization header
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle session expiry (401 Unauthorized)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("email");
      localStorage.removeItem("userName");
      // Redirect to login page if unauthorized
      if (window.location.pathname !== "/" && window.location.pathname !== "/register") {
        window.location.href = "/";
      }
    }
    return Promise.reject(error);
  }
);

export default api;
