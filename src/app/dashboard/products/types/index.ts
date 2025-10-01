
export type ProductSale = {
    id: string;
    product: string;
    quantity: number;
    salePrice: number;
    totalPrice: number;
}

export type Product = {
    productId: string;
    productName: string;
    netPrice: number;
    profitMargin: number;
    salePrice: number;
    imageUrl: string;
    ingredients: string[];
}