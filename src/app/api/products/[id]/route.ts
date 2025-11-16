import { NextResponse } from "next/server";
import { ENDPOINTS } from "@/lib/config";
import { httpBackend } from "@/lib/api/http-backend";
import { ensureRole } from "@/lib/auth/rbac";
import { handleApiError } from "@/lib/api/route-utils";
import type { ProductDTO } from "@/app/dashboard/products/types/dto";

type Ctx = { params: { id: string } };

export async function GET(_req: Request, { params }: Ctx) {
    try {
        await ensureRole(["ADMIN", "WORKER"]);
        const data = await httpBackend<ProductDTO>(ENDPOINTS.products, `/get-product?productId=${encodeURIComponent(params.id)}`, { method: "GET" });
        return NextResponse.json(data, { status: 200 });
    } catch (e) {
        return handleApiError(e);
    }
}

export async function PUT(req: Request, { params }: Ctx) {
    try {
        await ensureRole("ADMIN");
        const body = await req.text();
        const updated = await httpBackend<ProductDTO>(ENDPOINTS.products, `/edit-product?productId=${encodeURIComponent(params.id)}`, {
            method: "PUT",
            body,
            headers: { "Content-Type": "application/json" },
        });
        return NextResponse.json(updated, { status: 200 });
    } catch (e) {
        return handleApiError(e);
    }
}

export async function DELETE(_req: Request, { params }: Ctx) {
    try {
        await ensureRole("ADMIN");
        await httpBackend<void>(ENDPOINTS.products, `/delete-product?productId=${encodeURIComponent(params.id)}`, { method: "DELETE" });
        return NextResponse.json({ ok: true }, { status: 200 });
    } catch (e) {
        return handleApiError(e);
    }
}