import { createContext, useState, useContext } from 'react';
import axios from 'axios';

const AuthContext = createContext();

const API_URL = 'http://localhost:5000/api';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('token'));

  const login = async (email, password) => {
    const res = await axios.post(`${API_URL}/users/login`, { email, password });
    setUser(res.data.user);
    setToken(res.data.token);
    localStorage.setItem('user', JSON.stringify(res.data.user));
    localStorage.setItem('token', res.data.token);
    return res.data;
  };

  const register = async (userData) => {
    const res = await axios.post(`${API_URL}/users/register`, userData);
    setUser(res.data.user);
    setToken(res.data.token);
    localStorage.setItem('user', JSON.stringify(res.data.user));
    localStorage.setItem('token', res.data.token);
    return res.data;
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  };

  return (
   <AuthContext.Provider
  value={{
    user,
    setUser,
    token,
    login,
    register,
    logout,
  }}
>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}