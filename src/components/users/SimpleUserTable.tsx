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
  User
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface SimpleUserTableProps {
  users: UserDTO[];
  onEdit: (user: UserDTO) => void;
  onDelete: (user: UserDTO) => void;
  onStatusChange: (userId: number, newStatus: string) => void;
}

export function SimpleUserTable({ users, onEdit, onDelete, onStatusChange }: SimpleUserTableProps) {
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



  const StatusSelect = ({ user }: { user: UserDTO }) => {
    const handleStatusChange = (newStatus: string) => {
      if (user.id) {
        onStatusChange(user.id, newStatus);
      }
    };

    const configs = {
      activo: { color: 'text-green-600', label: 'Activo' },
      inactivo: { color: 'text-gray-600', label: 'Inactivo' }, 
      descanso: { color: 'text-yellow-600', label: 'En Descanso' }
    };

    const currentConfig = configs[user.status as keyof typeof configs];

    return (
      <Select value={user.status || 'activo'} onValueChange={handleStatusChange}>
        <SelectTrigger className="w-32 h-8 text-xs">
          <SelectValue>
            <span className={currentConfig?.color}>
              {currentConfig?.label || 'Activo'}
            </span>
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="activo" className="text-green-600">
            Activo
          </SelectItem>
          <SelectItem value="descanso" className="text-yellow-600">
            En Descanso
          </SelectItem>
          <SelectItem value="inactivo" className="text-gray-600">
            Inactivo
          </SelectItem>
        </SelectContent>
      </Select>
    );
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
            <div key={user.id} className="bg-white border rounded-lg p-4 shadow-sm">
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center space-x-3">
                  <div className="h-10 w-10 rounded-full bg-orange-100 flex items-center justify-center">
                    <span className="text-sm font-medium text-orange-800">
                      {(user.fullName || 'Usuario').split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
                    </span>
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">{user.fullName}</div>
                    <div className="text-sm text-gray-500">@{user.userName}</div>
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
                <div className="text-gray-700">{user.email}</div>
                <div className="flex flex-wrap gap-2">
                  {getRoleBadge(user.role)}
                  <StatusSelect user={user} />
                </div>
                <div className="text-gray-600">
                  <span className="font-medium">Área:</span> {user.area || 'No especificada'}
                </div>
                <div className="text-gray-600">
                  <span className="font-medium">Último acceso:</span> {formatLastAccess(user.lastAccess)}
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
              <TableHead className="font-semibold text-gray-900 hidden lg:table-cell">Email</TableHead>
              <TableHead className="font-semibold text-gray-900">Rol & Estado</TableHead>
              <TableHead className="font-semibold text-gray-900 hidden xl:table-cell">Área</TableHead>
              <TableHead className="font-semibold text-gray-900 hidden lg:table-cell">Último Acceso</TableHead>
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
                <TableRow key={user.id} className="hover:bg-orange-50/50">
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      <div className="flex-shrink-0">
                        <div className="h-10 w-10 rounded-full bg-orange-100 flex items-center justify-center">
                          <span className="text-sm font-medium text-orange-800">
                            {(user.fullName || 'Usuario').split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
                          </span>
                        </div>
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">{user.fullName}</div>
                        <div className="text-sm text-gray-500">@{user.userName}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="hidden lg:table-cell">
                    <div className="text-sm text-gray-900">{user.email}</div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-2">
                      {getRoleBadge(user.role)}
                      <StatusSelect user={user} />
                    </div>
                  </TableCell>
                  <TableCell className="hidden xl:table-cell">
                    <div className="text-sm text-gray-700">
                      {user.area || 'No especificada'}
                    </div>
                  </TableCell>
                  <TableCell className="hidden lg:table-cell">
                    <div className="text-sm text-gray-700">
                      {formatLastAccess(user.lastAccess)}
                    </div>
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