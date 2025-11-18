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

// Role definitions
export type UserRole = 'ADMIN' | 'WORKER' | 'MANAGER';
export type UserStatus = 'activo' | 'inactivo' | 'descanso';

export interface Permission {
  canViewUsers: boolean;
  canCreateUsers: boolean;
  canEditUsers: boolean;
  canDeleteUsers: boolean;
  canViewProducts: boolean;
  canCreateProducts: boolean;
  canEditProducts: boolean;
  canDeleteProducts: boolean;
  canViewSales: boolean;
  canCreateSales: boolean;
  canViewReports: boolean;
  canManageSettings: boolean;
}

// User Management
export interface UserDTO {
  id?: number;
  userId?: number;
  userName: string;
  password?: string;
  role: UserRole;
  fullName?: string;
  email?: string;
  area?: string;
  status?: UserStatus;
  isActive: boolean;
  lastLogin?: Date;
  createdAt?: Date;
  updatedAt?: Date;
  phone?: string;
  department?: string;
  profileImage?: string;
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