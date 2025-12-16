import axios from 'axios';

const api = axios.create({
  baseURL: 'http://127.0.0.1:3001',
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Check for 401 Unauthorized OR Network Error (server down/unreachable)
    // error.response is undefined for network errors like Connection Refused
    if (error.response?.status === 401 || !error.response) {
      localStorage.removeItem('token');
      // Only redirect if we are not already on the landing page or login page to avoid loops
      if (typeof window !== 'undefined' && window.location.pathname !== '/') {
         window.location.href = '/';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
