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
