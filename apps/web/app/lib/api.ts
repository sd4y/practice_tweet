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
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      // Force reload to reset state if we are on client side
      if (typeof window !== 'undefined') {
         window.location.href = '/';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
