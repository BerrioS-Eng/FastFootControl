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

  // Debug: Logging de cambios de estado
  useEffect(() => {
    console.log('🔄 Auth state changed:', { 
      hasUser: !!user, 
      userId: user?.userId, 
      userRole: user?.role,
      hasToken: !!token, 
      isAuthenticated: !!user && !!token,
      isLoading 
    });
  }, [user, token, isLoading]);

  useEffect(() => {
    const savedToken = localStorage.getItem('auth_token');
    const savedUser = localStorage.getItem('user_data');
    
    console.log('Auth init - token exists:', !!savedToken, 'user exists:', !!savedUser);
    
    if (savedToken && savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser);
        console.log('Loading saved auth data:', { userId: parsedUser?.userId, token: savedToken.substring(0, 20) + '...' });
        setToken(savedToken);
        setUser(parsedUser);
      } catch (error) {
        console.error('Error parsing saved user data:', error);
        // Limpiar datos corruptos
        localStorage.removeItem('auth_token');
        localStorage.removeItem('user_data');
        setToken(null);
        setUser(null);
      }
    } else {
      console.log('No saved auth data found');
    }
    setIsLoading(false);
  }, []);

  const login = async (credentials: LoginRequest): Promise<LoginResponse> => {
    console.log('Login attempt for user:', credentials.userName);
    setIsLoading(true);
    try {
      const response = await AuthService.login(credentials);
      console.log('Login successful. User:', response.user?.userId, 'Token length:', response.token?.length);
      setUser(response.user);
      setToken(response.token);
      setIsLoading(false);
      return response;
    } catch (error) {
      console.error('Login failed:', error);
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
    console.log('syncUserFromBackend called - user:', user?.userId, 'token exists:', !!token);
    
    // Solo sincronizar si hay usuario y token válidos
    if (!user?.userId || !token) {
      console.log('Skipping sync - missing user or token');
      return;
    }
    
    try {
      console.log('Syncing user from backend for userId:', user.userId);
      const updatedUser = await UsersService.refreshCurrentUser(user.userId);
      console.log('User sync successful:', updatedUser);
      setUser(updatedUser);
    } catch (error) {
      console.error('Error syncing user from backend:', error);
      // No hacer logout automático - puede ser un error temporal
      // Solo registrar el error para debugging
      if (error instanceof Error && error.message.includes('403')) {
        console.warn('Error 403 en sincronización - puede ser temporal, no cerrando sesión automáticamente');
      }
    }
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