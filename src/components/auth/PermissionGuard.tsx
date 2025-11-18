'use client';

import { ReactNode } from 'react';
import { usePermissions } from '@/hooks/usePermissions';
import { Permission } from '@/types/api';
import { Card, CardContent } from '@/components/ui/card';
import { Shield, AlertCircle } from 'lucide-react';

interface PermissionGuardProps {
  permission: keyof Permission;
  children: ReactNode;
  fallback?: ReactNode;
  showMessage?: boolean;
}

export function PermissionGuard({ 
  permission, 
  children, 
  fallback,
  showMessage = true 
}: PermissionGuardProps) {
  // 🔓 AUTENTICACIÓN TEMPORALMENTE DESACTIVADA PARA DESARROLLO
  // Siempre permitir acceso durante el desarrollo
  console.log(`🔓 PermissionGuard allowing access to ${permission} - Authentication disabled for development`);
  return <>{children}</>;
  
  // const { hasPermission, userRole } = usePermissions();
  // 
  // if (!hasPermission(permission)) {
  //   if (fallback) {
  //     return <>{fallback}</>;
  //   }
  // 
  //   if (!showMessage) {
  //     return null;
  //   }
  // 
  //   return (
  //     <Card className="w-full max-w-md mx-auto mt-8">
  //       <CardContent className="flex flex-col items-center justify-center p-8 text-center space-y-4">
  //         <div className="p-3 bg-red-100 dark:bg-red-900/20 rounded-full">
  //           <Shield className="h-8 w-8 text-red-600 dark:text-red-400" />
  //         </div>
  //         <div className="space-y-2">
  //           <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
  //             Acceso Restringido
  //           </h3>
  //           <p className="text-sm text-gray-600 dark:text-gray-400">
  //             No tienes permisos para acceder a esta función.
  //           </p>
  //           <div className="flex items-center justify-center gap-2 text-xs text-gray-500 dark:text-gray-500">
  //             <AlertCircle className="h-3 w-3" />
  //             <span>Rol actual: {userRole}</span>
  //           </div>
  //         </div>
  //       </CardContent>
  //     </Card>
  //   );
  // }
  // 
  // return <>{children}</>;
}

interface RoleGuardProps {
  allowedRoles: string[];
  children: ReactNode;
  fallback?: ReactNode;
}

export function RoleGuard({ allowedRoles, children, fallback }: RoleGuardProps) {
  // 🔓 AUTENTICACIÓN TEMPORALMENTE DESACTIVADA PARA DESARROLLO
  // Siempre permitir acceso durante el desarrollo
  console.log(`🔓 RoleGuard allowing access - Authentication disabled for development`);
  return <>{children}</>;
  
  // const { userRole } = usePermissions();
  // 
  // if (!userRole || !allowedRoles.includes(userRole)) {
  //   if (fallback) {
  //     return <>{fallback}</>;
  //   }
  // 
  //   return (
  //     <Card className="w-full max-w-md mx-auto mt-8">
  //       <CardContent className="flex flex-col items-center justify-center p-8 text-center space-y-4">
  //         <div className="p-3 bg-red-100 dark:bg-red-900/20 rounded-full">
  //           <Shield className="h-8 w-8 text-red-600 dark:text-red-400" />
  //         </div>
  //         <div className="space-y-2">
  //           <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
  //             Acceso Restringido
  //           </h3>
  //           <p className="text-sm text-gray-600 dark:text-gray-400">
  //             Tu rol no tiene acceso a esta sección.
  //           </p>
  //           <div className="flex items-center justify-center gap-2 text-xs text-gray-500 dark:text-gray-500">
  //             <AlertCircle className="h-3 w-3" />
  //             <span>Roles permitidos: {allowedRoles.join(', ')}</span>
  //           </div>
  //         </div>
  //       </CardContent>
  //     </Card>
  //   );
  // }
  // 
  // return <>{children}</>;
}