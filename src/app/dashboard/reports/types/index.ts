export interface TopProduct {
    productId: number;
    name: string;
    quantitySold: number; // o totalQuantity
    totalRevenue?: number; // opcional
}