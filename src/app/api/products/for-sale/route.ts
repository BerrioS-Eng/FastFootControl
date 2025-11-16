import { NextResponse } from "next/server";
import { ENDPOINTS } from "@/lib/config";
import { httpBackend } from "@/lib/api/http-backend";
import { ensureRole } from "@/lib/auth/rbac";
import { handleApiError } from "@/lib/api/route-utils";
import type { ProductSaleTableDTO } from "@/app/dashboard/products/types/dto";

export async function GET() {
    try {
        await ensureRole(["ADMIN", "WORKER"]);
        const list = await httpBackend<ProductSaleTableDTO[]>(ENDPOINTS.products, "/get-products-for-sale-table", { method: "GET" });
        return NextResponse.json(list, { status: 200 });
    } catch (e) {
        return handleApiError(e);
    }
}