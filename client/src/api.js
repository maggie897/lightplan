import axios from 'axios';

// Create a reusable Axios instance
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

// Add Authorization header if token exists
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default api;