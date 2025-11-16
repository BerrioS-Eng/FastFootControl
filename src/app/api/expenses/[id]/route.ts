import { NextResponse } from "next/server";
import { ENDPOINTS } from "@/lib/config";
import { httpBackend } from "@/lib/api/http-backend";
import { ensureRole } from "@/lib/auth/rbac";
import { handleApiError } from "@/lib/api/route-utils";
import type { ExpenseDTO } from "@/app/dashboard/expenses/types";

type Ctx = { params: { id: string } };

// GET /api/expenses/:id → ver detalle (ADMIN/WORKER)
export async function GET(_req: Request, { params }: Ctx) {
    try {
        await ensureRole(["ADMIN", "WORKER"]);
        const expense = await httpBackend<ExpenseDTO>(
            ENDPOINTS.expenses,
            `/get-expense-by-id?expenseId=${encodeURIComponent(params.id)}`,
            { method: "GET" }
        );
        return NextResponse.json(expense, { status: 200 });
    } catch (e) {
        return handleApiError(e);
    }
}

// PUT /api/expenses/:id → actualizar (solo ADMIN)
export async function PUT(req: Request, { params }: Ctx) {
    try {
        await ensureRole("ADMIN");
        const body = await req.text();
        const updated = await httpBackend<ExpenseDTO>(
            ENDPOINTS.expenses,
            `/edit-expense?expenseId=${encodeURIComponent(params.id)}`,
            { method: "PUT", body, headers: { "Content-Type": "application/json" } }
        );
        return NextResponse.json(updated, { status: 200 });
    } catch (e) {
        return handleApiError(e);
    }
}

// DELETE /api/expenses/:id → eliminar (solo ADMIN)
export async function DELETE(_req: Request, { params }: Ctx) {
    try {
        await ensureRole("ADMIN");
        await httpBackend<void>(
            ENDPOINTS.expenses,
            `/delete-expense?expenseId=${encodeURIComponent(params.id)}`,
            { method: "DELETE" }
        );
        return NextResponse.json({ ok: true }, { status: 200 });
    } catch (e) {
        return handleApiError(e);
    }
}