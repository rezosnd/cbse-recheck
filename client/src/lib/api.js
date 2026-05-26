import axios from 'axios';

// ── Standard API (goes through Vercel proxy — fine for JSON) ────────────────
const api = axios.create({
  baseURL: '/api',
  timeout: 30000,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// ── Upload API (goes DIRECTLY to backend — bypasses Vercel 4.5MB proxy limit)
// Vercel serverless functions cap request bodies at 4.5MB, so file uploads
// must skip the proxy and hit the backend URL directly.
const DIRECT_BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'https://api-recheck.veritasco.tech';

export const uploadApi = axios.create({
  baseURL: `${DIRECT_BACKEND_URL}/api`,
  timeout: 180000, // 3 minutes for large file uploads
  withCredentials: true,
});

// ── Shared interceptor: attach JWT token ───────────────────────────────────
const attachToken = (config) => {
  const token = localStorage.getItem('cbse_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
};

const handleAuthError = (error) => {
  if (error.response?.status === 401) {
    localStorage.removeItem('cbse_token');
    localStorage.removeItem('cbse_user');
    window.dispatchEvent(new CustomEvent('auth:logout'));
  }
  return Promise.reject(error);
};

api.interceptors.request.use(attachToken, (e) => Promise.reject(e));
api.interceptors.response.use((r) => r, handleAuthError);

uploadApi.interceptors.request.use(attachToken, (e) => Promise.reject(e));
uploadApi.interceptors.response.use((r) => r, handleAuthError);

export default api;
