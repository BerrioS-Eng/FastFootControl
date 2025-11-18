'use client';

import { useState, useEffect, useContext, createContext, ReactNode } from 'react';
import { AuthService } from '@/services/auth.service';
import { UsersService } from '@/services/users.service';
import { LoginRequest, LoginResponse, UserDTO } from '@/types/api';

interface AuthContextType {
  user: UserDTO | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginRequest) => Promise<LoginResponse>;
  logout: () => void;
  refreshUser: () => void;
  updateUser: (updatedUser: UserDTO) => void;
  syncUserFromBackend: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserDTO | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const savedToken = localStorage.getItem('auth_token');
    const savedUser = localStorage.getItem('user_data');
    
    if (savedToken && savedUser) {
      try {
        setToken(savedToken);
        setUser(JSON.parse(savedUser));
      } catch (error) {
        console.error('Error parsing saved user data:', error);
        localStorage.removeItem('auth_token');
        localStorage.removeItem('user_data');
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (credentials: LoginRequest): Promise<LoginResponse> => {
    setIsLoading(true);
    try {
      const response = await AuthService.login(credentials);
      setUser(response.user);
      setToken(response.token);
      setIsLoading(false);
      return response;
    } catch (error) {
      setIsLoading(false);
      throw error;
    }
  };

  const logout = () => {
    AuthService.logout();
    setUser(null);
    setToken(null);
  };

  const refreshUser = () => {
    const savedUser = localStorage.getItem('user_data');
    if (savedUser) {
      try {
        const userData = JSON.parse(savedUser);
        setUser(userData);
      } catch (error) {
        console.error('Error refreshing user data:', error);
        // Si hay error, limpiar datos corruptos
        localStorage.removeItem('user_data');
        localStorage.removeItem('auth_token');
      }
    }
  };

  const updateUser = (updatedUser: UserDTO) => {
    setUser(updatedUser);
    localStorage.setItem('user_data', JSON.stringify(updatedUser));
  };

  const syncUserFromBackend = async () => {
    if (!user?.userId) return;
    
    try {
      const updatedUser = await UsersService.refreshCurrentUser(user.userId);
      setUser(updatedUser);
    } catch (error) {
      console.error('Error syncing user from backend:', error);
    }
    
    // if (!user?.userId) return;
    // 
    // try {
    //   const updatedUser = await UsersService.refreshCurrentUser(user.userId);
    //   setUser(updatedUser);
    // } catch (error) {
    //   console.error('Error syncing user from backend:', error);
    // }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user && !!token,
        isLoading,
        login,
        logout,
        refreshUser,
        updateUser,
        syncUserFromBackend,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}