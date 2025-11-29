import {withAuth} from "next-auth/middleware";
import {NextResponse} from "next/server";

export default withAuth(
    function middleware(req) {
        const {pathname} = req.nextUrl;
        const token = req.nextauth.token as any;

        // Autorización por prefijo de ruta
        if (pathname.startsWith("/dashboard/admin")) {
            if (token?.user?.role !== "ADMIN") {
                const url = new URL("/dashboard", req.url);
                return NextResponse.redirect(url);
            }
        }

        return NextResponse.next();
    },
    {
        callbacks: {
            authorized: ({token}) => !!token, // requiere sesión para rutas del matcher
        },
        pages: {signIn: "/login"},
    }
);

export const config = {
    matcher: ["/dashboard/:path*"],
};