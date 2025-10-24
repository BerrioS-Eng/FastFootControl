import { http } from "@/lib/api/http";
import { ENDPOINTS } from "@/lib/config";
import type { TopProduct } from "../types";

export const ReportsAPI = {
    getTopProducts: (startDate: string, endDate: string, topNumber = 2) =>
        http<TopProduct[]>(
            ENDPOINTS.reports,
            `/top-products?startDate=${startDate}&endDate=${endDate}&topNumber=${topNumber}`
        ),
};