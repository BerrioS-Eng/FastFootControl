import { NextResponse } from "next/server";
import { ENDPOINTS } from "@/lib/config";
import { http } from "@/lib/api/http";
import { handleApiError } from "@/lib/api/route-utils";
import type { ProductDTO } from "@/app/dashboard/products/types/dto";

export async function GET() {
    try {
        const list = await http<ProductDTO[]>(ENDPOINTS.products, "/get-all-products", { method: "GET" });
        return NextResponse.json(list, { status: 200 });
    } catch (e) {
        return handleApiError(e);
    }
}