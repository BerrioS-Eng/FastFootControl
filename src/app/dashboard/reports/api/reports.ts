import { http } from "@/lib/api/http";
import type { TopProduct } from "../types";

export const ReportsAPI = {
    getTopProducts: (startDate: string, endDate: string, topNumber = 2) =>
        http<TopProduct[]>("", `/api/reports/top-products?startDate=${startDate}&endDate=${endDate}&topNumber=${topNumber}`),

    //
    // getTopProductsByDay: (date: string, topNumber = 2) =>
    //   http<TopProduct[]>("", `/api/reports/top-products/by-day?date=${date}&topNumber=${topNumber}`),
};