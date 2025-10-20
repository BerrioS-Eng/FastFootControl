// Users Service - Adaptado para Backend Spring Boot
import { apiClient, API_ENDPOINTS } from '@/lib/api-config';
import { UserDTO } from '@/types/api';

// Error messages centralized
const ERROR_MESSAGES = {
  CREATE: 'No se pudo crear el usuario. Inténtalo de nuevo.',
  UPDATE: 'No se pudo actualizar el usuario. Inténtalo de nuevo.',
  FETCH: 'No se pudo obtener la información del usuario.',
  FETCH_ALL: 'No se pudieron cargar los usuarios.',
  DELETE: 'No se pudo eliminar el usuario. Inténtalo de nuevo.',
} as const;

export class UsersService {
  private static handleError(error: unknown, message: string): never {
    console.error('UsersService Error:', error);
    throw new Error(message);
  }

  static async createUser(userData: UserDTO): Promise<UserDTO> {
    try {
      // Adaptar formato para el backend Spring Boot
      const springBootUserData = {
        userName: userData.userName,
        password: userData.password,
        role: userData.role
      };
      return await apiClient.post<UserDTO>(`${API_ENDPOINTS.USERS.replace('/get-all-users', '')}/create-user`, springBootUserData);
    } catch (error) {
      this.handleError(error, ERROR_MESSAGES.CREATE);
    }
  }

  static async editUser(userId: number, userData: UserDTO): Promise<UserDTO> {
    try {
      const springBootUserData = {
        userId: userId,
        userName: userData.userName,
        password: userData.password,
        role: userData.role
      };
      return await apiClient.put<UserDTO>(
        `${API_ENDPOINTS.USERS.replace('/get-all-users', '')}/update-user`,
        springBootUserData
      );
    } catch (error) {
      this.handleError(error, ERROR_MESSAGES.UPDATE);
    }
  }

  static async getUserById(userId: number): Promise<UserDTO> {
    try {
      return await apiClient.get<UserDTO>(
        `${API_ENDPOINTS.USER_BY_ID}?userId=${userId}`
      );
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
      return await apiClient.delete<string>(
        `${API_ENDPOINTS.USERS.replace('/get-all-users', '')}/delete-user?userId=${userId}`
      );
    } catch (error) {
      this.handleError(error, ERROR_MESSAGES.DELETE);
    }
  }
}