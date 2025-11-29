import {NextResponse} from "next/server";
import {ENDPOINTS} from "@/lib/config";
import {httpBackend} from "@/lib/api/http-backend";
import {ensureRole} from "@/lib/auth/rbac";
import {handleApiError} from "@/lib/api/route-utils";
import {SaleDTO} from "@/app/dashboard/sales/types";

export async function POST(req: Request) {
    try {
        await ensureRole(["ADMIN", "WORKER"]);

        const body = await req.text();
        const created = await httpBackend<SaleDTO>(ENDPOINTS.sales, "/register-sale", {
            method: "POST",
            body,
            headers: {"Content-Type": "application/json"},
        });

        return NextResponse.json(created, {status: 201});
    } catch (e) {
        return handleApiError(e);
    }
}

export async function GET(req: Request) {
    try {
        await ensureRole(["ADMIN", "WORKER"]);

        const {searchParams} = new URL(req.url);
        const date = searchParams.get("date");
        const query = date ? `/get-sales-by-day?date=${date}` : "";
        const list = await httpBackend<SaleDTO[]>(
            ENDPOINTS.sales,
            query,
            {method: "GET"}
        );

        return NextResponse.json(list, {status: 200});
    } catch (e) {
        return handleApiError(e);
    }
}