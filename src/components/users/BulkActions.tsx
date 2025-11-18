import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
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
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  ChevronDown, 
  Users, 
  UserCheck, 
  UserX, 
  Shield, 
  Trash2,
  AlertTriangle
} from 'lucide-react';
import { UserRole } from '@/types/api';
import { BulkAction } from '@/types/enhanced';

interface BulkActionsProps {
  selectedCount: number;
  onAction: (action: BulkAction, options?: { newRole?: UserRole }) => void;
  isLoading?: boolean;
  onClearSelection: () => void;
  className?: string;
}

/**
 * Componente para acciones en lote sobre usuarios seleccionados
 */
export function BulkActions({
  selectedCount,
  onAction,
  isLoading = false,
  onClearSelection,
  className
}: BulkActionsProps) {
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [showRoleDialog, setShowRoleDialog] = useState(false);
  const [pendingAction, setPendingAction] = useState<BulkAction | null>(null);
  const [newRole, setNewRole] = useState<UserRole>('WORKER');

  if (selectedCount === 0) return null;

  const handleAction = (action: BulkAction) => {
    if (action === 'delete') {
      setPendingAction(action);
      setShowConfirmDialog(true);
    } else if (action === 'changeRole') {
      setShowRoleDialog(true);
    } else {
      onAction(action);
    }
  };

  const confirmAction = () => {
    if (pendingAction) {
      if (pendingAction === 'changeRole') {
        onAction(pendingAction, { newRole });
      } else {
        onAction(pendingAction);
      }
      setShowConfirmDialog(false);
      setShowRoleDialog(false);
      setPendingAction(null);
    }
  };

  const getActionMessage = () => {
    switch (pendingAction) {
      case 'activate':
        return `¿Activar ${selectedCount} usuario${selectedCount > 1 ? 's' : ''}?`;
      case 'deactivate':
        return `¿Desactivar ${selectedCount} usuario${selectedCount > 1 ? 's' : ''}?`;
      case 'delete':
        return `¿Eliminar ${selectedCount} usuario${selectedCount > 1 ? 's' : ''}? Esta acción no se puede deshacer.`;
      case 'changeRole':
        return `¿Cambiar el rol de ${selectedCount} usuario${selectedCount > 1 ? 's' : ''} a ${getRoleLabel(newRole)}?`;
      default:
        return '';
    }
  };

  const getRoleLabel = (role: UserRole) => {
    switch (role) {
      case 'ADMIN': return 'Administrador';
      case 'MANAGER': return 'Gerente';
      case 'WORKER': return 'Trabajador';
    }
  };

  return (
    <>
      <div className={`flex items-center gap-3 ${className}`}>
        {/* Contador de seleccionados */}
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="flex items-center gap-1">
            <Users className="h-3 w-3" />
            {selectedCount} seleccionado{selectedCount > 1 ? 's' : ''}
          </Badge>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearSelection}
            className="text-gray-500 hover:text-gray-700"
          >
            Limpiar selección
          </Button>
        </div>

        {/* Menú de acciones */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              variant="outline" 
              disabled={isLoading}
              className="flex items-center gap-2"
            >
              {isLoading ? (
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-gray-600" />
              ) : (
                <Users className="h-4 w-4" />
              )}
              Acciones en lote
              <ChevronDown className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-48">
            <DropdownMenuItem onClick={() => handleAction('activate')}>
              <UserCheck className="mr-2 h-4 w-4 text-green-600" />
              Activar usuarios
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleAction('deactivate')}>
              <UserX className="mr-2 h-4 w-4 text-yellow-600" />
              Desactivar usuarios
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleAction('changeRole')}>
              <Shield className="mr-2 h-4 w-4 text-blue-600" />
              Cambiar rol
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem 
              onClick={() => handleAction('delete')}
              className="text-red-600 focus:text-red-600"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Eliminar usuarios
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Dialog de confirmación */}
      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {pendingAction === 'delete' && (
                <AlertTriangle className="h-5 w-5 text-red-500" />
              )}
              Confirmar acción
            </DialogTitle>
            <DialogDescription>
              {getActionMessage()}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowConfirmDialog(false)}
            >
              Cancelar
            </Button>
            <Button
              variant={pendingAction === 'delete' ? 'destructive' : 'default'}
              onClick={confirmAction}
              disabled={isLoading}
            >
              {isLoading ? 'Procesando...' : 'Confirmar'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog para cambio de rol */}
      <Dialog open={showRoleDialog} onOpenChange={setShowRoleDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cambiar rol de usuarios</DialogTitle>
            <DialogDescription>
              Selecciona el nuevo rol para {selectedCount} usuario{selectedCount > 1 ? 's' : ''}:
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Select value={newRole} onValueChange={(value: UserRole) => setNewRole(value)}>
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar rol" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ADMIN">
                  <div className="flex items-center gap-2">
                    <Shield className="h-4 w-4 text-red-600" />
                    Administrador
                  </div>
                </SelectItem>
                <SelectItem value="MANAGER">
                  <div className="flex items-center gap-2">
                    <Shield className="h-4 w-4 text-blue-600" />
                    Gerente
                  </div>
                </SelectItem>
                <SelectItem value="WORKER">
                  <div className="flex items-center gap-2">
                    <Shield className="h-4 w-4 text-green-600" />
                    Trabajador
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowRoleDialog(false)}
            >
              Cancelar
            </Button>
            <Button
              onClick={() => {
                setPendingAction('changeRole');
                setShowRoleDialog(false);
                setShowConfirmDialog(true);
              }}
            >
              Continuar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}