'use client';

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { 
  IconHistory, 
  IconLogin, 
  IconLogout, 
  IconUserEdit,
  IconSettings,
  IconTrash,
  IconPlus,
  IconEye,
  IconCalendar,
  IconClock,
  IconDeviceDesktop,
  IconDeviceMobile
} from "@tabler/icons-react";
import { useAuth } from "@/hooks/useAuth";

interface ActivityItem {
  id: number;
  type: 'login' | 'logout' | 'edit' | 'create' | 'delete' | 'view' | 'settings';
  description: string;
  timestamp: Date;
  device: 'desktop' | 'mobile';
  ipAddress: string;
}

export default function ActivityHistoryPage() {
  const { user } = useAuth();
  const [filter, setFilter] = useState<'all' | 'login' | 'edit' | 'create'>('all');

  // Datos simulados de actividad
  const activities: ActivityItem[] = [
    {
      id: 1,
      type: 'login',
      description: 'Inicio de sesión exitoso',
      timestamp: new Date('2024-10-17T08:30:00'),
      device: 'desktop',
      ipAddress: '192.168.1.100'
    },
    {
      id: 2,
      type: 'view',
      description: 'Visualizó la lista de usuarios',
      timestamp: new Date('2024-10-17T08:32:00'),
      device: 'desktop',
      ipAddress: '192.168.1.100'
    },
    {
      id: 3,
      type: 'create',
      description: 'Creó un nuevo usuario: María López',
      timestamp: new Date('2024-10-17T09:15:00'),
      device: 'desktop',
      ipAddress: '192.168.1.100'
    },
    {
      id: 4,
      type: 'edit',
      description: 'Editó información del usuario: Juan Martínez',
      timestamp: new Date('2024-10-17T10:45:00'),
      device: 'desktop',
      ipAddress: '192.168.1.100'
    },
    {
      id: 5,
      type: 'settings',
      description: 'Accedió a la configuración del sistema',
      timestamp: new Date('2024-10-17T11:20:00'),
      device: 'desktop',
      ipAddress: '192.168.1.100'
    },
    {
      id: 6,
      type: 'logout',
      description: 'Cerró sesión',
      timestamp: new Date('2024-10-16T17:30:00'),
      device: 'desktop',
      ipAddress: '192.168.1.100'
    },
    {
      id: 7,
      type: 'login',
      description: 'Inicio de sesión desde móvil',
      timestamp: new Date('2024-10-16T14:20:00'),
      device: 'mobile',
      ipAddress: '192.168.1.150'
    }
  ];

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'login':
        return <IconLogin className="h-4 w-4" />;
      case 'logout':
        return <IconLogout className="h-4 w-4" />;
      case 'edit':
        return <IconUserEdit className="h-4 w-4" />;
      case 'create':
        return <IconPlus className="h-4 w-4" />;
      case 'delete':
        return <IconTrash className="h-4 w-4" />;
      case 'view':
        return <IconEye className="h-4 w-4" />;
      case 'settings':
        return <IconSettings className="h-4 w-4" />;
      default:
        return <IconHistory className="h-4 w-4" />;
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'login':
        return 'bg-green-500 text-white';
      case 'logout':
        return 'bg-gray-500 text-white';
      case 'edit':
        return 'bg-blue-500 text-white';
      case 'create':
        return 'bg-emerald-500 text-white';
      case 'delete':
        return 'bg-red-500 text-white';
      case 'view':
        return 'bg-purple-500 text-white';
      case 'settings':
        return 'bg-orange-500 text-white';
      default:
        return 'bg-gray-500 text-white';
    }
  };

  const filteredActivities = activities.filter(activity => 
    filter === 'all' || activity.type === filter
  );

  const generateAvatar = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-3 mb-8">
          <IconHistory className="h-8 w-8 text-orange-500" />
          <h1 className="text-3xl font-bold text-gray-900">Historial de Actividad</h1>
        </div>

        {/* Información del usuario */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <Avatar className="h-12 w-12">
                <AvatarFallback className="bg-gradient-to-br from-orange-400 to-orange-600 text-white font-bold">
                  {user ? generateAvatar(user.fullName) : 'U'}
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-semibold text-lg">{user?.fullName}</h3>
                <p className="text-sm text-gray-600">
                  Último acceso: {user?.lastAccess?.toLocaleString('es-ES')}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Filtros */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Filtrar actividad</CardTitle>
            <CardDescription>
              Filtra las actividades por tipo para encontrar lo que buscas
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              <Button
                variant={filter === 'all' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilter('all')}
              >
                Todas
              </Button>
              <Button
                variant={filter === 'login' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilter('login')}
              >
                Inicios de sesión
              </Button>
              <Button
                variant={filter === 'edit' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilter('edit')}
              >
                Ediciones
              </Button>
              <Button
                variant={filter === 'create' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilter('create')}
              >
                Creaciones
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Lista de actividades */}
        <Card>
          <CardHeader>
            <CardTitle>Actividades recientes</CardTitle>
            <CardDescription>
              Registro de todas tus acciones en el sistema
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredActivities.map((activity) => (
                <div key={activity.id} className="flex items-start gap-4 p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                  <div className={`flex items-center justify-center w-8 h-8 rounded-full ${getActivityColor(activity.type)}`}>
                    {getActivityIcon(activity.type)}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900">
                      {activity.description}
                    </p>
                    <div className="flex items-center gap-4 mt-1">
                      <div className="flex items-center gap-1 text-xs text-gray-500">
                        <IconCalendar className="h-3 w-3" />
                        {activity.timestamp.toLocaleDateString('es-ES')}
                      </div>
                      <div className="flex items-center gap-1 text-xs text-gray-500">
                        <IconClock className="h-3 w-3" />
                        {activity.timestamp.toLocaleTimeString('es-ES')}
                      </div>
                      <div className="flex items-center gap-1 text-xs text-gray-500">
                        {activity.device === 'desktop' ? (
                          <IconDeviceDesktop className="h-3 w-3" />
                        ) : (
                          <IconDeviceMobile className="h-3 w-3" />
                        )}
                        {activity.device === 'desktop' ? 'Escritorio' : 'Móvil'}
                      </div>
                      <div className="text-xs text-gray-500">
                        IP: {activity.ipAddress}
                      </div>
                    </div>
                  </div>

                  <Badge className={getActivityColor(activity.type)}>
                    {activity.type}
                  </Badge>
                </div>
              ))}
            </div>

            {filteredActivities.length === 0 && (
              <div className="text-center py-8">
                <IconHistory className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No hay actividades para mostrar con el filtro seleccionado.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}