import {NextResponse} from "next/server";
import {ENDPOINTS} from "@/lib/config";
import {ensureRole} from "@/lib/auth/rbac";
import {handleApiError} from "@/lib/api/route-utils";
import {getServerAuthSession} from "@/lib/auth/auth";

export async function POST(req: Request) {
    try {
        await ensureRole(["ADMIN", "WORKER"]);

        const session = await getServerAuthSession();
        if (!session?.accessToken) {
            const err: any = new Error("No autenticado");
            err.status = 401;
            throw err;
        }

        const form = await req.formData();

        // Reenvía multipart al backend usando el accessToken de NextAuth
        const backendRes = await fetch(`${ENDPOINTS.products}/create-product`, {
            method: "POST",
            body: form,
            headers: {Authorization: `Bearer ${session.accessToken}`},
            cache: "no-store",
        });

        const data = await backendRes.json().catch(() => ({}));
        if (!backendRes.ok) {
            const err: any = new Error(
                (data as any)?.message || `HTTP ${backendRes.status}`
            );
            err.status = backendRes.status;
            throw err;
        }

        return NextResponse.json(data, {status: 201});
    } catch (e) {
        return handleApiError(e);
    }
}