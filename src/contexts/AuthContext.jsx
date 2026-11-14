import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('inova_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('inova_token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      const storedToken = api.getToken();
      if (!storedToken) {
        setLoading(false);
        return;
      }

      try {
        const response = await api.get('/profile');
        if (response?.data) {
          setUser(response.data);
          localStorage.setItem('inova_user', JSON.stringify(response.data));
        }
      } catch (err) {
        console.warn('Erro ao carregar sessão:', err.message);
        api.setToken(null);
        setUser(null);
        localStorage.removeItem('inova_user');
      } finally {
        setLoading(false);
      }
    };

    const handleLogoutEvent = () => {
      setUser(null);
      setToken(null);
    };

    window.addEventListener('auth:logout', handleLogoutEvent);
    loadUser();

    return () => {
      window.removeEventListener('auth:logout', handleLogoutEvent);
    };
  }, []);

  const login = async (email, password) => {
    const res = await api.post('/login', { email, password });
    if (res?.data) {
      const { user: loggedUser, token: authToken } = res.data;
      api.setToken(authToken);
      setToken(authToken);
      setUser(loggedUser);
      localStorage.setItem('inova_user', JSON.stringify(loggedUser));
      return loggedUser;
    }
  };

  const register = async (formData) => {
    const res = await api.post('/register', formData);
    if (res?.data) {
      const { user: registeredUser, token: authToken } = res.data;
      api.setToken(authToken);
      setToken(authToken);
      setUser(registeredUser);
      localStorage.setItem('inova_user', JSON.stringify(registeredUser));
      return registeredUser;
    }
  };

  const logout = async () => {
    try {
      if (token) {
        await api.post('/logout');
      }
    } catch (err) {
      console.warn('Erro ao chamar logout da API:', err.message);
    } finally {
      api.setToken(null);
      setToken(null);
      setUser(null);
      localStorage.removeItem('inova_user');
    }
  };

  const updateProfile = async (data) => {
    const res = await api.put('/profile', data);
    if (res?.data) {
      setUser(res.data);
      localStorage.setItem('inova_user', JSON.stringify(res.data));
      return res.data;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        isAuthenticated: !!user,
        isAdmin: user?.role === 'admin',
        isVolunteer: user?.role === 'volunteer',
        isClient: user?.role === 'client',
        isOrganizer: user?.role === 'organizer',
        login,
        register,
        logout,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser utilizado dentro de AuthProvider');
  }
  return context;
};
