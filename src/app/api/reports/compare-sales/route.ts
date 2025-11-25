import { NextResponse } from "next/server";
import { ENDPOINTS } from "@/lib/config";
import { httpBackend } from "@/lib/api/http-backend";
import { ensureRole } from "@/lib/auth/rbac";
import { handleApiError } from "@/lib/api/route-utils";
import type { SalesCompare } from "@/app/dashboard/reports/types";

export async function GET(req: Request) {
    try {
        await ensureRole(["ADMIN", "WORKER"]);
        const url = new URL(req.url);
        const startDate1 = url.searchParams.get("startDate1");
        const endDate1 = url.searchParams.get("endDate1");
        const startDate2 = url.searchParams.get("startDate2");
        const endDate2 = url.searchParams.get("endDate2");
        if (!startDate1 || !endDate1 || !startDate2 || !endDate2) {
            return NextResponse.json({ message: "Todos los parámetros de rango son requeridos" }, { status: 400 });
        }
        const query = new URLSearchParams({ startDate1, endDate1, startDate2, endDate2 });
        const data = await httpBackend<SalesCompare>(
            ENDPOINTS.reports,
            `/compare-sales?${query.toString()}`,
            { method: "GET" }
        );
        return NextResponse.json(data, { status: 200 });
    } catch (e) {
        return handleApiError(e);
    }
}