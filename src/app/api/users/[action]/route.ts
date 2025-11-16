import { NextResponse } from "next/server";
import { ENDPOINTS } from "@/lib/config";
import { httpBackend } from "@/lib/api/http-backend";
import { ensureRole } from "@/lib/auth/rbac";

export async function POST(req: Request, { params }: { params: { action: string } }) {
    await ensureRole("ADMIN");
    const action = params.action; // "create-user" o similar
    const body = await req.text();
    const res = await httpBackend(ENDPOINTS.users, `/${action}`, {
        method: "POST",
        body,
        headers: { "Content-Type": "application/json" },
    });
    return NextResponse.json(res as any);
}

export async function PUT(req: Request, { params }: { params: { action: string } }) {
    await ensureRole("ADMIN");
    const action = params.action; // "edit-user"
    const url = new URL(req.url);
    const qs = url.search; // reenvía ?userId=...
    const body = await req.text();
    const res = await httpBackend(ENDPOINTS.users, `/${action}${qs}`, {
        method: "PUT",
        body,
        headers: { "Content-Type": "application/json" },
    });
    return NextResponse.json(res as any);
}

export async function GET(_req: Request, { params }: { params: { action: string } }) {
    await ensureRole("ADMIN");
    const action = params.action; // "get-user" | "get-all-users"
    const url = new URL(_req.url);
    const qs = url.search;
    const res = await httpBackend(ENDPOINTS.users, `/${action}${qs}`, { method: "GET" });
    return NextResponse.json(res as any);
}

export async function DELETE(_req: Request, { params }: { params: { action: string } }) {
    await ensureRole("ADMIN");
    const action = params.action; // "delete-user"
    const url = new URL(_req.url);
    const qs = url.search;
    const res = await httpBackend(ENDPOINTS.users, `/${action}${qs}`, { method: "DELETE" });
    return NextResponse.json(res as any);
}