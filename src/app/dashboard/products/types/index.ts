
// Re-export types from our centralized API types
export type { 
  ProductDTO as Product, 
  ProductRequest, 
  ProductEdit,
  ProductQuantity 
} from '@/types/api';

// Local types for the products dashboard
export type ProductSale = {
  id: string;
  product: string;
  quantity: number;
  salePrice: number;
  totalPrice: number;
}

// Legacy product type for backward compatibility (if needed)
export type LegacyProduct = {
  productId: string;
  productName: string;
  netPrice: number;
  profitMargin: number;
  salePrice: number;
  imageUrl: string;
  ingredients: string[];
}