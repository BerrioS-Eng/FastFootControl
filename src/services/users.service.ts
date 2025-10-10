// Users Service
import { apiClient, API_ENDPOINTS } from '@/lib/api-config';
import { UserDTO } from '@/types/api';

export class UsersService {
  static async createUser(userData: UserDTO): Promise<UserDTO> {
    try {
      return await apiClient.post<UserDTO>(
        API_ENDPOINTS.USERS.CREATE,
        userData
      );
    } catch (error) {
      console.error('Failed to create user:', error);
      throw new Error('Failed to create user. Please try again.');
    }
  }

  static async editUser(userId: number, userData: UserDTO): Promise<UserDTO> {
    try {
      return await apiClient.put<UserDTO>(
        `${API_ENDPOINTS.USERS.EDIT}?userId=${userId}`,
        userData
      );
    } catch (error) {
      console.error('Failed to edit user:', error);
      throw new Error('Failed to edit user. Please try again.');
    }
  }

  static async getUserById(userId: number): Promise<UserDTO> {
    try {
      return await apiClient.get<UserDTO>(
        `${API_ENDPOINTS.USERS.GET_BY_ID}?userId=${userId}`
      );
    } catch (error) {
      console.error('Failed to fetch user:', error);
      throw new Error('Failed to fetch user. Please try again.');
    }
  }

  static async getAllUsers(): Promise<UserDTO[]> {
    try {
      return await apiClient.get<UserDTO[]>(API_ENDPOINTS.USERS.GET_ALL);
    } catch (error) {
      console.error('Failed to fetch users:', error);
      throw new Error('Failed to fetch users. Please try again.');
    }
  }

  static async deleteUser(userId: number): Promise<string> {
    try {
      return await apiClient.delete<string>(
        `${API_ENDPOINTS.USERS.DELETE}?userId=${userId}`
      );
    } catch (error) {
      console.error('Failed to delete user:', error);
      throw new Error('Failed to delete user. Please try again.');
    }
  }
}