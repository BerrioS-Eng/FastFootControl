'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, UserPlus, Grid, Table, Filter, Users, Shield } from 'lucide-react';
import { UsersService } from '@/services/users.service';
import { UserDTO } from '@/types/api';
import { SimpleUserTable } from '@/components/users/SimpleUserTable';
import UserCard from '@/components/users/UserCard';
import CreateUserModal from '@/components/users/CreateUserModal';
import EditUserModal from '@/components/users/EditUserModal';
import DeleteUserModal from '@/components/users/DeleteUserModal';
import { toast } from 'sonner';

export default function UsersPage() {
  const [users, setUsers] = useState<UserDTO[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('todos');
  const [statusFilter, setStatusFilter] = useState<string>('todos');
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table'); // Default to table for better mobile UX
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<UserDTO | null>(null);
  const [deletingUser, setDeletingUser] = useState<UserDTO | null>(null);

  const loadUsers = async () => {
    try {
      setIsLoading(true);
      const usersData = await UsersService.getAllUsers();
      setUsers(usersData);
    } catch (error) {
      console.error('Error loading users:', error);
      toast.error('Error al cargar los usuarios');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const filteredUsers = users.filter(user => {
    const matchesSearch = (user.fullName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (user.userName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (user.email || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (user.role || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (user.area || '').toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRole = roleFilter === 'todos' || (user.role || '') === roleFilter;
    const matchesStatus = statusFilter === 'todos' || (user.status || '') === statusFilter;
    
    return matchesSearch && matchesRole && matchesStatus;
  });

  const handleUserCreated = () => {
    loadUsers();
    setIsCreateModalOpen(false);
    toast.success('Usuario creado exitosamente');
  };

  const handleUserDeleted = () => {
    loadUsers();
    setDeletingUser(null);
    toast.success('Usuario eliminado exitosamente');
  };

  const handleUserUpdated = () => {
    loadUsers();
    setEditingUser(null);
    toast.success('Usuario actualizado exitosamente');
  };

  const handleEditUser = (user: UserDTO) => {
    setEditingUser(user);
  };

  const handleDeleteUser = (user: UserDTO) => {
    setDeletingUser(user);
  };

  const handleStatusChange = async (userId: number, newStatus: string) => {
    try {
      // Encontrar el usuario actual
      const user = users.find(u => u.id === userId);
      if (!user) return;

      // Crear objeto con datos actualizados
      const updatedUser = { ...user, status: newStatus as 'activo' | 'inactivo' | 'descanso' };

      // Llamar a la API para actualizar
      await UsersService.editUser(userId, updatedUser);
      
      // Recargar la lista de usuarios
      loadUsers();
      toast.success('Estado actualizado exitosamente');
    } catch (error) {
      console.error('Error updating user status:', error);
      toast.error('Error al actualizar el estado del usuario');
    }
  };

  const getRoleStats = () => {
    const roles = users.reduce((acc, user) => {
      acc[user.role] = (acc[user.role] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return [
      { role: 'admin', count: roles.admin || 0, icon: Shield, color: 'text-red-600' },
      { role: 'trabajador', count: roles.trabajador || 0, icon: Users, color: 'text-blue-600' }
    ];
  };

  if (isLoading) {
    return (
      <div className="container mx-auto py-6">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6 bg-gradient-to-br from-orange-50 to-yellow-50 min-h-screen rounded-lg">
      {/* Header - Optimized for mobile */}
      <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-orange-200">
        <div className="flex flex-col gap-4">
          {/* Title */}
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="bg-orange-100 p-2 sm:p-3 rounded-lg">
              <Users className="h-6 w-6 sm:h-8 sm:w-8 text-orange-600" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold tracking-tight text-gray-900">
                Gestión de Usuarios
              </h1>
              <p className="text-sm text-gray-600 hidden sm:block">
                FastFoodControl - Administra tu equipo
              </p>
            </div>
          </div>
          
          {/* Actions */}
          <div className="flex items-center justify-end gap-3">
            {/* View mode toggle - Only icons */}
            <div className="flex items-center bg-gray-100 rounded-lg p-1">
              <Button
                variant={viewMode === 'cards' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('cards')}
                className={`h-8 w-8 p-0 ${viewMode === 'cards' ? 'bg-orange-500 hover:bg-orange-600 text-white' : ''}`}
                title="Vista de tarjetas"
              >
                <Grid className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === 'table' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('table')}
                className={`h-8 w-8 p-0 ${viewMode === 'table' ? 'bg-orange-500 hover:bg-orange-600 text-white' : ''}`}
                title="Vista de tabla"
              >
                <Table className="h-4 w-4" />
              </Button>
            </div>
            
            {/* Add user button */}
            <Button 
              onClick={() => setIsCreateModalOpen(true)} 
              className="bg-orange-500 hover:bg-orange-600 text-white"
            >
              <UserPlus className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Nuevo Empleado</span>
              <span className="sm:hidden">Agregar</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Filtros y Estadísticas en dos columnas */}
      <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-orange-200">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Columna 1: Filtros de Búsqueda */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <Filter className="h-5 w-5 text-orange-600" />
              <h3 className="font-semibold text-gray-900">Filtros de Búsqueda</h3>
            </div>
            
            <div className="space-y-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Buscar empleado..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 border-orange-200 focus:border-orange-400"
                />
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Select value={roleFilter} onValueChange={setRoleFilter}>
                  <SelectTrigger className="border-orange-200 focus:border-orange-400">
                    <SelectValue placeholder="Todos los roles" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todos">Todos los roles</SelectItem>
                    <SelectItem value="admin">Administrador</SelectItem>
                    <SelectItem value="trabajador">Trabajador</SelectItem>
                  </SelectContent>
                </Select>
                
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="border-orange-200 focus:border-orange-400">
                    <SelectValue placeholder="Todos los estados" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todos">Todos los estados</SelectItem>
                    <SelectItem value="activo">Activo</SelectItem>
                    <SelectItem value="inactivo">Inactivo</SelectItem>
                    <SelectItem value="descanso">En Descanso</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Columna 2: Estadísticas */}
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3 gap-3">
              {/* Total Usuarios */}
              <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg p-4 border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-2xl font-bold text-gray-900">{users.length}</div>
                    <div className="text-sm font-medium text-gray-600">Total Usuarios</div>
                  </div>
                  <Users className="h-8 w-8 text-gray-600" />
                </div>
              </div>
              
              {/* Administradores */}
              <div className="bg-gradient-to-r from-red-50 to-red-100 rounded-lg p-4 border border-red-200">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-2xl font-bold text-red-900">{getRoleStats().find(s => s.role === 'admin')?.count || 0}</div>
                    <div className="text-sm font-medium text-red-700">Administradores</div>
                  </div>
                  <Shield className="h-8 w-8 text-red-600" />
                </div>
              </div>
              
              {/* Trabajadores */}
              <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-2xl font-bold text-blue-900">{getRoleStats().find(s => s.role === 'trabajador')?.count || 0}</div>
                    <div className="text-sm font-medium text-blue-700">Trabajadores</div>
                  </div>
                  <Users className="h-8 w-8 text-blue-600" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Active Filters */}
      {(roleFilter !== 'todos' || statusFilter !== 'todos') && (
        <div className="bg-white p-4 rounded-xl shadow-sm border border-orange-200">
          <div className="flex flex-wrap gap-2">
            {roleFilter !== 'todos' && (
              <Badge variant="secondary" className="bg-orange-100 text-orange-800">
                Rol: {roleFilter}
                <Button
                  variant="ghost"
                  size="sm"
                  className="ml-1 h-4 w-4 p-0 hover:bg-orange-200"
                  onClick={() => setRoleFilter('todos')}
                >
                  ×
                </Button>
              </Badge>
            )}
            {statusFilter !== 'todos' && (
              <Badge variant="secondary" className="bg-orange-100 text-orange-800">
                Estado: {statusFilter}
                <Button
                  variant="ghost"
                  size="sm"
                  className="ml-1 h-4 w-4 p-0 hover:bg-orange-200"
                  onClick={() => setStatusFilter('todos')}
                >
                  ×
                </Button>
              </Badge>
            )}
          </div>
        </div>
      )}

      {/* Users Content */}
      <div className="bg-white rounded-xl shadow-sm border border-orange-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              Empleados ({filteredUsers.length} de {users.length})
            </h2>
            <p className="text-gray-600 text-sm">
              {viewMode === 'cards' ? 'Vista de tarjetas' : 'Vista de tabla'}
            </p>
          </div>
        </div>

        {filteredUsers.length === 0 ? (
          <div className="text-center py-12">
            <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No se encontraron empleados</h3>
            <p className="text-gray-600 mb-4">
              {searchTerm || roleFilter !== 'todos' || statusFilter !== 'todos'
                ? 'Intenta ajustar los filtros de búsqueda'
                : 'Comienza agregando el primer empleado al sistema'
              }
            </p>
            <Button 
              onClick={() => setIsCreateModalOpen(true)}
              className="bg-orange-500 hover:bg-orange-600"
            >
              <UserPlus className="h-4 w-4 mr-2" />
              Agregar Empleado
            </Button>
          </div>
        ) : viewMode === 'cards' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredUsers.map((user) => (
              <UserCard
                key={user.id}
                user={user}
                onEdit={handleEditUser}
                onDelete={handleDeleteUser}
              />
            ))}
          </div>
        ) : (
          <div className="border rounded-lg">
            <SimpleUserTable
              users={filteredUsers}
              onEdit={handleEditUser}
              onDelete={handleDeleteUser}
              onStatusChange={handleStatusChange}
            />
          </div>
        )}
      </div>

      {/* Modals */}
      <CreateUserModal
        open={isCreateModalOpen}
        onOpenChange={setIsCreateModalOpen}
        onUserCreated={handleUserCreated}
      />

      {editingUser && (
        <EditUserModal
          user={editingUser}
          open={!!editingUser}
          onOpenChange={(open) => !open && setEditingUser(null)}
          onUserUpdated={handleUserUpdated}
        />
      )}

      {deletingUser && (
        <DeleteUserModal
          user={deletingUser}
          open={!!deletingUser}
          onOpenChange={(open) => !open && setDeletingUser(null)}
          onUserDeleted={handleUserDeleted}
        />
      )}
    </div>
  );
}