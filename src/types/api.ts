// Optimized API Types - Simplified and consolidated

// Authentication
export interface LoginRequest {
  userName: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: UserDTO;
  message: string;
}

// User Management
export interface UserDTO {
  userId?: number;
  userName: string;
  password?: string;
  role: string;
}

// Product Management
export interface ProductDTO {
  id?: number;
  name: string;
  description: string;
  price: number;
  category: string;
  imageUrl?: string;
  availability: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ProductRequest extends Omit<ProductDTO, 'id' | 'imageUrl' | 'createdAt' | 'updatedAt'> {
  image?: File;
}

// Sales Management
export interface ProductQuantity {
  productId: number;
  quantity: number;
  unitPrice: number;
}

export interface DirectCost {
  description: string;
  amount: number;
}

export interface SaleDTO {
  id?: number;
  saleDate: Date;
  totalAmount: number;
  userId: number;
  products: ProductQuantity[];
  directCosts: DirectCost[];
  createdAt?: Date;
  updatedAt?: Date;
}

export interface SaleRequest {
  userId: number;
  products: ProductQuantity[];
  directCosts: DirectCost[];
}

// Utilities
export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

export interface FormProps<T> {
  initialData?: T;
  onSubmit: (data: T) => void | Promise<void>;
  onCancel?: () => void;
  isLoading?: boolean;
}