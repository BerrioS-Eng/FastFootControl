export type CostItemDTO = { name: string; cost: number };

export interface ProductDTO {
    productId: number;
    productName: string;
    ingredients: CostItemDTO[] | string[];
    directCosts?: CostItemDTO[] | string[];
    labour?: number;
    profitMargin: number;
    netPrice: number;
    salePrice: number;
    imageUrl: string;
}

export interface ProductCreateRequest {
    productName: string;
    ingredients: CostItemDTO[];
    directCosts: CostItemDTO[];
    labour: number;
    profitMargin: number;
}

export interface ProductEditRequest {
    productName?: string;
    netPrice?: number;
    ingredients?: CostItemDTO[];
    directCosts?: CostItemDTO[];
    labour?: number;
    profitMargin?: number;
}

export interface ProductSaleTableDTO {
    productId: number;
    productName: string;
    salePrice: number;
}