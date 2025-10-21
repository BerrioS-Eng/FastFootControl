'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { UsersService } from '@/services/users.service';
import { UserDTO } from '@/types/api';
import { toast } from 'sonner';
import { Loader2, AlertTriangle, User } from 'lucide-react';

interface DeleteUserModalProps {
  user: UserDTO | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUserDeleted: () => void;
}

export default function DeleteUserModal({ user, open, onOpenChange, onUserDeleted }: DeleteUserModalProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleDelete = async () => {
    if (!user?.userId) return;

    try {
      setIsLoading(true);
      await UsersService.deleteUser(user.userId);
      toast.success('Usuario eliminado exitosamente');
      onUserDeleted();
      onOpenChange(false);
    } catch (error) {
      console.error('Error deleting user:', error);
      toast.error('Error al eliminar el usuario');
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-destructive">
            <AlertTriangle className="h-5 w-5" />
            Eliminar Usuario
          </DialogTitle>
          <DialogDescription>
            Esta acciÃ³n no se puede deshacer. El usuario serÃ¡ eliminado permanentemente.
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex items-center gap-3 p-4 border rounded-lg bg-muted/50">
          <div className="flex-shrink-0">
            <User className="h-8 w-8 text-muted-foreground" />
          </div>
          <div className="flex-1">
            <p className="text-sm text-muted-foreground">@{user.userName}</p>
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary mt-1">
              {user.role === 'admin' ? 'Administrador' : 'Usuario'}
            </span>
          </div>
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isLoading}
          >
            Cancelar
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={isLoading}
          >
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Eliminar Usuario
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
