import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../lib/api';
import toast from 'react-hot-toast';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem('cbse_dark') === 'true' ||
      window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  // Persist dark mode
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('cbse_dark', darkMode);
  }, [darkMode]);

  // Load user from localStorage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('cbse_user');
    const token = localStorage.getItem('cbse_token');
    if (storedUser && token) {
      try {
        setUser(JSON.parse(storedUser));
      } catch {
        localStorage.removeItem('cbse_user');
      }
    }
    // Verify with server
    if (token) {
      api.get('/auth/me')
        .then(res => {
          setUser(res.data.user);
          localStorage.setItem('cbse_user', JSON.stringify(res.data.user));
        })
        .catch((err) => {
          if (err.response && err.response.status === 401) {
            localStorage.removeItem('cbse_token');
            localStorage.removeItem('cbse_user');
            setUser(null);
          }
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }

    // Listen for auto-logout events
    const handleAutoLogout = () => {
      setUser(null);
      toast.error('Session expired. Please login again.');
    };
    window.addEventListener('auth:logout', handleAutoLogout);
    return () => window.removeEventListener('auth:logout', handleAutoLogout);
  }, []);

  const login = useCallback((userData, token) => {
    setUser(userData);
    localStorage.setItem('cbse_token', token);
    localStorage.setItem('cbse_user', JSON.stringify(userData));
  }, []);

  const logout = useCallback(async () => {
    try { await api.post('/auth/logout'); } catch {}
    setUser(null);
    localStorage.removeItem('cbse_token');
    localStorage.removeItem('cbse_user');
    toast.success('Logged out successfully');
  }, []);

  const updateUser = useCallback((updatedUser) => {
    setUser(updatedUser);
    localStorage.setItem('cbse_user', JSON.stringify(updatedUser));
  }, []);

  return (
    <AuthContext.Provider value={{
      user, loading, darkMode,
      setDarkMode, login, logout, updateUser,
      isAdmin: user?.role === 'admin',
      isAuthenticated: !!user,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
};
