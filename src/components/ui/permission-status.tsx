'use client';

import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Shield, 
  AlertTriangle, 
  Info, 
  CheckCircle, 
  XCircle,
  Crown,
  Briefcase,
  User,
  ArrowRight
} from 'lucide-react';
import { usePermissions } from '@/hooks/usePermissions';
import { UserRole } from '@/types/api';

interface PermissionStatusProps {
  className?: string;
  showDetails?: boolean;
}

export function PermissionStatus({ className = '', showDetails = true }: PermissionStatusProps) {
  const { userRole, permissions, isAdmin, isManager, isWorker } = usePermissions();

  const getRoleIcon = () => {
    switch (userRole) {
      case 'ADMIN':
        return <Crown className="h-5 w-5 text-red-600" />;
      case 'MANAGER':
        return <Briefcase className="h-5 w-5 text-blue-600" />;
      case 'WORKER':
        return <User className="h-5 w-5 text-green-600" />;
      default:
        return <Shield className="h-5 w-5 text-gray-600" />;
    }
  };

  const getRoleColor = () => {
    switch (userRole) {
      case 'ADMIN':
        return 'from-red-500 to-red-600';
      case 'MANAGER':
        return 'from-blue-500 to-blue-600';
      case 'WORKER':
        return 'from-green-500 to-green-600';
      default:
        return 'from-gray-500 to-gray-600';
    }
  };

  const getPermissionGroups = () => {
    const groups = [
      {
        title: 'Gestión de Usuarios',
        permissions: [
          { key: 'canViewUsers', label: 'Ver usuarios', enabled: permissions.canViewUsers },
          { key: 'canCreateUsers', label: 'Crear usuarios', enabled: permissions.canCreateUsers },
          { key: 'canEditUsers', label: 'Editar usuarios', enabled: permissions.canEditUsers },
          { key: 'canDeleteUsers', label: 'Eliminar usuarios', enabled: permissions.canDeleteUsers },
        ]
      },
      {
        title: 'Gestión de Productos',
        permissions: [
          { key: 'canViewProducts', label: 'Ver productos', enabled: permissions.canViewProducts },
          { key: 'canCreateProducts', label: 'Crear productos', enabled: permissions.canCreateProducts },
          { key: 'canEditProducts', label: 'Editar productos', enabled: permissions.canEditProducts },
          { key: 'canDeleteProducts', label: 'Eliminar productos', enabled: permissions.canDeleteProducts },
        ]
      },
      {
        title: 'Ventas y Reportes',
        permissions: [
          { key: 'canViewSales', label: 'Ver ventas', enabled: permissions.canViewSales },
          { key: 'canCreateSales', label: 'Registrar ventas', enabled: permissions.canCreateSales },
          { key: 'canViewReports', label: 'Ver reportes', enabled: permissions.canViewReports },
          { key: 'canManageSettings', label: 'Configuración', enabled: permissions.canManageSettings },
        ]
      }
    ];
    return groups;
  };

  if (!showDetails) {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        {getRoleIcon()}
        <span className="text-sm font-medium text-gray-700">
          {userRole || 'Sin rol'}
        </span>
      </div>
    );
  }

  return (
    <Card className={`${className} border-0 shadow-lg bg-gradient-to-r ${getRoleColor()} text-white`}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/20 rounded-lg">
              {getRoleIcon()}
            </div>
            <div>
              <h3 className="text-lg font-semibold">Panel de Permisos</h3>
              <p className="text-white/90 text-sm">
                Rol actual: <span className="font-medium">{userRole || 'No definido'}</span>
              </p>
            </div>
          </div>
          <Badge className="bg-white/20 text-white border-white/30">
            Activo
          </Badge>
        </div>

        {showDetails && (
          <div className="space-y-4">
            {getPermissionGroups().map((group, index) => (
              <div key={index} className="bg-white/10 rounded-lg p-4">
                <h4 className="font-medium text-white mb-3 flex items-center gap-2">
                  <div className="w-2 h-2 bg-white/60 rounded-full" />
                  {group.title}
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {group.permissions.map((permission, permIndex) => (
                    <div key={permIndex} className="flex items-center gap-2 text-sm">
                      {permission.enabled ? (
                        <CheckCircle className="h-4 w-4 text-green-300" />
                      ) : (
                        <XCircle className="h-4 w-4 text-red-300" />
                      )}
                      <span className={permission.enabled ? 'text-white' : 'text-white/60'}>
                        {permission.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

interface PermissionAlertProps {
  type: 'warning' | 'error' | 'info';
  title: string;
  message: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export function PermissionAlert({ type, title, message, action }: PermissionAlertProps) {
  const getIcon = () => {
    switch (type) {
      case 'warning':
        return <AlertTriangle className="h-4 w-4" />;
      case 'error':
        return <XCircle className="h-4 w-4" />;
      case 'info':
        return <Info className="h-4 w-4" />;
    }
  };

  const getVariant = () => {
    switch (type) {
      case 'error':
        return 'destructive';
      default:
        return 'default';
    }
  };

  return (
    <Alert variant={getVariant()} className="border-l-4">
      {getIcon()}
      <AlertDescription>
        <div className="space-y-2">
          <div className="font-semibold">{title}</div>
          <div className="text-sm">{message}</div>
          {action && (
            <Button
              variant="outline"
              size="sm"
              onClick={action.onClick}
              className="mt-2"
            >
              {action.label}
              <ArrowRight className="ml-2 h-3 w-3" />
            </Button>
          )}
        </div>
      </AlertDescription>
    </Alert>
  );
}