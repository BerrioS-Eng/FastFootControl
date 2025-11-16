export type Role = "ADMIN" | "WORKER";

export type LoginRequest = {
    userName: string;
    password: string;
};

export type UserLoginResponse = {
    userId: string | number;
    userName: string;
    role: Role;
};

export type LoginResponse = {
    token: string; // JWT
    user: UserLoginResponse;
};