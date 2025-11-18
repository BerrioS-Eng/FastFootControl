import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Checkbox } from '@/components/ui/checkbox';
import { 
  Download, 
  FileText, 
  Table, 
  ChevronDown,
  Check
} from 'lucide-react';
import { UserFilters } from '@/types/enhanced';
import { UserDTO } from '@/types/api';
import { useExportUsers } from '@/hooks/useUsers';

interface ExportButtonProps {
  filters?: UserFilters;
  totalUsers: number;
  className?: string;
}

/**
 * Componente para exportar usuarios con opciones avanzadas
 */
export function ExportButton({ filters, totalUsers, className }: ExportButtonProps) {
  const [showDialog, setShowDialog] = useState(false);
  const [selectedColumns, setSelectedColumns] = useState<Set<keyof UserDTO>>(
    new Set(['userName', 'fullName', 'email', 'role', 'isActive', 'createdAt'])
  );
  const [includeInactive, setIncludeInactive] = useState(true);
  
  const { exportUsers, isExporting } = useExportUsers();

  // Definir las columnas disponibles para exportar
  const availableColumns: { key: keyof UserDTO; label: string }[] = [
    { key: 'userName', label: 'Usuario' },
    { key: 'fullName', label: 'Nombre completo' },
    { key: 'email', label: 'Email' },
    { key: 'phone', label: 'Teléfono' },
    { key: 'role', label: 'Rol' },
    { key: 'department', label: 'Departamento' },
    { key: 'isActive', label: 'Estado activo' },
    { key: 'lastLogin', label: 'Último acceso' },
    { key: 'createdAt', label: 'Fecha de creación' },
    { key: 'updatedAt', label: 'Última actualización' },
  ];

  const handleExportCSV = () => {
    const exportFilters = {
      ...filters,
      columns: Array.from(selectedColumns),
      includeInactive
    };
    
    exportUsers(exportFilters);
    setShowDialog(false);
  };

  const handleExportExcel = () => {
    // Por ahora, exportamos como CSV (en el futuro se puede implementar Excel real)
    handleExportCSV();
  };

  const toggleColumn = (column: keyof UserDTO) => {
    const newSelected = new Set(selectedColumns);
    if (newSelected.has(column)) {
      newSelected.delete(column);
    } else {
      newSelected.add(column);
    }
    setSelectedColumns(newSelected);
  };

  const selectAllColumns = () => {
    setSelectedColumns(new Set(availableColumns.map(col => col.key)));
  };

  const deselectAllColumns = () => {
    setSelectedColumns(new Set());
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button 
            variant="outline" 
            className={`flex items-center gap-2 ${className}`}
            disabled={isExporting}
          >
            {isExporting ? (
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-gray-600" />
            ) : (
              <Download className="h-4 w-4" />
            )}
            Exportar
            <ChevronDown className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => setShowDialog(true)}>
            <FileText className="mr-2 h-4 w-4" />
            Exportar como CSV
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setShowDialog(true)}>
            <Table className="mr-2 h-4 w-4" />
            Exportar como Excel
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleExportCSV} className="text-blue-600">
            <Download className="mr-2 h-4 w-4" />
            Exportación rápida
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Dialog de opciones de exportación */}
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Download className="h-5 w-5" />
              Opciones de exportación
            </DialogTitle>
            <DialogDescription>
              Configura los datos que deseas exportar. Se exportarán {totalUsers} usuarios.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            {/* Selección de columnas */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-medium">Columnas a exportar</h3>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={selectAllColumns}
                    className="text-xs"
                  >
                    Todas
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={deselectAllColumns}
                    className="text-xs"
                  >
                    Ninguna
                  </Button>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto">
                {availableColumns.map((column) => (
                  <div key={column.key} className="flex items-center space-x-2">
                    <Checkbox
                      id={column.key}
                      checked={selectedColumns.has(column.key)}
                      onCheckedChange={() => toggleColumn(column.key)}
                    />
                    <label
                      htmlFor={column.key}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                    >
                      {column.label}
                    </label>
                  </div>
                ))}
              </div>
              
              <div className="mt-2 text-xs text-gray-500">
                {selectedColumns.size} de {availableColumns.length} columnas seleccionadas
              </div>
            </div>

            {/* Opciones adicionales */}
            <div>
              <h3 className="font-medium mb-3">Opciones adicionales</h3>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="include-inactive"
                    checked={includeInactive}
                    onCheckedChange={(checked: boolean) => setIncludeInactive(checked)}
                  />
                  <label
                    htmlFor="include-inactive"
                    className="text-sm font-medium leading-none cursor-pointer"
                  >
                    Incluir usuarios inactivos
                  </label>
                </div>
              </div>
            </div>

            {/* Información de filtros aplicados */}
            {(filters?.search || filters?.role || filters?.department) && (
              <div className="bg-blue-50 p-3 rounded-md">
                <h4 className="text-sm font-medium text-blue-900 mb-2">
                  Filtros que se aplicarán:
                </h4>
                <div className="space-y-1 text-xs text-blue-800">
                  {filters.search && (
                    <div>• Búsqueda: "{filters.search}"</div>
                  )}
                  {filters.role && (
                    <div>• Rol: {filters.role}</div>
                  )}
                  {filters.department && (
                    <div>• Departamento: {filters.department}</div>
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button
              variant="outline"
              onClick={() => setShowDialog(false)}
            >
              Cancelar
            </Button>
            <Button
              onClick={handleExportCSV}
              disabled={selectedColumns.size === 0 || isExporting}
            >
              {isExporting ? (
                <>
                  <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  Exportando...
                </>
              ) : (
                <>
                  <Download className="mr-2 h-4 w-4" />
                  Exportar CSV
                </>
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}