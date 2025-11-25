import { http } from "@/lib/api/http";
import type {
    TopProduct,
    SalesSummaryProjection,
    MonthlySales,
    GrowMonthlyRatio,
    SalesCompare,
    ProductSalesCompareResponse,
} from "../types";

export const ReportsAPI = {
    // Top products
    getTopProducts: (startDate: string, endDate: string, topNumber = 2) =>
        http<TopProduct[]>("", `/api/reports/top-products?startDate=${startDate}&endDate=${endDate}&topNumber=${topNumber}`),

    // Sales summary
    getSalesSummary: (startDate: string, endDate?: string) => {
        const q = new URLSearchParams({ startDate });
        if (endDate) q.set("endDate", endDate);
        return http<SalesSummaryProjection[]>("", `/api/reports/sales-summary?${q.toString()}`);
    },

    // Monthly sales
    getMonthlySales: (startDate: string, endDate?: string) => {
        const q = new URLSearchParams({ startDate });
        if (endDate) q.set("endDate", endDate);
        return http<MonthlySales[]>("", `/api/reports/monthly-sales?${q.toString()}`);
    },

    // Sales growth
    getSalesGrowth: (startDate: string, endDate: string) =>
        http<GrowMonthlyRatio[]>("", `/api/reports/sales-growth?startDate=${startDate}&endDate=${endDate}`),

    // Compare sales
    compareSales: (startDate1: string, endDate1: string, startDate2: string, endDate2: string) => {
        const q = new URLSearchParams({ startDate1, endDate1, startDate2, endDate2 });
        return http<SalesCompare>("", `/api/reports/compare-sales?${q.toString()}`);
    },

    // Compare product sales
    compareProductSales: (productId1: number, productId2: number) =>
      http<ProductSalesCompareResponse[]>("", `/api/reports/product-compare-sales?productId1=${productId1}&productId2=${productId2}`),
  };