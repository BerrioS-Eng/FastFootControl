import { ReportsAPI } from "@/app/dashboard/reports/api/reports";
import type { TopProduct } from "@/app/dashboard/reports/types";

export const reportsService = {
    getTopProductsByDay: async (dateYmd: string, topNumber = 2): Promise<TopProduct[]> => {
        return ReportsAPI.getTopProducts(dateYmd, dateYmd, topNumber);
    },
};