'use client';

import { Badge } from '@/components/ui/badge';
import { Crown, Briefcase, User, Shield } from 'lucide-react';
import { UserRole } from '@/types/api';

interface RoleBadgeProps {
  role: UserRole;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'outline';
}

export function RoleBadge({ role, size = 'md', variant = 'default' }: RoleBadgeProps) {
  const getRoleConfig = (role: UserRole) => {
    switch (role) {
      case 'ADMIN':
        return {
          label: 'Administrador',
          icon: Crown,
          colors: {
            default: 'bg-red-500 text-white hover:bg-red-600',
            outline: 'border-red-500 text-red-700 bg-red-50 hover:bg-red-100'
          },
          description: 'Acceso completo al sistema'
        };
      case 'MANAGER':
        return {
          label: 'Gerente',
          icon: Briefcase,
          colors: {
            default: 'bg-blue-500 text-white hover:bg-blue-600',
            outline: 'border-blue-500 text-blue-700 bg-blue-50 hover:bg-blue-100'
          },
          description: 'Gestión de productos y ventas'
        };
      case 'WORKER':
        return {
          label: 'Trabajador',
          icon: User,
          colors: {
            default: 'bg-green-500 text-white hover:bg-green-600',
            outline: 'border-green-500 text-green-700 bg-green-50 hover:bg-green-100'
          },
          description: 'Operaciones básicas de venta'
        };
      default:
        return {
          label: 'Usuario',
          icon: Shield,
          colors: {
            default: 'bg-gray-500 text-white hover:bg-gray-600',
            outline: 'border-gray-500 text-gray-700 bg-gray-50 hover:bg-gray-100'
          },
          description: 'Rol no definido'
        };
    }
  };

  const getSizeConfig = (size: 'sm' | 'md' | 'lg') => {
    switch (size) {
      case 'sm':
        return {
          badge: 'text-xs px-2 py-1',
          icon: 'h-3 w-3'
        };
      case 'lg':
        return {
          badge: 'text-base px-4 py-2',
          icon: 'h-5 w-5'
        };
      case 'md':
      default:
        return {
          badge: 'text-sm px-3 py-1',
          icon: 'h-4 w-4'
        };
    }
  };

  const config = getRoleConfig(role);
  const sizeConfig = getSizeConfig(size);
  const Icon = config.icon;

  return (
    <Badge 
      className={`
        ${config.colors[variant]} 
        ${sizeConfig.badge} 
        font-medium 
        transition-colors 
        duration-200 
        cursor-default
        border
      `}
      title={config.description}
    >
      <div className="flex items-center gap-1.5">
        <Icon className={sizeConfig.icon} />
        <span>{config.label}</span>
      </div>
    </Badge>
  );
}

// Componente de ayuda para mostrar información de roles
export function RoleInfoCard({ role }: { role: UserRole }) {
  const getRoleConfig = (role: UserRole) => {
    switch (role) {
      case 'ADMIN':
        return {
          label: 'Administrador',
          icon: Crown,
          color: 'text-red-600',
          bgColor: 'bg-red-50',
          borderColor: 'border-red-200',
          permissions: [
            'Gestión completa de usuarios',
            'Creación y edición de productos',
            'Acceso a reportes y analytics',
            'Configuración del sistema',
            'Todas las operaciones de venta'
          ]
        };
      case 'MANAGER':
        return {
          label: 'Gerente',
          icon: Briefcase,
          color: 'text-blue-600',
          bgColor: 'bg-blue-50',
          borderColor: 'border-blue-200',
          permissions: [
            'Visualización de usuarios',
            'Gestión de productos',
            'Acceso a reportes',
            'Operaciones de venta'
          ]
        };
      case 'WORKER':
        return {
          label: 'Trabajador',
          icon: User,
          color: 'text-green-600',
          bgColor: 'bg-green-50',
          borderColor: 'border-green-200',
          permissions: [
            'Visualización de productos',
            'Registro de ventas',
            'Acceso básico al sistema'
          ]
        };
      default:
        return {
          label: 'Usuario',
          icon: Shield,
          color: 'text-gray-600',
          bgColor: 'bg-gray-50',
          borderColor: 'border-gray-200',
          permissions: ['Permisos limitados']
        };
    }
  };

  const config = getRoleConfig(role);
  const Icon = config.icon;

  return (
    <div className={`p-4 rounded-lg border ${config.bgColor} ${config.borderColor}`}>
      <div className="flex items-center gap-3 mb-3">
        <div className={`p-2 rounded-full ${config.bgColor} border ${config.borderColor}`}>
          <Icon className={`h-5 w-5 ${config.color}`} />
        </div>
        <div>
          <h3 className={`font-semibold ${config.color}`}>{config.label}</h3>
          <p className="text-sm text-gray-600">Nivel de acceso: {role}</p>
        </div>
      </div>
      <div className="space-y-1">
        <h4 className="text-sm font-medium text-gray-700">Permisos incluidos:</h4>
        <ul className="text-sm text-gray-600 space-y-1">
          {config.permissions.map((permission, index) => (
            <li key={index} className="flex items-center gap-2">
              <div className={`w-1.5 h-1.5 rounded-full ${config.color.replace('text-', 'bg-')}`} />
              {permission}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}