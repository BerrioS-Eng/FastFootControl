import React, { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Users, 
  Plus, 
  Search,
  Filter,
  Download,
  RefreshCw,
  Settings,
  HelpCircle
} from 'lucide-react';
import { UserDTO, UserRole } from '@/types/api';
import { 
  UserFilters, 
  SortConfig, 
  QueryConfig, 
  BulkAction, 
  TableColumn 
} from '@/types/enhanced';
import { useUsers } from '@/hooks/useUsers';
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts';
import { useOfflineSync } from '@/hooks/useOfflineSync';
import { useDebounce } from '@/hooks/useDebounce';
import { EnhancedTable } from './EnhancedTable';
import { AdvancedFilters } from './AdvancedFilters';
import { BulkActions } from './BulkActions';
import { UserProfileModal } from './UserProfileModal';
import { ExportButton } from './ExportButton';
import { SkeletonTable } from '@/components/ui/skeleton-table';
import CreateUserModal from './CreateUserModal';
import EditUserModal from './EditUserModal';
import DeleteUserModal from './DeleteUserModal';
import { toast } from 'sonner';
import { format, formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';

interface EnhancedUserManagementProps {
  className?: string;
}

/**
 * Componente principal mejorado para gestión de usuarios
 * Integra todas las funcionalidades avanzadas: filtros, paginación, 
 * acciones en lote, exportación, perfil detallado, etc.
 */
export function EnhancedUserManagement({ className }: EnhancedUserManagementProps) {
  // Estado local
  const [filters, setFilters] = useState<UserFilters>({});
  const [sortConfig, setSortConfig] = useState<SortConfig>({
    key: 'createdAt',
    direction: 'desc'
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserDTO | null>(null);
  const [searchInputRef, setSearchInputRef] = useState<HTMLInputElement | null>(null);

  // Configuración de query para React Query
  const queryConfig: QueryConfig = {
    page: currentPage,
    limit: itemsPerPage,
    search: filters.search,
    filters,
    sort: sortConfig
  };

  // Hook principal de usuarios con React Query
  const {
    users,
    meta,
    isLoading,
    isError,
    error,
    refetch,
    createUser,
    updateUser,
    deleteUser: deleteUserMutation,
    bulkAction,
    isCreating,
    isUpdating,
    isDeleting,
    isBulkActionPending
  } = useUsers(queryConfig);

  // Hook para estado offline
  const { isOnline, wasOffline, pendingCount, markAsOnline } = useOfflineSync();

  // Configurar atajos de teclado
  const { showShortcutsHelp } = useKeyboardShortcuts({
    onCreateNew: () => setShowCreateModal(true),
    onSearch: () => searchInputRef?.focus(),
    onRefresh: () => {
      refetch();
      toast.success('Datos actualizados');
    },
    onSelectAll: handleSelectAll,
    onEscape: () => {
      setShowCreateModal(false);
      setShowEditModal(false);
      setShowDeleteModal(false);
      setShowProfileModal(false);
    }
  });

  // Definir columnas de la tabla
  const columns: TableColumn<UserDTO>[] = [
    {
      key: 'userName',
      label: 'Usuario',
      sortable: true,
      render: (value, user) => (
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 bg-orange-100 rounded-full flex items-center justify-center">
            <Users className="h-4 w-4 text-orange-600" />
          </div>
          <div>
            <div className="font-medium">{user.fullName || value}</div>
            <div className="text-sm text-gray-500">@{value}</div>
          </div>
        </div>
      )
    },
    {
      key: 'email',
      label: 'Email',
      sortable: true,
      render: (value) => value || <span className="text-gray-400">Sin email</span>
    },
    {
      key: 'role',
      label: 'Rol',
      sortable: true,
      render: (value: UserRole) => {
        const colors = {
          ADMIN: 'bg-red-100 text-red-800',
          MANAGER: 'bg-blue-100 text-blue-800',
          WORKER: 'bg-green-100 text-green-800'
        };
        const labels = {
          ADMIN: 'Admin',
          MANAGER: 'Gerente',
          WORKER: 'Trabajador'
        };
        return (
          <Badge className={colors[value] || 'bg-gray-100 text-gray-800'}>
            {labels[value] || value}
          </Badge>
        );
      }
    },
    {
      key: 'isActive',
      label: 'Estado',
      sortable: true,
      render: (value: boolean) => (
        <Badge variant={value ? 'default' : 'secondary'}>
          {value ? 'Activo' : 'Inactivo'}
        </Badge>
      )
    },
    {
      key: 'lastLogin',
      label: 'Último acceso',
      sortable: true,
      render: (value) => value ? (
        <span className="text-sm">
          {formatDistanceToNow(new Date(value), { addSuffix: true, locale: es })}
        </span>
      ) : (
        <span className="text-gray-400 text-sm">Nunca</span>
      )
    },
    {
      key: 'createdAt',
      label: 'Creado',
      sortable: true,
      render: (value) => value ? (
        <span className="text-sm">
          {format(new Date(value), 'dd/MM/yy', { locale: es })}
        </span>
      ) : null
    }
  ];

  // Handlers
  const handleSort = (key: keyof UserDTO) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const handleSelect = (id: number) => {
    const newSelected = new Set(selectedIds);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedIds(newSelected);
  };

  function handleSelectAll() {
    if (selectedIds.size === users.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(users.map(user => user.id!)));
    }
  }

  const handleBulkAction = (action: BulkAction, options?: { newRole?: UserRole }) => {
    const request = {
      action,
      userIds: Array.from(selectedIds),
      ...(options?.newRole && { newRole: options.newRole })
    };
    
    bulkAction(request);
    setSelectedIds(new Set());
  };

  const handleView = (user: UserDTO) => {
    setSelectedUser(user);
    setShowProfileModal(true);
  };

  const handleEdit = (user: UserDTO) => {
    setSelectedUser(user);
    setShowEditModal(true);
  };

  const handleDelete = (user: UserDTO) => {
    setSelectedUser(user);
    setShowDeleteModal(true);
  };

  const clearFilters = () => {
    setFilters({});
    setCurrentPage(1);
  };

  // Mostrar indicador offline si es necesario
  if (wasOffline && isOnline) {
    toast.success('Conexión restaurada', {
      description: pendingCount > 0 ? `${pendingCount} acciones pendientes de sincronizar` : undefined,
      action: pendingCount > 0 ? {
        label: 'Sincronizar',
        onClick: () => markAsOnline()
      } : undefined
    });
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header con estado de conexión */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gestión de Usuarios</h1>
          <p className="text-gray-600">
            Administra usuarios con funcionalidades avanzadas
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          {!isOnline && (
            <Badge variant="destructive">Sin conexión</Badge>
          )}
          {pendingCount > 0 && (
            <Badge variant="secondary">
              {pendingCount} pendientes
            </Badge>
          )}
          
          <Button
            variant="ghost"
            size="sm"
            onClick={showShortcutsHelp}
          >
            <HelpCircle className="h-4 w-4" />
            <span className="sr-only">Mostrar atajos de teclado</span>
          </Button>
        </div>
      </div>

      {/* Estadísticas rápidas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Users className="h-8 w-8 text-blue-600" />
              <div>
                <div className="text-2xl font-bold">{meta?.totalItems || 0}</div>
                <div className="text-sm text-gray-600">Total usuarios</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 bg-green-100 rounded-full flex items-center justify-center">
                <Users className="h-4 w-4 text-green-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-green-600">
                  {users.filter(u => u.isActive).length}
                </div>
                <div className="text-sm text-gray-600">Activos</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 bg-red-100 rounded-full flex items-center justify-center">
                <Users className="h-4 w-4 text-red-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-red-600">
                  {users.filter(u => u.role === 'ADMIN').length}
                </div>
                <div className="text-sm text-gray-600">Administradores</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center">
                <Users className="h-4 w-4 text-blue-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-blue-600">
                  {selectedIds.size}
                </div>
                <div className="text-sm text-gray-600">Seleccionados</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filtros avanzados */}
      <AdvancedFilters
        filters={filters}
        onFiltersChange={setFilters}
        onClearFilters={clearFilters}
      />

      {/* Barra de acciones */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-3">
          <Button onClick={() => setShowCreateModal(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Nuevo Usuario
          </Button>
          
          <Button
            variant="outline"
            onClick={() => refetch()}
            disabled={isLoading}
          >
            <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            Actualizar
          </Button>
        </div>

        <div className="flex items-center gap-3">
          <ExportButton
            filters={filters}
            totalUsers={meta?.totalItems || 0}
          />
        </div>
      </div>

      {/* Acciones en lote */}
      {selectedIds.size > 0 && (
        <BulkActions
          selectedCount={selectedIds.size}
          onAction={handleBulkAction}
          isLoading={isBulkActionPending}
          onClearSelection={() => setSelectedIds(new Set())}
        />
      )}

      {/* Tabla o skeleton loading */}
      {isLoading ? (
        <SkeletonTable />
      ) : isError ? (
        <Card>
          <CardContent className="p-8 text-center">
            <div className="text-red-600 mb-2">Error al cargar usuarios</div>
            <div className="text-sm text-gray-600 mb-4">{error}</div>
            <Button onClick={() => refetch()}>
              <RefreshCw className="mr-2 h-4 w-4" />
              Reintentar
            </Button>
          </CardContent>
        </Card>
      ) : (
        <EnhancedTable
          data={users}
          columns={columns}
          meta={meta}
          selectedIds={selectedIds}
          sortConfig={sortConfig}
          onSort={handleSort}
          onSelect={handleSelect}
          onSelectAll={handleSelectAll}
          onPageChange={setCurrentPage}
          onView={handleView}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}

      {/* Modales */}
      <CreateUserModal
        open={showCreateModal}
        onOpenChange={setShowCreateModal}
        onUserCreated={() => {
          setShowCreateModal(false);
        }}
      />

      {selectedUser && (
        <EditUserModal
          open={showEditModal}
          onOpenChange={setShowEditModal}
          user={selectedUser}
          onUserUpdated={() => {
            setShowEditModal(false);
            setSelectedUser(null);
          }}
        />
      )}

      <DeleteUserModal
        open={showDeleteModal}
        onOpenChange={setShowDeleteModal}
        user={selectedUser}
        onUserDeleted={() => {
          setShowDeleteModal(false);
          setSelectedUser(null);
        }}
      />

      <UserProfileModal
        userId={selectedUser?.id}
        open={showProfileModal}
        onOpenChange={(open) => {
          setShowProfileModal(open);
          if (!open) setSelectedUser(null);
        }}
      />
    </div>
  );
}