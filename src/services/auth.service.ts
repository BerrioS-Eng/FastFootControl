// Authentication Service
import { apiClient, API_ENDPOINTS } from '@/lib/api-config';
import { LoginRequest, LoginResponse, UserDTO } from '@/types/api';

export class AuthService {
  static async login(credentials: LoginRequest): Promise<LoginResponse> {
    try {
      // Transform userName to username for API compatibility
      const apiCredentials = {
        username: credentials.userName,
        password: credentials.password
      };

      const response = await apiClient.post<any>(
        API_ENDPOINTS.AUTH,
        apiCredentials
      );
      
      // Handle wrapped response format: { success: true, data: { user, token }, message }
      const loginData = response.data || response;
      
      // Store the token in localStorage
      if (loginData.token) {
        localStorage.setItem('auth_token', loginData.token);
        localStorage.setItem('user_data', JSON.stringify(loginData.user));
      }
      
      // Return in expected format
      return {
        token: loginData.token,
        user: loginData.user,
        message: response.message || 'Login successful'
      };
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