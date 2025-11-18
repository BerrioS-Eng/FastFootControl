import React, { useState, useCallback, useMemo } from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { 
  ChevronUp, 
  ChevronDown, 
  ChevronLeft, 
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Eye,
  Edit,
  Trash2,
  MoreHorizontal,
  User,
  Mail,
  Phone,
  Calendar,
  Clock,
  Shield
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { UserDTO, UserRole } from '@/types/api';
import { TableColumn, SortConfig, PaginationMeta } from '@/types/enhanced';
import { format, formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';
import { cn } from '@/lib/utils';

interface EnhancedTableProps {
  data: UserDTO[];
  columns: TableColumn<UserDTO>[];
  meta?: PaginationMeta;
  loading?: boolean;
  selectedIds: Set<number>;
  sortConfig?: SortConfig;
  onSort: (key: keyof UserDTO) => void;
  onSelect: (id: number) => void;
  onSelectAll: () => void;
  onPageChange: (page: number) => void;
  onView?: (user: UserDTO) => void;
  onEdit?: (user: UserDTO) => void;
  onDelete?: (user: UserDTO) => void;
  className?: string;
}

/**
 * Componente de tabla mejorada con paginación, ordenamiento y selección múltiple
 */
export function EnhancedTable({
  data,
  columns,
  meta,
  loading = false,
  selectedIds,
  sortConfig,
  onSort,
  onSelect,
  onSelectAll,
  onPageChange,
  onView,
  onEdit,
  onDelete,
  className
}: EnhancedTableProps) {

  const isAllSelected = data.length > 0 && selectedIds.size === data.length;
  const isPartiallySelected = selectedIds.size > 0 && selectedIds.size < data.length;

  const SortIcon = ({ column }: { column: keyof UserDTO }) => {
    if (sortConfig?.key !== column) {
      return <ChevronUp className="h-4 w-4 opacity-30" />;
    }
    return sortConfig.direction === 'asc' 
      ? <ChevronUp className="h-4 w-4 text-orange-600" />
      : <ChevronDown className="h-4 w-4 text-orange-600" />;
  };

  const getRoleColor = (role: UserRole) => {
    switch (role) {
      case 'ADMIN': return 'bg-red-100 text-red-800';
      case 'MANAGER': return 'bg-blue-100 text-blue-800';
      case 'WORKER': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getRoleLabel = (role: UserRole) => {
    switch (role) {
      case 'ADMIN': return 'Administrador';
      case 'MANAGER': return 'Gerente';
      case 'WORKER': return 'Trabajador';
      default: return role;
    }
  };

  // Renderizar vista de escritorio
  const renderDesktopTable = () => (
    <div className="border rounded-lg overflow-hidden bg-white">
      <Table>
        <TableHeader>
          <TableRow className="bg-gray-50">
            <TableHead className="w-12">
              <Checkbox
                checked={isAllSelected}
                onCheckedChange={onSelectAll}
                ref={(el: any) => {
                  if (el && el.querySelector && el.querySelector('input')) {
                    el.querySelector('input').indeterminate = isPartiallySelected;
                  }
                }}
                aria-label="Seleccionar todos los usuarios"
              />
            </TableHead>
            {columns.map((column) => (
              <TableHead
                key={String(column.key)}
                className={cn(
                  "font-semibold text-gray-900",
                  column.sortable && "cursor-pointer hover:bg-gray-100 transition-colors",
                  column.align === 'center' && "text-center",
                  column.align === 'right' && "text-right"
                )}
                onClick={() => column.sortable && onSort(column.key)}
                style={{ width: column.width }}
              >
                <div className="flex items-center gap-2">
                  {column.label}
                  {column.sortable && <SortIcon column={column.key} />}
                </div>
              </TableHead>
            ))}
            <TableHead className="w-24 text-center">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((user) => (
            <TableRow 
              key={user.id} 
              className="hover:bg-gray-50 transition-colors"
            >
              <TableCell>
                <Checkbox
                  checked={selectedIds.has(user.id!)}
                  onCheckedChange={() => onSelect(user.id!)}
                  aria-label={`Seleccionar usuario ${user.fullName || user.userName}`}
                />
              </TableCell>
              {columns.map((column) => (
                <TableCell 
                  key={String(column.key)}
                  className={cn(
                    column.align === 'center' && "text-center",
                    column.align === 'right' && "text-right"
                  )}
                >
                  {column.render ? 
                    column.render(user[column.key], user) : 
                    String(user[column.key] || '-')
                  }
                </TableCell>
              ))}
              <TableCell className="text-center">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <MoreHorizontal className="h-4 w-4" />
                      <span className="sr-only">Abrir menú</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    {onView && (
                      <DropdownMenuItem onClick={() => onView(user)}>
                        <Eye className="mr-2 h-4 w-4" />
                        Ver perfil
                      </DropdownMenuItem>
                    )}
                    {onEdit && (
                      <DropdownMenuItem onClick={() => onEdit(user)}>
                        <Edit className="mr-2 h-4 w-4" />
                        Editar
                      </DropdownMenuItem>
                    )}
                    {onDelete && (
                      <DropdownMenuItem 
                        onClick={() => onDelete(user)}
                        className="text-red-600"
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Eliminar
                      </DropdownMenuItem>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );

  // Renderizar vista móvil
  const renderMobileCards = () => (
    <div className="space-y-4">
      {data.map((user) => (
        <Card key={user.id} className="hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="space-y-3">
              {/* Header con checkbox y avatar */}
              <div className="flex items-center space-x-3">
                <Checkbox
                  checked={selectedIds.has(user.id!)}
                  onCheckedChange={() => onSelect(user.id!)}
                  aria-label={`Seleccionar usuario ${user.fullName || user.userName}`}
                />
                <div className="flex-shrink-0">
                  <div className="h-10 w-10 bg-orange-100 rounded-full flex items-center justify-center">
                    <User className="h-5 w-5 text-orange-600" />
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-gray-900 truncate">
                    {user.fullName || user.userName}
                  </h3>
                  <p className="text-sm text-gray-500 truncate flex items-center">
                    <Mail className="h-3 w-3 mr-1" />
                    {user.email || 'Sin email'}
                  </p>
                </div>
              </div>

              {/* Información del usuario */}
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <span className="text-gray-500">Rol:</span>
                  <Badge className={cn("ml-1 text-xs", getRoleColor(user.role))}>
                    {getRoleLabel(user.role)}
                  </Badge>
                </div>
                <div>
                  <span className="text-gray-500">Estado:</span>
                  <Badge className={cn("ml-1 text-xs", 
                    user.isActive ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
                  )}>
                    {user.isActive ? 'Activo' : 'Inactivo'}
                  </Badge>
                </div>
              </div>

              {/* Información adicional */}
              <div className="space-y-1 text-sm text-gray-600">
                {user.phone && (
                  <div className="flex items-center">
                    <Phone className="h-3 w-3 mr-2" />
                    {user.phone}
                  </div>
                )}
                {user.lastLogin && (
                  <div className="flex items-center">
                    <Clock className="h-3 w-3 mr-2" />
                    Último acceso: {formatDistanceToNow(new Date(user.lastLogin), { 
                      addSuffix: true, 
                      locale: es 
                    })}
                  </div>
                )}
                {user.createdAt && (
                  <div className="flex items-center">
                    <Calendar className="h-3 w-3 mr-2" />
                    Creado: {format(new Date(user.createdAt), 'dd/MM/yyyy', { locale: es })}
                  </div>
                )}
              </div>

              {/* Acciones */}
              <div className="flex justify-end space-x-2 pt-2 border-t">
                {onView && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onView(user)}
                  >
                    <Eye className="h-3 w-3 mr-1" />
                    Ver
                  </Button>
                )}
                {onEdit && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onEdit(user)}
                  >
                    <Edit className="h-3 w-3 mr-1" />
                    Editar
                  </Button>
                )}
                {onDelete && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onDelete(user)}
                    className="text-red-600 hover:bg-red-50"
                  >
                    <Trash2 className="h-3 w-3 mr-1" />
                    Eliminar
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );

  return (
    <div className={cn("space-y-4", className)}>
      {/* Vista de escritorio */}
      <div className="hidden md:block">
        {renderDesktopTable()}
      </div>

      {/* Vista móvil */}
      <div className="md:hidden">
        {renderMobileCards()}
      </div>

      {/* Paginación */}
      {meta && (
        <EnhancedPagination
          meta={meta}
          onPageChange={onPageChange}
        />
      )}
    </div>
  );
}

interface PaginationProps {
  meta: PaginationMeta;
  onPageChange: (page: number) => void;
}

function EnhancedPagination({ meta, onPageChange }: PaginationProps) {
  const { currentPage, totalPages, totalItems, itemsPerPage, hasNextPage, hasPreviousPage } = meta;

  const startItem = ((currentPage - 1) * itemsPerPage) + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  // Generar números de página
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisible = 5;
    
    if (totalPages <= maxVisible) {
      // Mostrar todas las páginas
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Lógica más compleja para muchas páginas
      if (currentPage <= 3) {
        pages.push(1, 2, 3, 4, '...', totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages);
      }
    }
    
    return pages;
  };

  return (
    <div className="flex items-center justify-between flex-wrap gap-4">
      <div className="text-sm text-gray-700">
        Mostrando {startItem} - {endItem} de {totalItems} usuarios
      </div>
      
      <div className="flex items-center space-x-1">
        {/* Primera página */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(1)}
          disabled={!hasPreviousPage}
        >
          <ChevronsLeft className="h-4 w-4" />
          <span className="sr-only">Primera página</span>
        </Button>
        
        {/* Página anterior */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={!hasPreviousPage}
        >
          <ChevronLeft className="h-4 w-4" />
          <span className="sr-only">Página anterior</span>
        </Button>

        {/* Números de página */}
        {getPageNumbers().map((page, index) => (
          page === '...' ? (
            <span key={`ellipsis-${index}`} className="px-2">...</span>
          ) : (
            <Button
              key={page}
              variant={page === currentPage ? "default" : "outline"}
              size="sm"
              onClick={() => onPageChange(page as number)}
              className={page === currentPage ? "bg-orange-600 hover:bg-orange-700" : ""}
            >
              {page}
            </Button>
          )
        ))}

        {/* Página siguiente */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={!hasNextPage}
        >
          <ChevronRight className="h-4 w-4" />
          <span className="sr-only">Página siguiente</span>
        </Button>

        {/* Última página */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(totalPages)}
          disabled={!hasNextPage}
        >
          <ChevronsRight className="h-4 w-4" />
          <span className="sr-only">Última página</span>
        </Button>
      </div>
    </div>
  );
}