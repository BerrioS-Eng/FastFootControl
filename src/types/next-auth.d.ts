import NextAuth, { DefaultSession, DefaultUser } from "next-auth";
import {Role} from "@/lib/auth/types";

export type BackendUser = {
    userId: number; // mapeado desde userId (Long)
    userName: string; // mapeado desde userName
    role: Role;
};

declare module "next-auth" {
    interface Session {
        user: BackendUser & DefaultSession["user"];
        accessToken?: string;
    }

    interface User extends DefaultUser, BackendUser {
        accessToken?: string;
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        user?: BackendUser;
        accessToken?: string; // mapeado desde LoginResponse.token
    }
}