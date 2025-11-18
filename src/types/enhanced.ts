import { UserDTO, UserRole } from './api';

// Tipos para paginación
export interface PaginationMeta {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: PaginationMeta;
}

// Tipos para ordenamiento
export type SortDirection = 'asc' | 'desc';

export interface SortConfig {
  key: keyof UserDTO;
  direction: SortDirection;
}

// Tipos para filtros
export interface UserFilters {
  search?: string;
  role?: UserRole;
  isActive?: boolean;
  department?: string;
  dateRange?: {
    from: Date;
    to: Date;
  };
}

// Tipos para acciones en lote
export type BulkAction = 'activate' | 'deactivate' | 'delete' | 'changeRole';

export interface BulkActionRequest {
  action: BulkAction;
  userIds: number[];
  newRole?: UserRole;
}

// Tipos para exportación
export type ExportFormat = 'csv' | 'excel';

export interface ExportOptions {
  format: ExportFormat;
  includeInactive?: boolean;
  columns: (keyof UserDTO)[];
  filters?: UserFilters;
}

// Tipos para la tabla mejorada
export interface TableColumn<T> {
  key: keyof T;
  label: string;
  sortable?: boolean;
  render?: (value: any, item: T) => React.ReactNode;
  width?: string;
  align?: 'left' | 'center' | 'right';
}

export interface TableState {
  selectedIds: Set<number>;
  isAllSelected: boolean;
  sortConfig?: SortConfig;
  currentPage: number;
  itemsPerPage: number;
}

// Tipos para el estado de la aplicación
export interface LoadingState {
  users: boolean;
  creating: boolean;
  updating: boolean;
  deleting: boolean;
  bulkAction: boolean;
  exporting: boolean;
}

export interface ErrorState {
  users?: string;
  create?: string;
  update?: string;
  delete?: string;
  bulkAction?: string;
  export?: string;
}

// Tipos para React Query
export interface QueryConfig {
  page: number;
  limit: number;
  search?: string;
  filters?: UserFilters;
  sort?: SortConfig;
}

// Tipos para el perfil detallado
export interface UserProfile extends UserDTO {
  loginHistory?: LoginEntry[];
  activityLog?: ActivityEntry[];
  statistics?: UserStatistics;
}

export interface LoginEntry {
  id: number;
  loginTime: Date;
  ipAddress: string;
  userAgent: string;
  location?: string;
}

export interface ActivityEntry {
  id: number;
  action: string;
  description: string;
  timestamp: Date;
  metadata?: Record<string, any>;
}

export interface UserStatistics {
  totalLogins: number;
  lastLoginDays: number;
  sessionsThisMonth: number;
  avgSessionDuration: number;
}

// Tipos para accesibilidad
export interface AccessibilityProps {
  'aria-label'?: string;
  'aria-labelledby'?: string;
  'aria-describedby'?: string;
  role?: string;
  tabIndex?: number;
}

// Tipos para gestos táctiles
export type SwipeDirection = 'left' | 'right' | 'up' | 'down';

export interface SwipeGesture {
  direction: SwipeDirection;
  action: () => void;
  threshold?: number;
}

// Tipos para WebSockets
export interface WebSocketMessage {
  type: 'user_created' | 'user_updated' | 'user_deleted' | 'bulk_action';
  payload: any;
  timestamp: Date;
}

// Tipos para el cache
export interface CacheConfig {
  staleTime: number;
  cacheTime: number;
  refetchOnWindowFocus: boolean;
  refetchInterval?: number;
}