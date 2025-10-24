export type ProductId = number;
export type CostItem = { name: string; cost: number };

export interface Product {
    id: ProductId;
    name: string;
    ingredients: CostItem[];
    directCosts: CostItem[];
    labour: number;
    profitMargin: number;
    netPrice: number;
    salePrice: number;
    imageUrl: string;
}

export interface ProductFilters {
    search?: string;
    page?: number;
    pageSize?: number;
    sortBy?: keyof Product;
    sortDir?: 'asc' | 'desc';
}

export type ProductSale = {
    id: ProductId;
    product: string;
    quantity: number;
    salePrice: number;
    totalPrice: number;
};