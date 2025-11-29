"use client";
import { useSession, signIn, signOut } from "next-auth/react";
import type { Role } from "@/types/next-auth";

export function useAuth() {
    const { data, status } = useSession();
    const user = data?.user;
    const role = user?.role as Role | undefined;
    return {
        user,
        role,
        accessToken: data?.accessToken,
        isAuthenticated: status === "authenticated",
        isLoading: status === "loading",
        signIn,
        signOut,
    };
}