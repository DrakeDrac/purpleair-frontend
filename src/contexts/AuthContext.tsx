import React, { createContext, useContext, useState, useEffect } from 'react';
import { apiClient } from '@/lib/api';

interface User {
  id: number;
  username: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (username: string, password: string) => Promise<void>;
  register: (username: string, password: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing token on mount
    const savedToken = localStorage.getItem('weatherAppToken');
    if (savedToken) {
      setToken(savedToken);
      // Verify token is still valid
      apiClient.getCurrentUser()
        .then((data: any) => {
          setUser(data.user);
        })
        .catch(() => {
          // Token invalid, clear it
          localStorage.removeItem('weatherAppToken');
          setToken(null);
        })
        .finally(() => {
          setIsLoading(false);
        });
    } else {
      setIsLoading(false);
    }
  }, []);

  const login = async (username: string, password: string) => {
    const response = await apiClient.login(username, password);
    setToken(response.token);
    setUser(response.user);
    localStorage.setItem('weatherAppToken', response.token);
  };

  const register = async (username: string, password: string) => {
    const response = await apiClient.register(username, password);
    setToken(response.token);
    setUser(response.user);
    localStorage.setItem('weatherAppToken', response.token);
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('weatherAppToken');
  };

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
