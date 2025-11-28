import type { UserCreateRequest, UserDTO, UserEditRequest } from "@/lib/auth/types";
import { UsersAPI } from "@/app/dashboard/users/api/users";

export const UsersService = {
    async getAllUsers(): Promise<UserDTO[]> {
        return UsersAPI.getAll();
    },

    async getUserById(userId: number): Promise<UserDTO> {
        return UsersAPI.getById(userId);
    },

    async createUser(payload: UserCreateRequest): Promise<UserDTO> {
        return UsersAPI.create(payload);
    },

    async editUser(userId: number, payload: UserEditRequest): Promise<UserDTO> {
        return UsersAPI.edit(userId, payload);
    },

    async deleteUser(userId: number): Promise<string> {
        return UsersAPI.delete(userId);
    },

    getCurrent: () => UsersAPI.currentUser(),
};