// Types based on Backend DTOs

export interface LoginRequest {
  userName: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: UserDTO;
  message: string;
}

export interface UserDTO {
  id?: number;
  userName: string;
  password?: string;
  email: string;
  fullName: string;
  role: string;
  createdAt?: Date;
  updatedAt?: Date;
}

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

export interface ProductRequest {
  name: string;
  description: string;
  price: number;
  category: string;
  availability: boolean;
  image?: File;
}

export interface ProductEdit {
  name?: string;
  description?: string;
  price?: number;
  category?: string;
  availability?: boolean;
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

export interface ProductQuantity {
  productId: number;
  quantity: number;
  unitPrice: number;
}

export interface DirectCost {
  description: string;
  amount: number;
}

export interface Ingredient {
  id?: number;
  name: string;
  unitCost: number;
  unit: string;
}

// API Response wrapper
export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

// Common props for forms
export interface FormProps<T> {
  initialData?: T;
  onSubmit: (data: T) => void | Promise<void>;
  onCancel?: () => void;
  isLoading?: boolean;
}