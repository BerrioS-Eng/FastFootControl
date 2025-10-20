'use client';

import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  IconUser, 
  IconMail, 
  IconClock, 
  IconShieldCheck,
  IconEdit,
  IconCalendar
} from "@tabler/icons-react";

export default function ProfilePage() {
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="flex items-center justify-center h-full">
        <p>Cargando perfil...</p>
      </div>
    );
  }

  const generateAvatar = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin':
        return 'bg-red-500 text-white';
      case 'trabajador':
        return 'bg-blue-500 text-white';
      default:
        return 'bg-gray-500 text-white';
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'admin':
        return <IconShieldCheck className="h-4 w-4" />;
      case 'trabajador':
        return <IconUser className="h-4 w-4" />;
      default:
        return <IconUser className="h-4 w-4" />;
    }
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Mi Perfil</h1>
          <Button>
            <IconEdit className="h-4 w-4 mr-2" />
            Editar Perfil
          </Button>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Información Personal */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <IconUser className="h-5 w-5" />
                Información Personal
              </CardTitle>
              <CardDescription>
                Detalles básicos de tu cuenta
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage src="" alt={user.fullName} />
                  <AvatarFallback className="bg-gradient-to-br from-orange-400 to-orange-600 text-white font-bold text-lg">
                    {generateAvatar(user.fullName)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-semibold text-lg">{user.fullName}</h3>
                  <p className="text-sm text-gray-600">@{user.userName}</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <IconMail className="h-4 w-4 text-gray-500" />
                  <span>{user.email}</span>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    {getRoleIcon(user.role)}
                    <span className="text-sm text-gray-500">Rol:</span>
                  </div>
                  <Badge className={getRoleColor(user.role)}>
                    {user.role === 'admin' ? 'Administrador' : 'Trabajador'}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Información Laboral */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <IconClock className="h-5 w-5" />
                Información Laboral
              </CardTitle>
              <CardDescription>
                Detalles de tu trabajo en FastFoodControl
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {user.status && (
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Estado:</span>
                  <Badge 
                    className={
                      user.status === 'activo' ? 'bg-green-500 text-white' :
                      user.status === 'descanso' ? 'bg-yellow-500 text-white' :
                      'bg-gray-500 text-white'
                    }
                  >
                    {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                  </Badge>
                </div>
              )}

              {user.area && (
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Área:</span>
                  <span className="text-sm text-right max-w-[200px]">{user.area}</span>
                </div>
              )}

              {user.lastAccess && (
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Último acceso:</span>
                  <div className="flex items-center gap-1 text-sm">
                    <IconCalendar className="h-3 w-3" />
                    {user.lastAccess.toLocaleDateString('es-ES')}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}