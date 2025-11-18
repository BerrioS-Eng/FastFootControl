'use client';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { UserDTO } from '@/types/api';
import {
  Edit, 
  Trash2, 
  MoreHorizontal,
  Users,
  Shield,
  User,
  Crown,
  Briefcase,
  Eye,
  Lock
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { usePermissions } from '@/hooks/usePermissions';

interface SimpleUserTableProps {
  users: UserDTO[];
  onEdit: (user: UserDTO) => void;
  onDelete: (user: UserDTO) => void;
}

export function SimpleUserTable({ users, onEdit, onDelete }: SimpleUserTableProps) {
  const { hasPermission } = usePermissions();

  const getRoleDisplay = (role: string) => {
    switch (role) {
      case 'ADMIN':
        return {
          label: 'Administrador',
          color: 'bg-red-100 text-red-800 border-red-200',
          icon: <Crown className="h-3 w-3" />
        };
      case 'MANAGER':
        return {
          label: 'Gerente',
          color: 'bg-blue-100 text-blue-800 border-blue-200',
          icon: <Briefcase className="h-3 w-3" />
        };
      case 'WORKER':
        return {
          label: 'Trabajador',
          color: 'bg-green-100 text-green-800 border-green-200',
          icon: <User className="h-3 w-3" />
        };
      default:
        return {
          label: 'Usuario',
          color: 'bg-gray-100 text-gray-800 border-gray-200',
          icon: <User className="h-3 w-3" />
        };
    }
  };

  const getRoleBadge = (role: string) => {
    if (!role) return null;
    
    const display = getRoleDisplay(role);
    
    return (
      <Badge className={`${display.color} border font-medium`}>
        <div className="flex items-center gap-1">
          {display.icon}
          {display.label}
        </div>
      </Badge>
    );
  };

  return (
    <div className="w-full">
      {/* Vista móvil */}
      <div className="block md:hidden space-y-4">
        {users.length === 0 ? (
          <div className="text-center py-8">
            <div className="flex flex-col items-center">
              <Users className="h-12 w-12 text-gray-400 mb-2" />
              <p className="text-gray-600">No se encontraron empleados</p>
            </div>
          </div>
        ) : (
          users.map((user) => (
            <div key={user.id || user.userId} className="bg-white border rounded-lg p-4 shadow-sm">
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center space-x-3">
                  <div className="h-10 w-10 rounded-full bg-orange-100 flex items-center justify-center">
                    <span className="text-sm font-medium text-orange-800">
                      {(user.userName || 'Usuario').split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
                    </span>
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">{user.fullName || user.userName}</div>
                    <div className="text-sm text-gray-500">{user.email || `@${user.userName}`}</div>
                    {user.area && <div className="text-xs text-gray-400">{user.area}</div>}
                  </div>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => alert(`Ver detalles de ${user.fullName || user.userName}`)}>
                      <Eye className="mr-2 h-4 w-4" />
                      Ver detalles
                    </DropdownMenuItem>
                    {hasPermission('canEditUsers') ? (
                      <DropdownMenuItem onClick={() => onEdit(user)}>
                        <Edit className="mr-2 h-4 w-4" />
                        Editar
                      </DropdownMenuItem>
                    ) : (
                      <DropdownMenuItem disabled>
                        <Lock className="mr-2 h-4 w-4" />
                        Editar (Sin permisos)
                      </DropdownMenuItem>
                    )}
                    {hasPermission('canDeleteUsers') ? (
                      <DropdownMenuItem 
                        onClick={() => onDelete(user)}
                        className="text-destructive"
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Eliminar
                      </DropdownMenuItem>
                    ) : (
                      <DropdownMenuItem disabled>
                        <Lock className="mr-2 h-4 w-4" />
                        Eliminar (Sin permisos)
                      </DropdownMenuItem>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex flex-wrap gap-2">
                  {getRoleBadge(user.role)}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Vista desktop */}
      <div className="hidden md:block">
        <Table>
          <TableHeader>
            <TableRow className="bg-orange-50 hover:bg-orange-50">
              <TableHead className="font-semibold text-gray-900">Empleado</TableHead>
              <TableHead className="font-semibold text-gray-900">Rol</TableHead>
              <TableHead className="text-right font-semibold text-gray-900">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8">
                  <div className="flex flex-col items-center">
                    <Users className="h-12 w-12 text-gray-400 mb-2" />
                    <p className="text-gray-600">No se encontraron empleados</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              users.map((user) => (
                <TableRow key={user.id || user.userId} className="hover:bg-orange-50/50">
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      <div className="flex-shrink-0">
                        <div className="h-10 w-10 rounded-full bg-orange-100 flex items-center justify-center">
                          <span className="text-sm font-medium text-orange-800">
                            {(user.fullName || user.userName || 'Usuario').split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
                          </span>
                        </div>
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">{user.fullName || user.userName}</div>
                        <div className="text-sm text-gray-500">{user.email || `@${user.userName}`}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    {getRoleBadge(user.role)}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Abrir menú</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => alert(`Ver detalles de ${user.fullName || user.userName}`)}>
                          <Eye className="mr-2 h-4 w-4" />
                          Ver detalles
                        </DropdownMenuItem>
                        {hasPermission('canEditUsers') ? (
                          <DropdownMenuItem onClick={() => onEdit(user)}>
                            <Edit className="mr-2 h-4 w-4" />
                            Editar
                          </DropdownMenuItem>
                        ) : (
                          <DropdownMenuItem disabled>
                            <Lock className="mr-2 h-4 w-4" />
                            Editar (Sin permisos)
                          </DropdownMenuItem>
                        )}
                        {hasPermission('canDeleteUsers') ? (
                          <DropdownMenuItem 
                            onClick={() => onDelete(user)}
                            className="text-destructive"
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Eliminar
                          </DropdownMenuItem>
                        ) : (
                          <DropdownMenuItem disabled>
                            <Lock className="mr-2 h-4 w-4" />
                            Eliminar (Sin permisos)
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}