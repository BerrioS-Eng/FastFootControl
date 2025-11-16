import { cookies } from "next/headers";
import { http } from "@/lib/api/http";

export async function httpBackend<T>(baseUrl: string, input: string, init?: RequestInit) {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth_token")?.value;
    if (!token) throw new Error("No autorizado");
    return http<T>(baseUrl, input, {
        ...init,
        headers: {
            ...(init?.headers || {}),
            Authorization: `Bearer ${token}`,
        },
    });
}