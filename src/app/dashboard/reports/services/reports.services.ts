import { ReportsAPI } from "@/app/dashboard/reports/api/reports";
import type {
    TopProduct,
    SalesSummaryProjection,
    MonthlySales,
    GrowMonthlyRatio,
    SalesCompare,
    ProductSalesCompareResponse,
} from "@/app/dashboard/reports/types";

export const reportsService = {
    getTopProductsByDay: async (dateYmd: string, topNumber = 2): Promise<TopProduct[]> => {
        return ReportsAPI.getTopProducts(dateYmd, dateYmd, topNumber);
    },
    getTopProducts: (startDate: string, endDate: string, topNumber = 5) =>
        ReportsAPI.getTopProducts(startDate, endDate, topNumber),

    getSalesSummary: (startDate: string, endDate?: string) =>
        ReportsAPI.getSalesSummary(startDate, endDate),

    getMonthlySales: (startDate: string, endDate?: string) =>
        ReportsAPI.getMonthlySales(startDate, endDate),

    getSalesGrowth: (startDate: string, endDate: string) =>
        ReportsAPI.getSalesGrowth(startDate, endDate),

    compareSales: (startDate1: string, endDate1: string, startDate2: string, endDate2: string) =>
        ReportsAPI.compareSales(startDate1, endDate1, startDate2, endDate2),

    compareProductSales: (productId1: number, productId2: number) =>
        ReportsAPI.compareProductSales(productId1, productId2),
};