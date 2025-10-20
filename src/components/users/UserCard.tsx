'use client';

import { useState } from 'react';
import { UserDTO } from '@/types/api';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  ChefHat,
  CreditCard,
  Crown,
  Edit,
  MoreVertical,
  Shield,
  Trash2,
  User,
  Users,
  Utensils
} from 'lucide-react';

interface UserCardProps {
  user: UserDTO;
  onEdit: (user: UserDTO) => void;
  onDelete: (user: UserDTO) => void;
}

export default function UserCard({ user, onEdit, onDelete }: UserCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'admin':
        return <Shield className="h-4 w-4" />;
      case 'trabajador':
        return <User className="h-4 w-4" />;
      default:
        return <User className="h-4 w-4" />;
    }
  };

  const getRoleBadge = (role: string) => {
    const configs = {
      admin: { color: 'bg-red-100 text-red-800 hover:bg-red-200', label: 'Administrador' },
      trabajador: { color: 'bg-blue-100 text-blue-800 hover:bg-blue-200', label: 'Trabajador' }
    };
    
    const config = configs[role as keyof typeof configs] || configs.trabajador;
    
    return (
      <Badge className={config.color}>
        {getRoleIcon(role)}
        <span className="ml-1">{config.label}</span>
      </Badge>
    );
  };

  const getStatusBadge = (status?: string) => {
    if (!status) return null;
    
    const configs = {
      activo: { color: 'bg-green-100 text-green-800', label: 'Activo' },
      inactivo: { color: 'bg-gray-100 text-gray-800', label: 'Inactivo' },
      descanso: { color: 'bg-yellow-100 text-yellow-800', label: 'En Descanso' }
    };
    
    const config = configs[status as keyof typeof configs];
    if (!config) return null;
    
    return (
      <Badge variant="outline" className={config.color}>
        {config.label}
      </Badge>
    );
  };

  const getInitials = (fullName?: string) => {
    if (!fullName) return 'U';
    return fullName
      .split(' ')
      .map(name => name.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const formatLastAccess = (lastAccess?: Date) => {
    if (!lastAccess) return 'Nunca';
    
    const now = new Date();
    const access = new Date(lastAccess);
    const diffTime = Math.abs(now.getTime() - access.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return 'Hoy';
    if (diffDays === 2) return 'Ayer';
    if (diffDays <= 7) return `Hace ${diffDays} días`;
    
    return access.toLocaleDateString('es-ES', {
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <Card 
      className={`transition-all duration-200 hover:shadow-lg ${
        isHovered ? 'scale-105' : ''
      } bg-gradient-to-br from-orange-50 to-yellow-50 border-orange-200`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <Avatar className="h-12 w-12 border-2 border-orange-200">
              <AvatarImage src={user.photo} alt={user.fullName} />
              <AvatarFallback className="bg-orange-100 text-orange-800 font-semibold">
                {getInitials(user.fullName)}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-semibold text-lg text-gray-900">{user.fullName}</h3>
              <p className="text-sm text-gray-600">@{user.userName}</p>
              {user.email && (
                <p className="text-xs text-gray-500">{user.email}</p>
              )}
            </div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onEdit(user)}>
                <Edit className="mr-2 h-4 w-4" />
                Editar
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => onDelete(user)}
                className="text-destructive"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Eliminar
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Role and Status */}
        <div className="flex flex-wrap gap-2">
          {getRoleBadge(user.role)}
          {getStatusBadge(user.status)}
        </div>
        
        {/* Area */}
        {user.area && (
          <div className="flex items-center text-sm text-gray-600">
            <Utensils className="h-4 w-4 mr-2 text-gray-400" />
            <span className="font-medium">Área:</span>
            <span className="ml-1">{user.area}</span>
          </div>
        )}
        
        {/* Last Access */}
        <div className="flex items-center justify-between text-xs text-gray-500 pt-2 border-t border-orange-100">
          <span>Último acceso: {formatLastAccess(user.lastAccess)}</span>
          {user.createdAt && (
            <span>
              Desde {new Date(user.createdAt).toLocaleDateString('es-ES', { 
                month: 'short', 
                year: '2-digit' 
              })}
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  );
}