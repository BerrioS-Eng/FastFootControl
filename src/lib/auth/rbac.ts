import { getCurrentUser } from "./server";
import type { Role } from "@/lib/auth/types";

export async function ensureRole(roles: Role | Role[]) {
    const user = await getCurrentUser();
    const allow = user && (Array.isArray(roles) ? roles.includes(user.role) : user.role === roles);
    if (!allow) {
        const needed = Array.isArray(roles) ? roles.join(", ") : roles;
        throw Object.assign(new Error(`Acceso restringido. Requiere rol: ${needed}`), { status: 403 });
    }
    return user!;
}