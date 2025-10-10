'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Search, UserPlus } from 'lucide-react';
import { UsersService } from '@/services/users.service';
import { UserDTO } from '@/types/api';
import UserTable from '@/components/users/UserTable';
import CreateUserModal from '@/components/users/CreateUserModal';
import { toast } from 'sonner';

export default function UsersPage() {
  const [users, setUsers] = useState<UserDTO[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

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

  const filteredUsers = users.filter(user =>
    user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleUserCreated = () => {
    loadUsers();
    setIsCreateModalOpen(false);
    toast.success('Usuario creado exitosamente');
  };

  const handleUserDeleted = () => {
    loadUsers();
    toast.success('Usuario eliminado exitosamente');
  };

  const handleUserUpdated = () => {
    loadUsers();
    toast.success('Usuario actualizado exitosamente');
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
    <div className="container mx-auto py-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Gestión de Usuarios</h1>
          <p className="text-muted-foreground">
            Administra los usuarios del sistema
          </p>
        </div>
        <Button onClick={() => setIsCreateModalOpen(true)} className="flex items-center gap-2">
          <UserPlus className="h-4 w-4" />
          Nuevo Usuario
        </Button>
      </div>

      {/* Search and filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por nombre, usuario, email o rol..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Users Table */}
      <div className="border rounded-lg">
        <UserTable
          users={filteredUsers}
          onUserDeleted={handleUserDeleted}
          onUserUpdated={handleUserUpdated}
        />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-card text-card-foreground rounded-lg border p-4">
          <div className="text-2xl font-bold">{users.length}</div>
          <div className="text-sm text-muted-foreground">Total de usuarios</div>
        </div>
        <div className="bg-card text-card-foreground rounded-lg border p-4">
          <div className="text-2xl font-bold">{filteredUsers.length}</div>
          <div className="text-sm text-muted-foreground">Usuarios mostrados</div>
        </div>
        <div className="bg-card text-card-foreground rounded-lg border p-4">
          <div className="text-2xl font-bold">
            {users.filter(u => u.role === 'admin').length}
          </div>
          <div className="text-sm text-muted-foreground">Administradores</div>
        </div>
      </div>

      {/* Create User Modal */}
      <CreateUserModal
        open={isCreateModalOpen}
        onOpenChange={setIsCreateModalOpen}
        onUserCreated={handleUserCreated}
      />
    </div>
  );
}