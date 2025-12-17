import axios from 'axios';

const api = axios.create({
  baseURL: 'http://3.35.10.193:3001',
});

api.interceptors.request.use((config) => {
  console.log(`[API Request] ${config.method?.toUpperCase()} ${config.url}`, config.data);
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => {
    console.log(`[API Response Success] ${response.config.url}`, response.status, response.data);
    return response;
  },
  (error) => {
    // NO REDIRECT - just log and reject for debugging
    console.error('[API Response Error]', {
      url: error.config?.url,
      status: error.response?.status,
      data: error.response?.data,
      message: error.message
    });
    return Promise.reject(error);
  }
);

export default api;

