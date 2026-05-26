import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor: Inject JWT token into headers
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('ulk_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor: Handle global errors like token expiration
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // If token is expired or unauthorized, automatically log out
      if (error.response.status === 401 && !window.location.pathname.includes('/login')) {
        localStorage.removeItem('ulk_token');
        localStorage.removeItem('ulk_user');
        window.location.href = '/login?expired=true';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
