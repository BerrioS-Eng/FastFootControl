import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { ENDPOINTS } from "@/lib/config";
import type { UserLoginResponse } from "@/lib/auth/types";
import { http } from "@/lib/api/http";

export async function GET() {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth_token")?.value;
    if (!token) return NextResponse.json({ message: "No autorizado" }, { status: 401 });

    // Llama a tu backend. Implementa en backend un GET /auth/me que valide el token
    const user = await http<UserLoginResponse>(ENDPOINTS.users, "/me", {
        headers: { Authorization: `Bearer ${token}` },
        cache: "no-store",
    });

    return NextResponse.json({ user }, { status: 200 });
}