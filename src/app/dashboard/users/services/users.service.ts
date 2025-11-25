import type { UserCreateRequest, UserDTO, UserEditRequest } from "@/app/dashboard/users/types";
import {ENDPOINTS} from "@/lib/config";
import {http} from "@/lib/api/http";
import {UserLoginResponse} from "@/lib/auth/types";

export const UsersService = {
    async getAllUsers(): Promise<UserDTO[]> {
        return http<UserDTO[]>(ENDPOINTS.users, "/get-all-users", {
            method: "GET",
        });
    },

    async getUserById(userId: number): Promise<UserDTO> {
        return http<UserDTO>(ENDPOINTS.users, `/get-user?userId=${userId}`, {
            method: "GET",
        });
    },

    async createUser(payload: UserCreateRequest): Promise<UserDTO> {
        return http<UserDTO>(ENDPOINTS.users, "/create-user", {
            method: "POST",
            body: JSON.stringify(payload),
        });
    },

    async editUser(userId: number, payload: UserEditRequest): Promise<UserDTO> {
        return http<UserDTO>(ENDPOINTS.users, `/edit-user?userId=${userId}`, {
            method: "PUT",
            body: JSON.stringify(payload),
        });
    },

    async deleteUser(userId: number): Promise<string> {
        return http<string>(ENDPOINTS.users, `/delete-user?userId=${userId}`, {
            method: "DELETE",
        });
    },

    async getCurrentUser(): Promise<UserLoginResponse> {
        return http<UserLoginResponse>(ENDPOINTS.users, "/me", {
            method: "GET",
            // Tu helper http debería adjuntar automáticamente el Authorization: Bearer <token>
        });
    },
};