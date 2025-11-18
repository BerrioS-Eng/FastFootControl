import jwt from 'jsonwebtoken';
import { NextRequest } from 'next/server';
import { UserRole, Permission } from '@/types/api';

interface DecodedToken {
  sub: string; // username
  role: string; // role with ROLE_ prefix
  userId?: number;
  iat: number;
  exp: number;
}

// Definición de permisos por rol (igual que en el frontend)
const ROLE_PERMISSIONS: Record<UserRole, Permission> = {
  ADMIN: {
    canViewUsers: true,
    canCreateUsers: true,
    canEditUsers: true,
    canDeleteUsers: true,
    canViewProducts: true,
    canCreateProducts: true,
    canEditProducts: true,
    canDeleteProducts: true,
    canViewSales: true,
    canCreateSales: true,
    canViewReports: true,
    canManageSettings: true,
  },
  MANAGER: {
    canViewUsers: true,
    canCreateUsers: false,
    canEditUsers: false,
    canDeleteUsers: false,
    canViewProducts: true,
    canCreateProducts: true,
    canEditProducts: true,
    canDeleteProducts: false,
    canViewSales: true,
    canCreateSales: true,
    canViewReports: true,
    canManageSettings: false,
  },
  WORKER: {
    canViewUsers: false,
    canCreateUsers: false,
    canEditUsers: false,
    canDeleteUsers: false,
    canViewProducts: true,
    canCreateProducts: false,
    canEditProducts: false,
    canDeleteProducts: false,
    canViewSales: true,
    canCreateSales: true,
    canViewReports: false,
    canManageSettings: false,
  },
};

export function parseAuthHeader(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  if (!authHeader?.startsWith('Bearer ')) {
    return null;
  }
  
  return authHeader.substring(7); // Remove 'Bearer ' prefix
}

export function validateToken(token: string): DecodedToken | null {
  try {
    // Para el entorno de desarrollo, podemos usar una clave secreta simple
    // En producción, esto debe coincidir con la clave del backend
    const secret = process.env.JWT_SECRET || 'your-secret-key';
    
    const decoded = jwt.verify(token, secret) as DecodedToken;
    return decoded;
  } catch (error) {
    console.error('Token validation error:', error);
    return null;
  }
}

export function getUserRole(roleString: string): UserRole {
  // El backend envía roles como "ROLE_ADMIN", "ROLE_WORKER", etc.
  // Necesitamos extraer solo la parte del rol
  const cleanRole = roleString.replace('ROLE_', '');
  
  switch (cleanRole.toUpperCase()) {
    case 'ADMIN':
      return 'ADMIN';
    case 'MANAGER':
      return 'MANAGER';
    case 'WORKER':
    default:
      return 'WORKER';
  }
}

export function hasPermission(userRole: UserRole, permission: keyof Permission): boolean {
  const permissions = ROLE_PERMISSIONS[userRole];
  return permissions[permission];
}

export interface AuthValidationResult {
  isValid: boolean;
  user?: {
    username: string;
    role: UserRole;
    userId?: number;
  };
  error?: string;
}

export function validateAuth(request: NextRequest): AuthValidationResult {
  const token = parseAuthHeader(request);
  
  if (!token) {
    return {
      isValid: false,
      error: 'No se proporcionó token de autenticación'
    };
  }

  const decoded = validateToken(token);
  
  if (!decoded) {
    return {
      isValid: false,
      error: 'Token de autenticación inválido'
    };
  }

  const userRole = getUserRole(decoded.role);

  return {
    isValid: true,
    user: {
      username: decoded.sub,
      role: userRole,
      userId: decoded.userId
    }
  };
}

export function validatePermission(
  request: NextRequest, 
  requiredPermission: keyof Permission
): AuthValidationResult & { hasPermission?: boolean } {
  const authResult = validateAuth(request);
  
  if (!authResult.isValid || !authResult.user) {
    return authResult;
  }

  const userHasPermission = hasPermission(authResult.user.role, requiredPermission);
  
  if (!userHasPermission) {
    return {
      isValid: false,
      error: `No tienes permisos para realizar esta acción (${requiredPermission})`,
      hasPermission: false,
      user: authResult.user
    };
  }

  return {
    ...authResult,
    hasPermission: true
  };
}