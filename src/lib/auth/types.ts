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

export type UserDTO = {
    userId: number;
    userName: string;
    role: Role;
    // Si más adelante agregas campos (email, area, status...) los añades aquí.
};

// Para creación (password requerido)
export type UserCreateRequest = {
    userName: string;
    password: string;
    role: Role;
};

// Para edición (password opcional)
export type UserEditRequest = {
    userName?: string;
    password?: string;
    role?: Role;
};