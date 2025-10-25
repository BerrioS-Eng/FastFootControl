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
import { isAdminRole, ROLE_COLORS, ROLE_LABELS } from '@/lib/constants';
import {
  Edit, 
  Trash2, 
  MoreHorizontal,
  Users,
  Shield,
  User
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface SimpleUserTableProps {
  users: UserDTO[];
  onEdit: (user: UserDTO) => void;
  onDelete: (user: UserDTO) => void;
}

  export function SimpleUserTable({ users, onEdit, onDelete }: SimpleUserTableProps) {
  const getRoleIcon = (role: string) => {
    return isAdminRole(role) ? <Shield className="h-4 w-4" /> : <User className="h-4 w-4" />;
  };

  const getRoleBadge = (role: string) => {
    if (!role) return null;
    
    const isAdmin = isAdminRole(role);
    const config = {
      color: isAdmin ? ROLE_COLORS.ADMIN : ROLE_COLORS.WORKER,
      label: isAdmin ? ROLE_LABELS.ADMIN : ROLE_LABELS.WORKER
    };
    
    return (
      <Badge className={config.color}>
        {getRoleIcon(role)}
        <span className="ml-1">{config.label}</span>
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