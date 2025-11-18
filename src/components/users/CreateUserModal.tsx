'use client';

import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
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
import { RoleSelector } from '@/components/ui/role-selector';
import { Loader2, UserPlus, Eye, EyeOff } from 'lucide-react';
import { UsersService } from '@/services/users.service';
import { userSchema, UserFormData } from '@/lib/validations';
import { UserRole } from '@/types/api';
import { toast } from 'sonner';

interface CreateUserModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUserCreated: () => void;
}

export default function CreateUserModal({
  open,
  onOpenChange,
  onUserCreated,
}: CreateUserModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    reset,
  } = useForm<UserFormData>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      status: 'activo',
      role: 'WORKER'
    }
  });

  const onSubmit = async (data: UserFormData) => {
    setIsLoading(true);

    try {
      console.log('Creating user with data:', data);
      await UsersService.createUser(data);
      onUserCreated();
      reset();
      toast.success('✅ Usuario creado exitosamente');
    } catch (error) {
      console.error('Error creating user:', error);
      toast.error(
        error instanceof Error ? error.message : 'Error al crear el usuario'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      reset();
    }
    onOpenChange(newOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-orange-100 rounded-lg">
              <UserPlus className="h-5 w-5 text-orange-600" />
            </div>
            <div>
              <DialogTitle className="text-xl">Crear Nuevo Usuario</DialogTitle>
              <DialogDescription className="text-sm text-gray-600 mt-1">
                Completa la información para agregar un nuevo miembro al equipo
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Información Personal */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-gray-200">
              <h3 className="font-semibold text-gray-800">Información Personal</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="fullName" className="text-sm font-medium text-gray-700">
                  Nombre Completo *
                </Label>
                <Input
                  id="fullName"
                  placeholder="Ej: Juan Carlos Pérez"
                  {...register('fullName')}
                  className={`transition-all ${errors.fullName ? 'border-red-500 focus:border-red-500' : 'focus:border-orange-500'}`}
                />
                {errors.fullName && (
                  <p className="text-sm text-red-500 flex items-center gap-1">
                    <span className="w-1 h-1 bg-red-500 rounded-full" />
                    {errors.fullName.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="userName" className="text-sm font-medium text-gray-700">
                  Nombre de Usuario *
                </Label>
                <Input
                  id="userName"
                  placeholder="Ej: jperez123"
                  {...register('userName')}
                  className={`transition-all ${errors.userName ? 'border-red-500 focus:border-red-500' : 'focus:border-orange-500'}`}
                />
                {errors.userName && (
                  <p className="text-sm text-red-500 flex items-center gap-1">
                    <span className="w-1 h-1 bg-red-500 rounded-full" />
                    {errors.userName.message}
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                Correo Electrónico *
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="Ej: juan.perez@empresa.com"
                {...register('email')}
                className={`transition-all ${errors.email ? 'border-red-500 focus:border-red-500' : 'focus:border-orange-500'}`}
              />
              {errors.email && (
                <p className="text-sm text-red-500 flex items-center gap-1">
                  <span className="w-1 h-1 bg-red-500 rounded-full" />
                  {errors.email.message}
                </p>
              )}
            </div>
          </div>

          {/* Acceso y Seguridad */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-gray-200">
              <h3 className="font-semibold text-gray-800">Acceso y Seguridad</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                  Contraseña *
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Mínimo 6 caracteres"
                    {...register('password')}
                    className={`pr-10 transition-all ${errors.password ? 'border-red-500 focus:border-red-500' : 'focus:border-orange-500'}`}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-gray-500" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-500" />
                    )}
                  </Button>
                </div>
                {errors.password && (
                  <p className="text-sm text-red-500 flex items-center gap-1">
                    <span className="w-1 h-1 bg-red-500 rounded-full" />
                    {errors.password.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="area" className="text-sm font-medium text-gray-700">
                  Área de Trabajo *
                </Label>
                <Input
                  id="area"
                  placeholder="Ej: Ventas, Cocina, Administración"
                  {...register('area')}
                  className={`transition-all ${errors.area ? 'border-red-500 focus:border-red-500' : 'focus:border-orange-500'}`}
                />
                {errors.area && (
                  <p className="text-sm text-red-500 flex items-center gap-1">
                    <span className="w-1 h-1 bg-red-500 rounded-full" />
                    {errors.area.message}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Rol y Permisos */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-gray-200">
              <h3 className="font-semibold text-gray-800">Rol y Permisos</h3>
            </div>
            
            <Controller
              name="role"
              control={control}
              render={({ field }) => (
                <RoleSelector
                  value={field.value}
                  onChange={field.onChange}
                  error={errors.role?.message}
                />
              )}
            />
          </div>

          {/* Botones de Acción */}
          <div className="flex flex-col sm:flex-row justify-end gap-3 pt-6 border-t border-gray-200">
            <Button
              type="button"
              variant="outline"
              onClick={() => handleOpenChange(false)}
              disabled={isLoading}
              className="order-2 sm:order-1"
            >
              Cancelar
            </Button>
            <Button 
              type="submit" 
              disabled={isLoading}
              className="order-1 sm:order-2 bg-orange-500 hover:bg-orange-600"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creando Usuario...
                </>
              ) : (
                <>
                  <UserPlus className="mr-2 h-4 w-4" />
                  Crear Usuario
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}