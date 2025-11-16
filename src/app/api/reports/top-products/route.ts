import { NextResponse } from "next/server";
import { ENDPOINTS } from "@/lib/config";
import { httpBackend } from "@/lib/api/http-backend";
import { ensureRole } from "@/lib/auth/rbac";
import { handleApiError } from "@/lib/api/route-utils";
import type { TopProduct } from "@/app/dashboard/reports/types";

export async function GET(req: Request) {
    try {
        // WORKER, ADMIN
        await ensureRole(["ADMIN", "WORKER"]);

        const url = new URL(req.url);
        const startDate = url.searchParams.get("startDate");
        const endDate = url.searchParams.get("endDate");
        const topNumber = url.searchParams.get("topNumber") ?? "2";

        if (!startDate || !endDate) {
            return NextResponse.json(
                { message: "startDate y endDate son requeridos (YYYY-MM-DD)" },
                { status: 400 }
            );
        }

        const data = await httpBackend<TopProduct[]>(
            ENDPOINTS.reports,
            `/top-products?startDate=${encodeURIComponent(startDate)}&endDate=${encodeURIComponent(endDate)}&topNumber=${encodeURIComponent(topNumber)}`,
            { method: "GET" }
        );

        return NextResponse.json(data, { status: 200 });
    } catch (e) {
        return handleApiError(e);
    }
}