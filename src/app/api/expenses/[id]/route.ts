import { NextResponse } from "next/server";
import { ENDPOINTS } from "@/lib/config";
import { httpBackend } from "@/lib/api/http-backend";
import { ensureRole } from "@/lib/auth/rbac";
import { handleApiError } from "@/lib/api/route-utils";
import type { ExpenseDTO } from "@/app/dashboard/expenses/types";

type ExpensesRouteParams = {
    params: Promise<{ id: string }>;
};

export async function PUT(req: Request, context: ExpensesRouteParams) {
    try {
        await ensureRole("ADMIN");

        const { id } = await context.params; // ⬅️ aquí hacemos await de params
        const body = await req.text();

        const updated = await httpBackend<ExpenseDTO>(
            ENDPOINTS.expenses,
            `/edit-expense?expenseId=${encodeURIComponent(id)}`,
            {
                method: "PUT",
                body,
                headers: { "Content-Type": "application/json" },
            },
        );

        return NextResponse.json(updated, { status: 200 });
    } catch (e) {
        return handleApiError(e);
    }
}

export async function DELETE(_req: Request, context: ExpensesRouteParams) {
    try {
        await ensureRole("ADMIN");

        const { id } = await context.params;

        await httpBackend<void>(
            ENDPOINTS.expenses,
            `/delete-expense?expenseId=${encodeURIComponent(id)}`,
            { method: "DELETE" },
        );

        return NextResponse.json({ ok: true }, { status: 200 });
    } catch (e) {
        return handleApiError(e);
    }
}

export async function GET(_req: Request, context: ExpensesRouteParams) {
    try {
        await ensureRole("ADMIN");

        const { id } = await context.params;

        const expense = await httpBackend<ExpenseDTO>(
            ENDPOINTS.expenses,
            `/get-expense?expenseId=${encodeURIComponent(id)}`,
            { method: "GET" },
        );

        return NextResponse.json(expense, { status: 200 });
    } catch (e) {
        return handleApiError(e);
    }
}