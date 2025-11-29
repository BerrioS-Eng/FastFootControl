import {http} from "@/lib/api/http";
import {getServerAuthSession} from "@/lib/auth/auth";

export async function httpBackend<T>(baseUrl: string, input: string, init?: RequestInit) {
    const session = await getServerAuthSession();

    if (!session?.accessToken) {
        throw new Error("No autorizado");
    }

    return http<T>(baseUrl, input, {
        ...init,
        headers: {
            ...(init?.headers || {}),
            Authorization: `Bearer ${session.accessToken}`,
        },
    });
}