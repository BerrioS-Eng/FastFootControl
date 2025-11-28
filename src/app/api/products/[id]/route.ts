import {NextResponse} from "next/server";
import {ENDPOINTS} from "@/lib/config";
import {httpBackend} from "@/lib/api/http-backend";
import {ensureRole} from "@/lib/auth/rbac";
import {handleApiError} from "@/lib/api/route-utils";
import type {ProductDTO} from "@/app/dashboard/products/types/dto";

type Ctx = { params: { id: string } };

export async function GET(
    _req: Request,
    context: { params: Promise<{ id: string }> }
) {
    try {
        await ensureRole(["ADMIN", "WORKER"]);

        const {id} = await context.params;

        const data = await httpBackend<ProductDTO>(
            ENDPOINTS.products,
            `/get-product?productId=${encodeURIComponent(id)}`,
            {method: "GET"}
        );

        return NextResponse.json(data, {status: 200});
    } catch (e) {
        return handleApiError(e);
    }
}

export async function PUT(
    req: Request,
    context: { params: Promise<{ id: string }> }
) {
    try {
        await ensureRole("ADMIN");

        const {id} = await context.params;      // ⬅️ aquí hacemos await de params
        const body = await req.text();

        const updated = await httpBackend<ProductDTO>(
            ENDPOINTS.products,
            `/edit-product?productId=${encodeURIComponent(id)}`,
            {
                method: "PUT",
                body,
                headers: {"Content-Type": "application/json"},
            }
        );

        return NextResponse.json(updated, {status: 200});
    } catch (e) {
        return handleApiError(e);
    }
}

export async function DELETE(
    _req: Request,
    context: { params: Promise<{ id: string }> }
) {
    try {
        await ensureRole("ADMIN");

        const {id} = await context.params;

        await httpBackend<void>(
            ENDPOINTS.products,
            `/delete-product?productId=${encodeURIComponent(id)}`,
            {method: "DELETE"},
        );

        return NextResponse.json({ok: true}, {status: 200});
    } catch (e) {
        return handleApiError(e);
    }
}