export interface TopProduct {
    productId: number;
    productName: string;
    salePrice: number;
    totalSold: number;
    totalSalesValue: number;
}
export interface SalesSummaryProjection {
    date: string; // YYYY-MM-DD (serializado desde LocalDate)
    totalSales: number;
    totalOrders: number;
}

export interface MonthlySales {
    year: number;
    month: number; // 1-12
    totalSales: number;
}

export interface GrowMonthlyRatio {
    months: string; // Ej: "2024-05→2024-06"
    growthRatio: number; // 0.12 = 12%
}

export interface SalesCompare {
    totalPeriod1: number;
    totalPeriod2: number;
    diff: number; // total2 - total1
    growthPercentage: number; // 0.12 = 12%
}

export interface ProductSalesCompareResponse {
    productName: string;
    totalUnitSold: number;
    totalSalesValue: number;
    unitsDiff: number;
    salesValueDiff: number;
}

export interface LessSoldProduct {
    productId: number;
    productName: string;
    salePrice: number;
    totalSold: number;
    totalSalesValue: number;
}