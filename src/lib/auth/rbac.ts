import { getServerAuthSession } from "@/lib/auth/auth";

type AllowedRoles = "ADMIN" | "WORKER";
type RoleRequirement = AllowedRoles | AllowedRoles[];

/**
 * Verifica que exista sesión y que el rol del usuario cumpla el requisito.
 * Lanza errores con `status` para que `handleApiError` los convierta en 401/403.
 */
export async function ensureRole(required?: RoleRequirement): Promise<void> {
    const session = await getServerAuthSession();

    if (!session) {
        const err: any = new Error("No autenticado");
        err.status = 401;
        throw err;
    }

    if (!required) {
        // Solo autenticación requerida, sin restricción de rol
        return;
    }

    const userRole = session.user?.role as AllowedRoles | undefined;

    const rolesArray = Array.isArray(required) ? required : [required];

    if (!userRole || !rolesArray.includes(userRole)) {
        const err: any = new Error("No autorizado");
        err.status = 403;
        throw err;
    }
}