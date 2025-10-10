// API Configuration for FastFoodControl with PostgreSQL Backend

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

export const API_ENDPOINTS = {
  // Authentication
  AUTH: {
    LOGIN: `${API_BASE_URL}/auth/login`,
  },
  
  // Products
  PRODUCTS: {
    CREATE: `${API_BASE_URL}/products`,
    EDIT: `${API_BASE_URL}/products`,
    GET_ALL: `${API_BASE_URL}/products`,
    GET_BY_ID: `${API_BASE_URL}/products`,
    DELETE: `${API_BASE_URL}/products`,
  },
  
  // Sales
  SALES: {
    REGISTER: `${API_BASE_URL}/sales`,
    GET_BY_ID: `${API_BASE_URL}/sales`,
    GET_ALL: `${API_BASE_URL}/sales`,
    GET_BY_DAY: `${API_BASE_URL}/sales`,
    DELETE: `${API_BASE_URL}/sales`,
  },
  
  // Users
  USERS: {
    CREATE: `${API_BASE_URL}/users`,
    EDIT: `${API_BASE_URL}/users`,
    GET_BY_ID: `${API_BASE_URL}/users`,
    GET_ALL: `${API_BASE_URL}/users`,
    DELETE: `${API_BASE_URL}/users`,
  },
};

// HTTP Client Configuration
export const apiClient = {
  async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
    
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
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  },

  get<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'GET' });
  },

  post<T>(endpoint: string, data?: unknown): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  put<T>(endpoint: string, data?: unknown): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  },

  // Special method for multipart/form-data (for product images)
  postFormData<T>(endpoint: string, formData: FormData): Promise<T> {
    const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
    
    return this.request<T>(endpoint, {
      method: 'POST',
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
        // Don't set Content-Type for FormData, let the browser set it
      },
      body: formData,
    });
  },
};

export default API_ENDPOINTS;