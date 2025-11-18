'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
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
import { Loader2, User, Mail, Briefcase } from 'lucide-react';
import { UsersService } from '@/services/users.service';
import { UserDTO } from '@/types/api';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/useAuth';

const profileSchema = z.object({
  fullName: z.string().min(1, "El nombre completo es requerido"),
  email: z.string().email("Debe ser un email válido"),
  area: z.string().min(1, "El área es requerida"),
  password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres").optional().or(z.literal("")),
});

type ProfileFormData = z.infer<typeof profileSchema>;

interface EditProfileModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onProfileUpdated: () => void;
}

export default function EditProfileModal({
  open,
  onOpenChange,
  onProfileUpdated,
}: EditProfileModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { user, updateUser } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
  });

  useEffect(() => {
    if (user && open) {
      reset({
        fullName: user.fullName || '',
        email: user.email || '',
        area: user.area || '',
        password: '', // Always empty for security
      });
    }
  }, [user, open, reset]);

  const onSubmit = async (data: ProfileFormData) => {
    if (!user?.userId) {
      toast.error('Error: No se pudo identificar el usuario');
      return;
    }

    setIsLoading(true);

    try {
      // Remove password if empty (no change)
      const updateData = { ...data };
      if (!updateData.password) {
        delete updateData.password;
      }

      await UsersService.editUser(user.userId, updateData as UserDTO);
      
      // Actualizar el usuario en el contexto con los nuevos datos
      const updatedUser = {
        ...user,
        fullName: data.fullName,
        email: data.email,
        area: data.area,
      };

      updateUser(updatedUser);
      toast.success('Perfil actualizado correctamente');
      onProfileUpdated();
      onOpenChange(false);
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Error al actualizar el perfil');
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Editar Mi Perfil
          </DialogTitle>
          <DialogDescription>
            Actualiza tu información personal. Deja la contraseña vacía si no deseas cambiarla.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="fullName" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              Nombre completo
            </Label>
            <Input
              id="fullName"
              placeholder="Tu nombre completo"
              {...register('fullName')}
              className={errors.fullName ? 'border-red-500' : ''}
            />
            {errors.fullName && (
              <p className="text-sm text-red-500">{errors.fullName.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className="flex items-center gap-2">
              <Mail className="h-4 w-4" />
              Email
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="tu@email.com"
              {...register('email')}
              className={errors.email ? 'border-red-500' : ''}
            />
            {errors.email && (
              <p className="text-sm text-red-500">{errors.email.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="area" className="flex items-center gap-2">
              <Briefcase className="h-4 w-4" />
              Área de trabajo
            </Label>
            <Input
              id="area"
              placeholder="Tu área de trabajo"
              {...register('area')}
              className={errors.area ? 'border-red-500' : ''}
            />
            {errors.area && (
              <p className="text-sm text-red-500">{errors.area.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">
              Nueva contraseña (opcional)
            </Label>
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

          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
            >
              Cancelar
            </Button>
            <Button 
              type="submit" 
              disabled={isLoading}
              className="bg-orange-500 hover:bg-orange-600"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Actualizando...
                </>
              ) : (
                'Guardar Cambios'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}