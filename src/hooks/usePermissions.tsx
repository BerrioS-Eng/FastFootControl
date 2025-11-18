'use client';

import { useMemo } from 'react';
import { useAuth } from './useAuth';
import { Permission, UserRole } from '@/types/api';

// Definición de permisos por rol
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

export function usePermissions() {
  const { user } = useAuth();

  const permissions = useMemo(() => {
    if (!user?.role) {
      return ROLE_PERMISSIONS.WORKER; // Permisos más restrictivos por defecto
    }
    return ROLE_PERMISSIONS[user.role] || ROLE_PERMISSIONS.WORKER;
  }, [user?.role]);

  const hasPermission = (permission: keyof Permission): boolean => {
    return permissions[permission];
  };

  const isAdmin = user?.role === 'ADMIN';
  const isManager = user?.role === 'MANAGER';
  const isWorker = user?.role === 'WORKER';

  return {
    permissions,
    hasPermission,
    isAdmin,
    isManager,
    isWorker,
    userRole: user?.role,
  };
}