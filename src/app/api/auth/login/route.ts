import { NextResponse } from "next/server";
import { ENDPOINTS } from "@/lib/config";
import type { LoginRequest, LoginResponse } from "@/lib/auth/types";
import {http} from "@/lib/api/http";

export async function POST(req: Request) {
    try {
        const body = (await req.json()) as LoginRequest;
        const data = await http<LoginResponse>(ENDPOINTS.auth, "/login", {
            method: "POST",
            body: JSON.stringify(body),
        });

        const res = NextResponse.json({ user: data.user }, { status: 200 });

        res.cookies.set("auth_token", data.token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            path: "/",
            maxAge: 60 * 60 * 8,
        });

        return res;
    } catch (e: any) {
        // http() arroja Error con message del backend o `HTTP <status>`
        const message = e?.message || "Credenciales inválidas";
        return NextResponse.json({ message }, { status: 401 });
    }
}