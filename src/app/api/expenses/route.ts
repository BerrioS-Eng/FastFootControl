import {NextResponse} from "next/server";
import {ENDPOINTS} from "@/lib/config";
import {httpBackend} from "@/lib/api/http-backend";
import {ensureRole} from "@/lib/auth/rbac";
import {handleApiError} from "@/lib/api/route-utils";
import type {ExpenseDTO} from "@/app/dashboard/expenses/types";

// POST /api/expenses → crear gasto
export async function POST(req: Request) {
    try {
        await ensureRole(["ADMIN", "WORKER"]);
        const body = await req.text();
        const created = await httpBackend<ExpenseDTO>(
            ENDPOINTS.expenses,
            "/create-expense",
            {method: "POST", body, headers: {"Content-Type": "application/json"}}
        );
        return NextResponse.json(created, {status: 201});
    } catch (e) {
        return handleApiError(e);
    }
}

// GET /api/expenses → por día o por rango de fechas
export async function GET(req: Request) {
    try {
        await ensureRole(["ADMIN"]);

        const url = new URL(req.url);
        const date = url.searchParams.get("date");
        const startDate = url.searchParams.get("startDate");
        const endDate = url.searchParams.get("endDate");

        if (date) {
            // /get-expenses-by-day?date=YYYY-MM-DD
            const data = await httpBackend<ExpenseDTO[]>(
                ENDPOINTS.expenses,
                `/get-expenses-by-day?date=${encodeURIComponent(date)}`,
                {method: "GET"}
            );
            return NextResponse.json(data, {status: 200});
        }

        if (startDate && endDate) {
            // /get-expenses-by-date-range?startDate=...&endDate=...
            const qs = new URLSearchParams({
                startDate,
                endDate,
            }).toString();

            const data = await httpBackend<ExpenseDTO[]>(
                ENDPOINTS.expenses,
                `/get-expenses-by-date-range?${qs}`,
                {method: "GET"}
            );
            return NextResponse.json(data, {status: 200});
        }

        // Si no se pasan parámetros, devolvemos error explícito
        return NextResponse.json(
            {message: "Debe especificar 'date' o 'startDate' y 'endDate'"},
            {status: 400}
        );
    } catch (e) {
        return handleApiError(e);
    }
}