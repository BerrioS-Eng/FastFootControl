'use client';

import { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Crown, Briefcase, User, Check } from 'lucide-react';
import { UserRole } from '@/types/api';
import { cn } from '@/lib/utils';

interface RoleSelectorProps {
  value?: UserRole;
  onChange: (role: UserRole) => void;
  disabled?: boolean;
  error?: string;
}

export function RoleSelector({ value, onChange, disabled = false, error }: RoleSelectorProps) {
  const roles = [
    {
      id: 'ADMIN' as UserRole,
      label: 'Administrador',
      description: 'Acceso completo al sistema, gestión de usuarios y configuración',
      icon: Crown,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200',
      selectedBorder: 'border-red-500',
      permissions: [
        'Gestión completa de usuarios',
        'Configuración del sistema',
        'Acceso a todos los reportes',
        'Control total de productos y ventas'
      ]
    },
    {
      id: 'MANAGER' as UserRole,
      label: 'Gerente',
      description: 'Gestión de productos, ventas y reportes básicos',
      icon: Briefcase,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
      selectedBorder: 'border-blue-500',
      permissions: [
        'Visualización de usuarios',
        'Gestión de productos',
        'Acceso a reportes básicos',
        'Supervisión de ventas'
      ]
    },
    {
      id: 'WORKER' as UserRole,
      label: 'Trabajador',
      description: 'Operaciones básicas de venta y consulta de productos',
      icon: User,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
      selectedBorder: 'border-green-500',
      permissions: [
        'Registro de ventas',
        'Consulta de productos',
        'Operaciones básicas',
        'Sin acceso a configuración'
      ]
    }
  ];

  return (
    <div className="space-y-3">
      <Label className="text-sm font-semibold text-gray-700">
        Rol del Usuario
      </Label>
      
      <div className="grid gap-3">
        {roles.map((role) => {
          const Icon = role.icon;
          const isSelected = value === role.id;
          
          return (
            <Card
              key={role.id}
              className={cn(
                "cursor-pointer transition-all duration-200 hover:shadow-md",
                isSelected
                  ? `${role.selectedBorder} shadow-md ${role.bgColor}`
                  : `${role.borderColor} hover:${role.borderColor}`,
                disabled && "opacity-50 cursor-not-allowed"
              )}
              onClick={() => !disabled && onChange(role.id)}
            >
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div className={cn(
                    "p-2 rounded-lg flex-shrink-0",
                    isSelected ? role.bgColor : 'bg-gray-50'
                  )}>
                    <Icon className={cn("h-5 w-5", isSelected ? role.color : 'text-gray-400')} />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <h3 className={cn(
                          "font-semibold",
                          isSelected ? role.color : 'text-gray-700'
                        )}>
                          {role.label}
                        </h3>
                        {isSelected && (
                          <div className={cn("p-1 rounded-full", role.bgColor)}>
                            <Check className={cn("h-3 w-3", role.color)} />
                          </div>
                        )}
                      </div>
                      <Badge 
                        variant="outline" 
                        className={cn(
                          "text-xs",
                          isSelected ? `${role.color} ${role.borderColor}` : 'text-gray-500'
                        )}
                      >
                        {role.id}
                      </Badge>
                    </div>
                    
                    <p className="text-sm text-gray-600 mb-3">
                      {role.description}
                    </p>
                    
                    <div className="space-y-1">
                      <h4 className="text-xs font-medium text-gray-700 uppercase tracking-wide">
                        Permisos incluidos:
                      </h4>
                      <ul className="space-y-1">
                        {role.permissions.slice(0, 2).map((permission, index) => (
                          <li key={index} className="flex items-center gap-2 text-xs text-gray-600">
                            <div className={cn(
                              "w-1.5 h-1.5 rounded-full",
                              isSelected ? role.color.replace('text-', 'bg-') : 'bg-gray-300'
                            )} />
                            {permission}
                          </li>
                        ))}
                        {role.permissions.length > 2 && (
                          <li className="text-xs text-gray-500 italic">
                            +{role.permissions.length - 2} permisos más...
                          </li>
                        )}
                      </ul>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
      
      {error && (
        <p className="text-sm text-red-600 flex items-center gap-1 mt-2">
          <div className="w-1 h-1 bg-red-600 rounded-full" />
          {error}
        </p>
      )}
    </div>
  );
}