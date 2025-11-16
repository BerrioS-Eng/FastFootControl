import { NextResponse, type NextRequest } from "next/server";

const PROTECTED_PREFIX = "/dashboard";

export function middleware(req: NextRequest) {
    const { pathname } = req.nextUrl;

    if (pathname.startsWith(PROTECTED_PREFIX)) {
        const token = req.cookies.get("auth_token")?.value;

        if (!token) {
            const loginUrl = req.nextUrl.clone();
            loginUrl.pathname = "/login";
            loginUrl.searchParams.set("from", pathname);
            return NextResponse.redirect(loginUrl);
        }

        // (Opcional avanzado) validar el token con /auth/me o decodificarlo aquí
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/dashboard/:path*"],
};