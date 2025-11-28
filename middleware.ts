import { NextRequest, NextResponse } from "next/server";

const PROTECTED_PREFIX = "/dashboard";

// Rutas que solo puede acceder ADMIN
const ADMIN_ONLY_PATHS = [
    "/dashboard/users",
    "/dashboard/products",
    "/dashboard/reports",
    "/dashboard/expenses",
];

async function getUserFromMe(req: NextRequest) {
    // Construimos la URL absoluta hacia /api/auth/me
    const meUrl = new URL("/api/auth/me", req.nextUrl.origin);

    // Reenviar cookies para que /api/auth/me pueda leer el token
    const res = await fetch(meUrl, {
        method: "GET",
        headers: {
            cookie: req.headers.get("cookie") ?? "",
        },
        cache: "no-store",
    });

    if (!res.ok) return null;
    const data = await res.json();
    return data.user ?? null;
}

export async function middleware(req: NextRequest) {
    const { pathname } = req.nextUrl;

    // Si la ruta no empieza por /dashboard, no tocamos nada
    if (!pathname.startsWith(PROTECTED_PREFIX)) {
        return NextResponse.next();
    }

    // Verificar que haya usuario (vía /api/auth/me)
    const user = await getUserFromMe(req);

    if (!user) {
        // No autenticado → redirigimos a login
        const loginUrl = req.nextUrl.clone();
        loginUrl.pathname = "/login";
        loginUrl.searchParams.set("from", pathname);
        return NextResponse.redirect(loginUrl);
    }

    const role = user.role as "ADMIN" | "WORKER";

    // Revisar si la ruta es solo-ADMIN
    const isAdminRoute = ADMIN_ONLY_PATHS.some(
        (basePath) =>
            pathname === basePath || pathname.startsWith(`${basePath}/`),
    );

    if (isAdminRoute && role !== "ADMIN") {
        // Usuario autenticado pero sin permisos → redirigir a dashboard home
        const dashboardUrl = req.nextUrl.clone();
        dashboardUrl.pathname = "/dashboard";
        return NextResponse.redirect(dashboardUrl);
    }

    // Si pasa todas las validaciones, seguimos
    return NextResponse.next();
}

// Matcher para que el middleware solo se ejecute en /dashboard/*
export const config = {
    matcher: ["/dashboard/:path*"],
};