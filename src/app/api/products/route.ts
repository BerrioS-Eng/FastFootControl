import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { ENDPOINTS } from "@/lib/config";
import { ensureRole } from "@/lib/auth/rbac";
import { handleApiError } from "@/lib/api/route-utils";

export async function POST(req: Request) {
    try {
        await ensureRole(["ADMIN", "WORKER"]);

        const form = await req.formData();
        const token = (await cookies()).get("auth_token")?.value;
        if (!token) throw Object.assign(new Error("No autorizado"), { status: 401 });

        // Reenvía multipart al backend sin fijar Content-Type
        const backendRes = await fetch(`${ENDPOINTS.products}/create-product`, {
            method: "POST",
            body: form,
            headers: { Authorization: `Bearer ${token}` },
            cache: "no-store",
        });

        const data = await backendRes.json().catch(() => ({}));
        if (!backendRes.ok) throw Object.assign(new Error((data as any)?.message || `HTTP ${backendRes.status}`), { status: backendRes.status });

        return NextResponse.json(data, { status: 201 });
    } catch (e) {
        return handleApiError(e);
    }
}