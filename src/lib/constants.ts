// Constantes compartidas en la aplicación

export const USER_ROLES = {
  ADMIN: 'admin',
  WORKER: 'trabajador',
  // Valores alternativos que pueden venir del backend
  ADMIN_ALT: ['ADMIN', 'administrador', 'ADMINISTRADOR'],
  WORKER_ALT: ['WORKER', 'worker', 'empleado', 'EMPLEADO']
} as const;

export const USER_STATUS = {
  ACTIVE: 'activo',
  INACTIVE: 'inactivo',
  ON_BREAK: 'descanso'
} as const;

export const ROLE_COLORS = {
  ADMIN: 'bg-red-100 text-red-800 hover:bg-red-200',
  WORKER: 'bg-blue-100 text-blue-800 hover:bg-blue-200',
  DEFAULT: 'bg-gray-100 text-gray-800 hover:bg-gray-200'
} as const;

export const ROLE_LABELS = {
  ADMIN: 'Administrador',
  WORKER: 'Trabajador'
} as const;

// Función para normalizar roles
export const normalizeRole = (role: string): string => {
  if (!role) return USER_ROLES.WORKER;
  
  const upperRole = role.toUpperCase();
  if (['ADMIN', 'ADMINISTRADOR'].includes(upperRole)) {
    return USER_ROLES.ADMIN;
  }
  
  return USER_ROLES.WORKER;
};

// Función para verificar si un rol es admin
export const isAdminRole = (role: string): boolean => {
  return normalizeRole(role) === USER_ROLES.ADMIN;
};