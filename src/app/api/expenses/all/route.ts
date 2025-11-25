import { NextResponse } from "next/server";
import { ENDPOINTS } from "@/lib/config";
import { httpBackend } from "@/lib/api/http-backend";
import { ensureRole } from "@/lib/auth/rbac";
import { handleApiError } from "@/lib/api/route-utils";
import type { ExpenseDTO } from "@/app/dashboard/expenses/types";

// GET /api/expenses/all
export async function GET() {
    try {
        await ensureRole(["ADMIN"]);
        const list = await httpBackend<ExpenseDTO[]>(ENDPOINTS.expenses, "/get-all-expenses", { method: "GET" });
        return NextResponse.json(list, { status: 200 });
    } catch (e) {
        return handleApiError(e);
    }
}