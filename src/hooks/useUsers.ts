import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { UserDTO, UserRole } from '@/types/api';
import { 
  PaginatedResponse, 
  QueryConfig, 
  BulkActionRequest,
  UserProfile 
} from '@/types/enhanced';
import { toast } from 'sonner';

// Funciones de API
const fetchUsers = async (config: QueryConfig): Promise<PaginatedResponse<UserDTO>> => {
  const params = new URLSearchParams();
  params.append('page', config.page.toString());
  params.append('limit', config.limit.toString());
  
  if (config.search) params.append('search', config.search);
  if (config.filters?.role) params.append('role', config.filters.role);
  if (config.filters?.isActive !== undefined) params.append('isActive', config.filters.isActive.toString());
  if (config.filters?.department) params.append('department', config.filters.department);
  if (config.sort) {
    params.append('sortBy', config.sort.key.toString());
    params.append('sortOrder', config.sort.direction);
  }

  const token = localStorage.getItem('authToken');
  const response = await fetch(`/api/users?${params.toString()}`, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Error al cargar usuarios');
  }

  return response.json();
};

const createUser = async (userData: Partial<UserDTO>): Promise<UserDTO> => {
  const token = localStorage.getItem('authToken');
  const response = await fetch('/api/users', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(userData),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Error al crear usuario');
  }

  return response.json();
};

const updateUser = async (userData: Partial<UserDTO>): Promise<UserDTO> => {
  const token = localStorage.getItem('authToken');
  const response = await fetch('/api/users', {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(userData),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Error al actualizar usuario');
  }

  return response.json();
};

const deleteUser = async (userId: number): Promise<void> => {
  const token = localStorage.getItem('authToken');
  const response = await fetch(`/api/users?id=${userId}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Error al eliminar usuario');
  }
};

const bulkAction = async (request: BulkActionRequest): Promise<any> => {
  const token = localStorage.getItem('authToken');
  const response = await fetch('/api/users/bulk', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Error en acción masiva');
  }

  return response.json();
};

const fetchUserProfile = async (userId: number): Promise<UserProfile> => {
  const token = localStorage.getItem('authToken');
  const response = await fetch(`/api/users/${userId}/profile`, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Error al cargar perfil del usuario');
  }

  return response.json();
};

// Hook principal para usuarios con React Query
export function useUsers(config: QueryConfig) {
  const queryClient = useQueryClient();

  // Query para obtener usuarios
  const {
    data,
    isLoading,
    error,
    refetch,
    isError
  } = useQuery({
    queryKey: ['users', config],
    queryFn: () => fetchUsers(config),
    staleTime: 1000 * 60 * 5, // 5 minutos
    gcTime: 1000 * 60 * 10, // 10 minutos
    retry: 2,
  });

  // Mutation para crear usuario
  const createMutation = useMutation({
    mutationFn: createUser,
    onSuccess: (newUser) => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast.success('Usuario creado exitosamente');
    },
    onError: (error) => {
      toast.error(error.message || 'Error al crear usuario');
    },
  });

  // Mutation para actualizar usuario
  const updateMutation = useMutation({
    mutationFn: updateUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast.success('Usuario actualizado exitosamente');
    },
    onError: (error) => {
      toast.error(error.message || 'Error al actualizar usuario');
    },
  });

  // Mutation para eliminar usuario
  const deleteMutation = useMutation({
    mutationFn: deleteUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast.success('Usuario eliminado exitosamente');
    },
    onError: (error) => {
      toast.error(error.message || 'Error al eliminar usuario');
    },
  });

  // Mutation para acciones en lote
  const bulkMutation = useMutation({
    mutationFn: bulkAction,
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast.success(result.message || 'Acción completada');
    },
    onError: (error) => {
      toast.error(error.message || 'Error en acción masiva');
    },
  });

  return {
    // Datos
    users: data?.data || [],
    meta: data?.meta,
    
    // Estados
    isLoading,
    isError,
    error: error?.message,
    
    // Acciones
    refetch,
    createUser: createMutation.mutate,
    updateUser: updateMutation.mutate,
    deleteUser: deleteMutation.mutate,
    bulkAction: bulkMutation.mutate,
    
    // Estados de mutaciones
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
    isBulkActionPending: bulkMutation.isPending,
  };
}

// Hook para perfil de usuario individual
export function useUserProfile(userId?: number) {
  return useQuery({
    queryKey: ['user-profile', userId],
    queryFn: () => fetchUserProfile(userId!),
    enabled: !!userId,
    staleTime: 1000 * 60 * 2, // 2 minutos
  });
}

// Hook para exportar usuarios
export function useExportUsers() {
  const mutation = useMutation({
    mutationFn: async (filters?: any) => {
      const token = localStorage.getItem('authToken');
      const response = await fetch('/api/users/export', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ filters }),
      });

      if (!response.ok) {
        throw new Error('Error al exportar usuarios');
      }

      const blob = await response.blob();
      return blob;
    },
    onSuccess: (blob) => {
      // Descargar archivo
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `usuarios_${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      toast.success('Usuarios exportados exitosamente');
    },
    onError: (error) => {
      toast.error(error.message || 'Error al exportar usuarios');
    },
  });

  return {
    exportUsers: mutation.mutate,
    isExporting: mutation.isPending,
  };
}