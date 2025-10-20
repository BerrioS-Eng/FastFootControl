'use client';

import { useState, useEffect, useMemo } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { UsersService } from '@/services/users.service';
import { UserDTO } from '@/types/api';
import { toast } from 'sonner';
import { 
  Search, 
  UserPlus, 
  Edit, 
  Trash2, 
  MoreHorizontal,
  Users,
  Shield,
  User,
  RefreshCw
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import CreateUserModal from './CreateUserModal';
import EditUserModal from './EditUserModal';
import DeleteUserModal from './DeleteUserModal';

interface UserTableProps {
  className?: string;
}

export default function UserTable({ className }: UserTableProps) {
  const [users, setUsers] = useState<UserDTO[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  
  // Modal states
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserDTO | null>(null);

  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      const response = await UsersService.getAllUsers();
      setUsers(response);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('Error al cargar los usuarios');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const filteredUsers = useMemo(() => {
    return users.filter(user => {
      const matchesSearch = 
        user.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.userName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesRole = roleFilter === 'all' || user.role === roleFilter;
      
      return matchesSearch && matchesRole;
    });
  }, [users, searchTerm, roleFilter]);

  const handleRefresh = () => {
    fetchUsers();
  };

  const handleEditUser = (user: UserDTO) => {
    setSelectedUser(user);
    setEditModalOpen(true);
  };

  const handleDeleteUser = (user: UserDTO) => {
    setSelectedUser(user);
    setDeleteModalOpen(true);
  };

  const getRoleBadge = (role: string) => {
    if (role === 'admin') {
      return (
        <Badge variant="default" className="bg-red-100 text-red-800 hover:bg-red-200">
          <Shield className="w-3 h-3 mr-1" />
          Administrador
        </Badge>
      );
    }
    return (
      <Badge variant="secondary" className="bg-blue-100 text-blue-800 hover:bg-blue-200">
        <User className="w-3 h-3 mr-1" />
        Usuario
      </Badge>
    );
  };

  const statistics = {
    total: users.length,
    admins: users.filter(user => user.role === 'admin').length,
    trabajadores: users.filter(user => user.role === 'trabajador').length,
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <RefreshCw className="h-8 w-8 animate-spin text-muted-foreground" />
        <span className="ml-2 text-muted-foreground">Cargando usuarios...</span>
      </div>
    );
  }

  return (
    <div className={className}>
      {/* Header with Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-card p-4 rounded-lg border">
          <div className="flex items-center">
            <Users className="h-8 w-8 text-blue-600" />
            <div className="ml-4">
              <p className="text-2xl font-bold">{statistics.total}</p>
              <p className="text-sm text-muted-foreground">Total Usuarios</p>
            </div>
          </div>
        </div>
        <div className="bg-card p-4 rounded-lg border">
          <div className="flex items-center">
            <Shield className="h-8 w-8 text-red-600" />
            <div className="ml-4">
              <p className="text-2xl font-bold">{statistics.admins}</p>
              <p className="text-sm text-muted-foreground">Administradores</p>
            </div>
          </div>
        </div>
        <div className="bg-card p-4 rounded-lg border">
          <div className="flex items-center">
            <User className="h-8 w-8 text-green-600" />
            <div className="ml-4">
              <p className="text-2xl font-bold">{statistics.trabajadores}</p>
              <p className="text-sm text-muted-foreground">Usuarios EstÃ¡ndar</p>
            </div>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar usuarios..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
          />
        </div>
        <Select value={roleFilter} onValueChange={setRoleFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filtrar por rol" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos los roles</SelectItem>
            <SelectItem value="admin">Administradores</SelectItem>
            <SelectItem value="user">Usuarios</SelectItem>
          </SelectContent>
        </Select>
        <Button onClick={handleRefresh} variant="outline" size="sm">
          <RefreshCw className="h-4 w-4 mr-2" />
          Actualizar
        </Button>
        <Button onClick={() => setCreateModalOpen(true)}>
          <UserPlus className="h-4 w-4 mr-2" />
          Nuevo Usuario
        </Button>
      </div>

      {/* Table */}
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Usuario</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Rol</TableHead>
              <TableHead>Fecha de CreaciÃ³n</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8">
                  <div className="flex flex-col items-center">
                    <Users className="h-12 w-12 text-muted-foreground mb-2" />
                    <p className="text-muted-foreground">
                      {searchTerm || roleFilter !== 'all' 
                        ? 'No se encontraron usuarios con los filtros aplicados'
                        : 'No hay usuarios registrados'
                      }
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              filteredUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{user.fullName}</div>
                      <div className="text-sm text-muted-foreground">@{user.userName}</div>
                    </div>
                  </TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{getRoleBadge(user.role || 'user')}</TableCell>
                  <TableCell>
                    {user.createdAt 
                      ? new Date(user.createdAt).toLocaleDateString('es-ES', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })
                      : 'N/A'
                    }
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Abrir menÃº</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleEditUser(user)}>
                          <Edit className="mr-2 h-4 w-4" />
                          Editar
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => handleDeleteUser(user)}
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

      {/* Modals */}
      <CreateUserModal
        open={createModalOpen}
        onOpenChange={setCreateModalOpen}
        onUserCreated={fetchUsers}
      />
      
      {selectedUser && (
        <EditUserModal
          user={selectedUser}
          open={editModalOpen}
          onOpenChange={setEditModalOpen}
          onUserUpdated={fetchUsers}
        />
      )}
      
      {selectedUser && (
        <DeleteUserModal
          user={selectedUser}
          open={deleteModalOpen}
          onOpenChange={setDeleteModalOpen}
          onUserDeleted={fetchUsers}
        />
      )}
    </div>
  );
}
