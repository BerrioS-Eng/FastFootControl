// Authentication Service
import { apiClient, API_ENDPOINTS } from '@/lib/api-config';
import { LoginRequest, LoginResponse, UserDTO } from '@/types/api';

export class AuthService {
  static async login(credentials: LoginRequest): Promise<LoginResponse> {
    try {
      const response = await apiClient.post<LoginResponse>(
        API_ENDPOINTS.AUTH.LOGIN,
        credentials
      );
      
      // Store the token in localStorage
      if (response.token) {
        localStorage.setItem('auth_token', response.token);
        localStorage.setItem('user_data', JSON.stringify(response.user));
      }
      
      return response;
    } catch (error) {
      console.error('Login failed:', error);
      throw new Error('Login failed. Please check your credentials.');
    }
  }

  static logout(): void {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_data');
  }

  static getToken(): string | null {
    return typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
  }

  static getCurrentUser(): UserDTO | null {
    if (typeof window !== 'undefined') {
      const userData = localStorage.getItem('user_data');
      return userData ? JSON.parse(userData) : null;
    }
    return null;
  }

  static isAuthenticated(): boolean {
    return this.getToken() !== null;
  }
}