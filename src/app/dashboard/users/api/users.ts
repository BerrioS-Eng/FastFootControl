"use client";

import { http } from "@/lib/api/http";
import type { UserCreateRequest, UserDTO, UserEditRequest } from "@/lib/auth/types";

export const UsersAPI = {
    currentUser: () =>
        http<UserDTO>("", "/api/auth/me", {
            method: "GET",
        }),

    getAll: () =>
        http<UserDTO[]>("", "/api/users/get-all-users", {
            method: "GET",
        }),

    getById: (userId: number) =>
        http<UserDTO>("", `/api/users/get-user?userId=${userId}`, {
            method: "GET",
        }),

    create: (payload: UserCreateRequest) =>
        http<UserDTO>("", "/api/users/create-user", {
            method: "POST",
            body: JSON.stringify(payload),
        }),

    edit: (userId: number, payload: UserEditRequest) =>
        http<UserDTO>("", `/api/users/edit-user?userId=${userId}`, {
            method: "PUT",
            body: JSON.stringify(payload),
        }),

    delete: (userId: number) =>
        http<string>("", `/api/users/delete-user?userId=${userId}`, {
            method: "DELETE",
        }),
};