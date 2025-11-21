import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

axiosInstance.interceptors.request.use((config) => {
  try {
    const persistRoot = JSON.parse(localStorage.getItem('persist:root') || '{}');
    const user = persistRoot.user ? JSON.parse(persistRoot.user) : null;
    const token = user?.token;

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  } catch (e) {
    console.error('Error al cargar token del persist:', e);
  }

  return config;
});

export default axiosInstance;
