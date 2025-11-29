import type {NextAuthOptions} from "next-auth";
import Credentials from "next-auth/providers/credentials";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL!;


type LoginResponse = {
    token: string;
    user: {
        userId: number; // Long en backend → number en TS
        userName: string;
        role: string; // valida contra tu enum
    };
};

async function loginOnBackend(credentials: { userName: string; password: string }) {
    const res = await fetch(`${API_BASE}/auth/login`, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(credentials),
    });

    if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err?.message || "Credenciales inválidas");
    }

    return (await res.json()) as LoginResponse;
}

export const authOptions: NextAuthOptions = {
    session: {strategy: "jwt"},
    providers: [
        Credentials({
            name: "Credentials",
            credentials: {
                userName: {label: "Usuario", type: "text"},
                password: {label: "Contraseña", type: "password"},
            },
            authorize: async (credentials) => {
                if (!credentials?.userName || !credentials?.password) return null;
                const {token, user} = await loginOnBackend({
                    userName: credentials.userName,
                    password: credentials.password,
                });
                // Mapeo a la forma interna de NextAuth User
                return {
                    id: user.userId,          // number
                    name: user.userName,      // string
                    role: user.role as any,   // Role
                    accessToken: token,       // guardamos el token del backend
                } as any;
            },
        }),
    ],
    callbacks: {
        async jwt({token, user}) {
            // Primer login: persistimos datos del usuario y el accessToken
            if (user) {
                token.user = {
                    userId: Number(user.id),
                    userName: user.name as string,
                    role: (user as any).role,
                };
                token.accessToken = (user as any).accessToken;
            }
            return token;
        },
        async session({session, token}) {
            if (token?.user) {
                session.user = token.user as any;
            }
            if (token?.accessToken) {
                session.accessToken = token.accessToken;
            }
            return session;
        },
    },
    pages: {
        signIn: "/login",
    },
};