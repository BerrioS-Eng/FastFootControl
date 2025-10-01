import { ProductSale } from "../../products/types";

export type SaleFormData = {
  id: string;
  concept: string;
  salePrice: number;
  totalPrice: number;
  paymentMethod: string;
  products: ProductSale[];
};

export type SaleInProgress = {
  id: string;
  concept: string;
  totalPrice: number;
  paymentMethod: string;
  //products: ProductSale[];
};