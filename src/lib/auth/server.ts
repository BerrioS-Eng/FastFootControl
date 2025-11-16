import "server-only";
import {cookies} from "next/headers";
import {http} from "@/lib/api/http";
import {ENDPOINTS} from "@/lib/config";
import type {Role, UserLoginResponse} from "@/lib/auth/types";

export async function getCurrentUser(): Promise<UserLoginResponse | null> {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth_token")?.value;
    if (!token) return null;
    try {
        return await http<UserLoginResponse>(ENDPOINTS.users, "/me", {
            headers: {Authorization: `Bearer ${token}`},
            cache: "no-store",
        });
    } catch {
        return null;
    }
}

export function hasRole(user: { role?: Role } | null | undefined, roles: Role | Role[]): boolean {
    if (!user?.role) return false;
    const list = Array.isArray(roles) ? roles : [roles];
    return list.includes(user.role);
}

export async function requireRole(roles: Role | Role[]) {
    const user = await getCurrentUser();
    if (!hasRole(user, roles)) return null; // el caller decide redirigir
    return user;
}