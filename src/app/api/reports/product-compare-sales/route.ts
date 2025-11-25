import { NextResponse } from "next/server";
import { ENDPOINTS } from "@/lib/config";
import { httpBackend } from "@/lib/api/http-backend";
import { ensureRole } from "@/lib/auth/rbac";
import { handleApiError } from "@/lib/api/route-utils";
import type { ProductSalesCompareResponse } from "@/app/dashboard/reports/types";

export async function GET(req: Request) {
    try {
        await ensureRole(["ADMIN", "WORKER"]);
        const url = new URL(req.url);
        const productId1 = url.searchParams.get("productId1");
        const productId2 = url.searchParams.get("productId2");
        if (!productId1 || !productId2) {
            return NextResponse.json({ message: "productId1 y productId2 son requeridos" }, { status: 400 });
        }
        const query = new URLSearchParams({ productId1, productId2 });
        const data = await httpBackend<ProductSalesCompareResponse[]>(
            ENDPOINTS.reports,
            `/product-sales-compare?${query.toString()}`,
            { method: "GET" }
        );
        return NextResponse.json(data, { status: 200 });
    } catch (e) {
        return handleApiError(e);
    }
}