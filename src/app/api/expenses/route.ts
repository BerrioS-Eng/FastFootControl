import { NextResponse } from "next/server";
import { ENDPOINTS } from "@/lib/config";
import { httpBackend } from "@/lib/api/http-backend";
import { ensureRole } from "@/lib/auth/rbac";
import { handleApiError } from "@/lib/api/route-utils";
import type { ExpenseDTO } from "@/app/dashboard/expenses/types";

// POST /api/expenses → crear gasto
export async function POST(req: Request) {
    try {
        await ensureRole(["ADMIN", "WORKER"]);
        const body = await req.text();
        const created = await httpBackend<ExpenseDTO>(
            ENDPOINTS.expenses,
            "/create-expense",
            { method: "POST", body, headers: { "Content-Type": "application/json" } }
        );
        return NextResponse.json(created, { status: 201 });
    } catch (e) {
        return handleApiError(e);
    }
}