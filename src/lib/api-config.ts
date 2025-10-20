// API Configuration for FastFoodControl - Conectando al Backend Spring Boot

const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8080';

// Endpoints del Backend Spring Boot
export const API_ENDPOINTS = {
  AUTH: `${API_BASE_URL}/auth/login`,
  PRODUCTS: `${API_BASE_URL}/productos`, // Endpoint del backend Spring Boot
  SALES: `${API_BASE_URL}/ventas`,       // Endpoint del backend Spring Boot
  USERS: `${API_BASE_URL}/users/get-all-users`, // Endpoint del backend Spring Boot
  USER_BY_ID: `${API_BASE_URL}/users/get-user`, // Endpoint específico para obtener usuario por ID
} as const;

// HTTP Client Configuration - Adaptado para Spring Boot
class ApiClient {
  private getAuthToken(): string | null {
    return typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
  }

  private async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      // Intentar obtener mensaje de error del backend
      try {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      } catch {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    }
    
    const result = await response.json();
    
    // El backend de Spring Boot puede devolver directamente los datos o en formato { data: ... }
    return result?.data ?? result;
  }

  async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const token = this.getAuthToken();
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(endpoint, config);
      return await this.handleResponse<T>(response);
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  get<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'GET' });
  }

  post<T>(endpoint: string, data?: unknown): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  put<T>(endpoint: string, data?: unknown): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }

  // Form data upload (for images, files)
  postFormData<T>(endpoint: string, formData: FormData): Promise<T> {
    const token = this.getAuthToken();
    
    return this.request<T>(endpoint, {
      method: 'POST',
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
        // Don't set Content-Type for FormData
      },
      body: formData,
    });
  }
}

export const apiClient = new ApiClient();

export default API_ENDPOINTS;