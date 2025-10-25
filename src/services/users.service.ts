// Users Service - Adaptado para Backend Spring Boot
import { apiClient, API_ENDPOINTS } from '@/lib/api-config';
import { UserDTO } from '@/types/api';

const ERROR_MESSAGES = {
  CREATE: 'No se pudo crear el usuario',
  UPDATE: 'No se pudo actualizar el usuario',
  FETCH: 'No se pudo obtener la información del usuario',
  FETCH_ALL: 'No se pudieron cargar los usuarios',
  DELETE: 'No se pudo eliminar el usuario',
} as const;

export class UsersService {
  private static handleError(error: unknown, message: string): never {
    console.error('UsersService Error:', error);
    throw new Error(message);
  }

  static async createUser(userData: UserDTO): Promise<UserDTO> {
    try {
      // Usar la API local de Next.js que actúa como proxy
      const requestData = {
        userName: userData.userName,
        password: userData.password,
        role: userData.role,
        fullName: userData.fullName,
        email: userData.email,
        area: userData.area
      };
      return await apiClient.post<UserDTO>(API_ENDPOINTS.USERS, requestData);
    } catch (error) {
      this.handleError(error, ERROR_MESSAGES.CREATE);
    }
  }

  static async editUser(userId: number, userData: UserDTO): Promise<UserDTO> {
    try {
      const requestData = {
        id: userId,
        userId: userId,
        userName: userData.userName,
        password: userData.password,
        role: userData.role,
        fullName: userData.fullName,
        email: userData.email,
        area: userData.area
      };
      return await apiClient.put<UserDTO>(API_ENDPOINTS.USERS, requestData);
    } catch (error) {
      this.handleError(error, ERROR_MESSAGES.UPDATE);
    }
  }

  static async getUserById(userId: number): Promise<UserDTO> {
    try {
      return await apiClient.get<UserDTO>(`${API_ENDPOINTS.USERS}?id=${userId}`);
    } catch (error) {
      this.handleError(error, ERROR_MESSAGES.FETCH);
    }
  }

  static async getAllUsers(): Promise<UserDTO[]> {
    try {
      return await apiClient.get<UserDTO[]>(API_ENDPOINTS.USERS);
    } catch (error) {
      this.handleError(error, ERROR_MESSAGES.FETCH_ALL);
    }
  }

  static async deleteUser(userId: number): Promise<string> {
    try {
      return await apiClient.delete<string>(`${API_ENDPOINTS.USERS}?id=${userId}`);
    } catch (error) {
      this.handleError(error, ERROR_MESSAGES.DELETE);
    }
  }

  static async refreshCurrentUser(userId: number): Promise<UserDTO> {
    try {
      const userData = await this.getUserById(userId);
      // Actualizar localStorage con los datos más recientes
      localStorage.setItem('user_data', JSON.stringify(userData));
      return userData;
    } catch (error) {
      this.handleError(error, ERROR_MESSAGES.FETCH);
    }
  }
}