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
      ADMIN: { color: 'bg-red-100 text-red-800 hover:bg-red-200', label: 'Administrador' },
      WORKER: { color: 'bg-blue-100 text-blue-800 hover:bg-blue-200', label: 'Trabajador' }
    };
    
    const config = configs[role as keyof typeof configs] || configs.WORKER;
    
    return (
      <Badge className={config.color}>
        {getRoleIcon(role)}
        <span className="ml-1">{config.label}</span>
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
              <AvatarFallback className="bg-orange-100 text-orange-800 font-semibold">
                {getInitials(user.userName)}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-semibold text-lg text-gray-900">{user.userName}</h3>
              <p className="text-sm text-gray-600">@{user.userName}</p>
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
        </div>
      </CardContent>
    </Card>
  );
}