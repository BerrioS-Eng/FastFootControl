import { NextResponse } from "next/server";
import { ENDPOINTS } from "@/lib/config";
import { httpBackend } from "@/lib/api/http-backend";
import { ensureRole } from "@/lib/auth/rbac";
import { handleApiError } from "@/lib/api/route-utils";
import type { GrowMonthlyRatio } from "@/app/dashboard/reports/types";

export async function GET(req: Request) {
    try {
        await ensureRole(["ADMIN", "WORKER"]);
        const url = new URL(req.url);
        const startDate = url.searchParams.get("startDate");
        const endDate = url.searchParams.get("endDate");
        if (!startDate || !endDate) {
            return NextResponse.json({ message: "startDate y endDate son requeridos (YYYY-MM-DD)" }, { status: 400 });
        }
        const query = new URLSearchParams({ startDate, endDate });
        const data = await httpBackend<GrowMonthlyRatio[]>(
            ENDPOINTS.reports,
            `/sales-growth?${query.toString()}`,
            { method: "GET" }
        );
        return NextResponse.json(data, { status: 200 });
    } catch (e) {
        return handleApiError(e);
    }
}