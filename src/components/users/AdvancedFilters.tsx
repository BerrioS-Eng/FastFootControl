import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { 
  Search, 
  Filter, 
  X, 
  Calendar as CalendarIcon,
  Users,
  Building,
  Shield,
  RotateCcw
} from 'lucide-react';
import { UserFilters } from '@/types/enhanced';
import { UserRole } from '@/types/api';
import { useDebounce } from '@/hooks/useDebounce';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { cn } from '@/lib/utils';

interface AdvancedFiltersProps {
  filters: UserFilters;
  onFiltersChange: (filters: UserFilters) => void;
  onClearFilters: () => void;
  className?: string;
}

/**
 * Componente de filtros avanzados con búsqueda en tiempo real
 * Incluye debounce, filtros múltiples y limpieza de filtros
 */
export function AdvancedFilters({
  filters,
  onFiltersChange,
  onClearFilters,
  className
}: AdvancedFiltersProps) {
  const [localSearch, setLocalSearch] = useState(filters.search || '');
  const [showDateFilter, setShowDateFilter] = useState(false);
  
  // Debounce de la búsqueda
  const debouncedSearch = useDebounce(localSearch, 300);

  // Actualizar filtros cuando cambie la búsqueda con debounce
  useEffect(() => {
    if (debouncedSearch !== filters.search) {
      onFiltersChange({ ...filters, search: debouncedSearch });
    }
  }, [debouncedSearch]);

  // Departamentos disponibles (en el futuro podrían venir de una API)
  const departments = [
    'General',
    'Cocina',
    'Servicio',
    'Administración',
    'Limpieza',
    'Seguridad'
  ];

  const roles: { value: UserRole; label: string }[] = [
    { value: 'ADMIN', label: 'Administrador' },
    { value: 'MANAGER', label: 'Gerente' },
    { value: 'WORKER', label: 'Trabajador' }
  ];

  const handleRoleChange = (role: string) => {
    const newRole = role === 'all' ? undefined : (role as UserRole);
    onFiltersChange({ ...filters, role: newRole });
  };

  const handleStatusChange = (status: string) => {
    const isActive = status === 'all' ? undefined : status === 'active';
    onFiltersChange({ ...filters, isActive });
  };

  const handleDepartmentChange = (department: string) => {
    const newDepartment = department === 'all' ? undefined : department;
    onFiltersChange({ ...filters, department: newDepartment });
  };

  const handleDateRangeChange = (range: { from: Date; to: Date } | undefined) => {
    onFiltersChange({ ...filters, dateRange: range });
  };

  // Contar filtros activos
  const activeFiltersCount = [
    filters.search,
    filters.role,
    filters.isActive !== undefined ? 'status' : null,
    filters.department,
    filters.dateRange
  ].filter(Boolean).length;

  const hasActiveFilters = activeFiltersCount > 0;

  return (
    <div className={cn("space-y-4", className)}>
      {/* Barra de búsqueda principal */}
      <div className="relative">
        <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
        <Input
          placeholder="Buscar por nombre, email, usuario o departamento..."
          value={localSearch}
          onChange={(e) => setLocalSearch(e.target.value)}
          className="pl-10 pr-4 h-12 text-base"
        />
        {localSearch && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setLocalSearch('')}
            className="absolute right-2 top-2 h-8 w-8 p-0"
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Limpiar búsqueda</span>
          </Button>
        )}
      </div>

      {/* Filtros rápidos */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Filtro por rol */}
        <div className="flex items-center gap-2">
          <Shield className="h-4 w-4 text-gray-500" />
          <Select value={filters.role || 'all'} onValueChange={handleRoleChange}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Todos los roles" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos los roles</SelectItem>
              {roles.map((role) => (
                <SelectItem key={role.value} value={role.value}>
                  {role.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Filtro por estado */}
        <div className="flex items-center gap-2">
          <Users className="h-4 w-4 text-gray-500" />
          <Select 
            value={
              filters.isActive === undefined ? 'all' : 
              filters.isActive ? 'active' : 'inactive'
            } 
            onValueChange={handleStatusChange}
          >
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Estado" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              <SelectItem value="active">Activos</SelectItem>
              <SelectItem value="inactive">Inactivos</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Filtro por departamento */}
        <div className="flex items-center gap-2">
          <Building className="h-4 w-4 text-gray-500" />
          <Select value={filters.department || 'all'} onValueChange={handleDepartmentChange}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Departamento" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              {departments.map((dept) => (
                <SelectItem key={dept} value={dept}>
                  {dept}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Filtro por fecha */}
        <Popover open={showDateFilter} onOpenChange={setShowDateFilter}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "justify-start text-left font-normal",
                !filters.dateRange && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {filters.dateRange ? (
                `${format(filters.dateRange.from, 'dd/MM/yy')} - ${format(filters.dateRange.to, 'dd/MM/yy')}`
              ) : (
                "Rango de fechas"
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            {/* Aquí iría el componente de calendario de rango */}
            <div className="p-4">
              <p className="text-sm text-gray-600 mb-3">
                Filtro por fecha de creación
              </p>
              <div className="space-y-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const today = new Date();
                    const lastWeek = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
                    handleDateRangeChange({ from: lastWeek, to: today });
                    setShowDateFilter(false);
                  }}
                  className="w-full justify-start"
                >
                  Última semana
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const today = new Date();
                    const lastMonth = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);
                    handleDateRangeChange({ from: lastMonth, to: today });
                    setShowDateFilter(false);
                  }}
                  className="w-full justify-start"
                >
                  Último mes
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    handleDateRangeChange(undefined);
                    setShowDateFilter(false);
                  }}
                  className="w-full justify-start text-red-600"
                >
                  Limpiar filtro
                </Button>
              </div>
            </div>
          </PopoverContent>
        </Popover>

        {/* Botón para limpiar todos los filtros */}
        {hasActiveFilters && (
          <Button
            variant="outline"
            size="sm"
            onClick={onClearFilters}
            className="text-red-600 border-red-200 hover:bg-red-50"
          >
            <RotateCcw className="mr-2 h-4 w-4" />
            Limpiar filtros
          </Button>
        )}
      </div>

      {/* Mostrar filtros activos como badges */}
      {hasActiveFilters && (
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm text-gray-600">Filtros activos:</span>
          
          {filters.search && (
            <Badge variant="secondary" className="flex items-center gap-1">
              "{filters.search}"
              <X 
                className="h-3 w-3 cursor-pointer" 
                onClick={() => {
                  setLocalSearch('');
                  onFiltersChange({ ...filters, search: undefined });
                }}
              />
            </Badge>
          )}
          
          {filters.role && (
            <Badge variant="secondary" className="flex items-center gap-1">
              Rol: {roles.find(r => r.value === filters.role)?.label}
              <X 
                className="h-3 w-3 cursor-pointer" 
                onClick={() => onFiltersChange({ ...filters, role: undefined })}
              />
            </Badge>
          )}
          
          {filters.isActive !== undefined && (
            <Badge variant="secondary" className="flex items-center gap-1">
              {filters.isActive ? 'Activos' : 'Inactivos'}
              <X 
                className="h-3 w-3 cursor-pointer" 
                onClick={() => onFiltersChange({ ...filters, isActive: undefined })}
              />
            </Badge>
          )}
          
          {filters.department && (
            <Badge variant="secondary" className="flex items-center gap-1">
              Depto: {filters.department}
              <X 
                className="h-3 w-3 cursor-pointer" 
                onClick={() => onFiltersChange({ ...filters, department: undefined })}
              />
            </Badge>
          )}
          
          {filters.dateRange && (
            <Badge variant="secondary" className="flex items-center gap-1">
              {format(filters.dateRange.from, 'dd/MM/yy')} - {format(filters.dateRange.to, 'dd/MM/yy')}
              <X 
                className="h-3 w-3 cursor-pointer" 
                onClick={() => onFiltersChange({ ...filters, dateRange: undefined })}
              />
            </Badge>
          )}
        </div>
      )}

      {/* Información de resultados */}
      <div className="text-sm text-gray-500">
        {hasActiveFilters && (
          <span>
            {activeFiltersCount} filtro{activeFiltersCount > 1 ? 's' : ''} activo{activeFiltersCount > 1 ? 's' : ''}
          </span>
        )}
      </div>
    </div>
  );
}