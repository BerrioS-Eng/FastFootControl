'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Loader2 } from 'lucide-react';
import { UsersService } from '@/services/users.service';
import { UserDTO } from '@/types/api';
import { userEditSchema, UserEditFormData } from '@/lib/validations';
import { toast } from 'sonner';

interface EditUserModalProps {
  user: UserDTO;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUserUpdated: () => void;
}

export default function EditUserModal({
  user,
  open,
  onOpenChange,
  onUserUpdated,
}: EditUserModalProps) {
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm<UserEditFormData>({
    resolver: zodResolver(userEditSchema),
  });

  const selectedRole = watch('role');
  const selectedArea = watch('area');

  useEffect(() => {
    if (user && open) {
      reset({
        userName: user.userName,
        email: user.email,
        fullName: user.fullName,
        role: user.role,
        area: user.area || '',
        password: '', // Always empty for security
      });
    }
  }, [user, open, reset]);

  const onSubmit = async (data: UserEditFormData) => {
    if (!user.id) return;

    setIsLoading(true);

    try {
      // Remove password if empty (no change)
      const updateData = { ...data };
      if (!updateData.password) {
        delete updateData.password;
      }

      await UsersService.editUser(user.id, updateData as UserDTO);
      onUserUpdated();
      onOpenChange(false);
    } catch (error) {
      console.error('Error updating user:', error);
      toast.error(
        error instanceof Error ? error.message : 'Error al actualizar el usuario'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Editar Usuario</DialogTitle>
          <DialogDescription>
            Modifica la información del usuario. Deja la contraseña vacía si no deseas cambiarla.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="userName">Usuario</Label>
              <Input
                id="userName"
                {...register('userName')}
                className={errors.userName ? 'border-red-500' : ''}
              />
              {errors.userName && (
                <p className="text-sm text-red-500">{errors.userName.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="fullName">Nombre Completo</Label>
              <Input
                id="fullName"
                {...register('fullName')}
                className={errors.fullName ? 'border-red-500' : ''}
              />
              {errors.fullName && (
                <p className="text-sm text-red-500">{errors.fullName.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              {...register('email')}
              className={errors.email ? 'border-red-500' : ''}
            />
            {errors.email && (
              <p className="text-sm text-red-500">{errors.email.message}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="password">Nueva Contraseña</Label>
              <Input
                id="password"
                type="password"
                placeholder="Dejar vacío para mantener actual"
                {...register('password')}
                className={errors.password ? 'border-red-500' : ''}
              />
              {errors.password && (
                <p className="text-sm text-red-500">{errors.password.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="area">Área</Label>
              <Select value={selectedArea} onValueChange={(value) => setValue('area', value)}>
                <SelectTrigger className={errors.area ? 'border-red-500' : ''}>
                  <SelectValue placeholder="Seleccionar área" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cocina">Cocina</SelectItem>
                  <SelectItem value="caja">Caja</SelectItem>
                  <SelectItem value="servicio">Servicio al Cliente</SelectItem>
                  <SelectItem value="limpieza">Limpieza</SelectItem>
                  <SelectItem value="administracion">Administración</SelectItem>
                  <SelectItem value="seguridad">Seguridad</SelectItem>
                </SelectContent>
              </Select>
              {errors.area && (
                <p className="text-sm text-red-500">{errors.area.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="role">Rol</Label>
            <Select value={selectedRole} onValueChange={(value) => setValue('role', value)}>
              <SelectTrigger className={errors.role ? 'border-red-500' : ''}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="admin">Administrador</SelectItem>
                <SelectItem value="trabajador">Trabajador</SelectItem>
              </SelectContent>
            </Select>
            {errors.role && (
              <p className="text-sm text-red-500">{errors.role.message}</p>
            )}
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Actualizando...
                </>
              ) : (
                'Actualizar Usuario'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}