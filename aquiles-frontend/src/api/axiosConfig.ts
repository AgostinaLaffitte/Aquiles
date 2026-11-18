import axios from 'axios';

const api = axios.create({
  // Vite usa import.meta.env en lugar de process.env
  baseURL: import.meta.env.VITE_API_URL || 'https://aquiles-production-8b5f6016.up.railway.app',
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;