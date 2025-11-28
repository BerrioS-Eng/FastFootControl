import {NextResponse} from "next/server";
import {ENDPOINTS} from "@/lib/config";
import {httpBackend} from "@/lib/api/http-backend";
import {ensureRole} from "@/lib/auth/rbac";

type UsersRouteParams = {
    params: Promise<{ action: string }>;
};

export async function POST(req: Request, context: UsersRouteParams) {
    await ensureRole("ADMIN");
    const {action} = await context.params; // "create-user" o similar
    const body = await req.text();
    const res = await httpBackend(ENDPOINTS.users, `/${action}`, {
        method: "POST",
        body,
        headers: {"Content-Type": "application/json"},
    });
    return NextResponse.json(res as any);
}

export async function PUT(req: Request, context: UsersRouteParams) {
    await ensureRole("ADMIN");
    const {action} = await context.params; // "edit-user"
    const url = new URL(req.url);
    const qs = url.search; // reenvía ?userId=...
    const body = await req.text();
    const res = await httpBackend(ENDPOINTS.users, `/${action}${qs}`, {
        method: "PUT",
        body,
        headers: {"Content-Type": "application/json"},
    });
    return NextResponse.json(res as any);
}

export async function GET(_req: Request, context: UsersRouteParams) {
    await ensureRole("ADMIN");
    const {action} = await context.params; // "get-user" | "get-all-users"
    const url = new URL(_req.url);
    const qs = url.search;
    const res = await httpBackend(ENDPOINTS.users, `/${action}${qs}`, {method: "GET"});
    return NextResponse.json(res as any);
}

export async function DELETE(_req: Request, context: UsersRouteParams) {
    await ensureRole("ADMIN");
    const {action} = await context.params; // "delete-user"
    const url = new URL(_req.url);
    const qs = url.search;
    const res = await httpBackend(ENDPOINTS.users, `/${action}${qs}`, {method: "DELETE"});
    return NextResponse.json(res as any);
}