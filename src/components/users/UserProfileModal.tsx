import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
// import { ScrollArea } from '@/components/ui/scroll-area'; // Temporarily disabled
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Clock,
  Shield,
  Activity,
  Globe,
  Monitor,
  Smartphone,
  X,
  Copy,
  ExternalLink
} from 'lucide-react';
import { UserProfile } from '@/types/enhanced';
import { format, formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';
import { toast } from 'sonner';
import { useUserProfile } from '@/hooks/useUsers';

interface UserProfileModalProps {
  userId?: number;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

/**
 * Modal detallado del perfil de usuario con historial y estadísticas
 */
export function UserProfileModal({ userId, open, onOpenChange }: UserProfileModalProps) {
  const { data: userProfile, isLoading, error } = useUserProfile(userId);

  if (!userId) return null;

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copiado al portapapeles`);
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'ADMIN': return 'bg-red-100 text-red-800';
      case 'MANAGER': return 'bg-blue-100 text-blue-800';
      case 'WORKER': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'ADMIN': return 'Administrador';
      case 'MANAGER': return 'Gerente';
      case 'WORKER': return 'Trabajador';
      default: return role;
    }
  };

  const getDeviceIcon = (userAgent: string) => {
    if (userAgent.includes('Mobile')) return <Smartphone className="h-4 w-4" />;
    return <Monitor className="h-4 w-4" />;
  };

  if (isLoading) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-4xl max-h-[90vh]">
          <div className="flex items-center justify-center p-8">
            <div className="flex items-center gap-3">
              <div className="h-6 w-6 animate-spin rounded-full border-2 border-gray-300 border-t-gray-600" />
              <span>Cargando perfil...</span>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  if (error || !userProfile) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-600">
              <X className="h-5 w-5" />
              Error al cargar perfil
            </DialogTitle>
          </DialogHeader>
          <p className="text-gray-600">
            No se pudo cargar la información del usuario. Intenta nuevamente.
          </p>
          <div className="flex justify-end pt-4">
            <Button onClick={() => onOpenChange(false)}>
              Cerrar
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <div className="h-10 w-10 bg-orange-100 rounded-full flex items-center justify-center">
              <User className="h-5 w-5 text-orange-600" />
            </div>
            Perfil de Usuario
          </DialogTitle>
        </DialogHeader>

        <div className="max-h-[calc(90vh-8rem)] overflow-y-auto">
          <div className="space-y-6">
            {/* Información básica */}
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <h2 className="text-xl font-semibold">
                      {userProfile.fullName || userProfile.userName}
                    </h2>
                    <div className="flex items-center gap-2">
                      <Badge className={getRoleColor(userProfile.role)}>
                        {getRoleLabel(userProfile.role)}
                      </Badge>
                      <Badge variant={userProfile.isActive ? 'default' : 'secondary'}>
                        {userProfile.isActive ? 'Activo' : 'Inactivo'}
                      </Badge>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => copyToClipboard(userProfile.email || '', 'Email')}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <User className="h-4 w-4 text-gray-500" />
                      <span className="text-sm text-gray-600">Usuario:</span>
                      <span className="font-medium">{userProfile.userName}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Mail className="h-4 w-4 text-gray-500" />
                      <span className="text-sm text-gray-600">Email:</span>
                      <span className="font-medium">{userProfile.email || 'No especificado'}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Phone className="h-4 w-4 text-gray-500" />
                      <span className="text-sm text-gray-600">Teléfono:</span>
                      <span className="font-medium">{userProfile.phone || 'No especificado'}</span>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <MapPin className="h-4 w-4 text-gray-500" />
                      <span className="text-sm text-gray-600">Departamento:</span>
                      <span className="font-medium">{userProfile.department || 'General'}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Calendar className="h-4 w-4 text-gray-500" />
                      <span className="text-sm text-gray-600">Creado:</span>
                      <span className="font-medium">
                        {userProfile.createdAt ? format(new Date(userProfile.createdAt), 'dd/MM/yyyy HH:mm', { locale: es }) : 'No disponible'}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Clock className="h-4 w-4 text-gray-500" />
                      <span className="text-sm text-gray-600">Último acceso:</span>
                      <span className="font-medium">
                        {userProfile.lastLogin ? formatDistanceToNow(new Date(userProfile.lastLogin), { addSuffix: true, locale: es }) : 'Nunca'}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Tabs defaultValue="statistics" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="statistics">Estadísticas</TabsTrigger>
                <TabsTrigger value="login-history">Historial de Login</TabsTrigger>
                <TabsTrigger value="activity">Actividad</TabsTrigger>
              </TabsList>

              {/* Estadísticas */}
              <TabsContent value="statistics" className="space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <Card>
                    <CardContent className="p-4 text-center">
                      <Globe className="h-8 w-8 mx-auto mb-2 text-blue-600" />
                      <div className="text-2xl font-bold">{userProfile.statistics?.totalLogins || 0}</div>
                      <div className="text-sm text-gray-600">Total de accesos</div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4 text-center">
                      <Calendar className="h-8 w-8 mx-auto mb-2 text-green-600" />
                      <div className="text-2xl font-bold">{userProfile.statistics?.lastLoginDays || 0}</div>
                      <div className="text-sm text-gray-600">Días desde último acceso</div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4 text-center">
                      <Activity className="h-8 w-8 mx-auto mb-2 text-orange-600" />
                      <div className="text-2xl font-bold">{userProfile.statistics?.sessionsThisMonth || 0}</div>
                      <div className="text-sm text-gray-600">Sesiones este mes</div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4 text-center">
                      <Clock className="h-8 w-8 mx-auto mb-2 text-purple-600" />
                      <div className="text-2xl font-bold">{userProfile.statistics?.avgSessionDuration || 0}m</div>
                      <div className="text-sm text-gray-600">Duración promedio</div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              {/* Historial de Login */}
              <TabsContent value="login-history" className="space-y-4">
                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {userProfile.loginHistory?.map((login) => (
                    <Card key={login.id}>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            {getDeviceIcon(login.userAgent)}
                            <div>
                              <div className="font-medium">
                                {format(new Date(login.loginTime), 'dd/MM/yyyy HH:mm', { locale: es })}
                              </div>
                              <div className="text-sm text-gray-600">
                                {login.location || 'Ubicación desconocida'}
                              </div>
                            </div>
                          </div>
                          <div className="text-right text-sm text-gray-500">
                            <div>{login.ipAddress}</div>
                            <div className="truncate max-w-24">
                              {formatDistanceToNow(new Date(login.loginTime), { addSuffix: true, locale: es })}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )) || (
                    <div className="text-center py-8 text-gray-500">
                      No hay historial de login disponible
                    </div>
                  )}
                </div>
              </TabsContent>

              {/* Log de Actividad */}
              <TabsContent value="activity" className="space-y-4">
                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {userProfile.activityLog?.map((activity) => (
                    <Card key={activity.id}>
                      <CardContent className="p-4">
                        <div className="flex items-start gap-3">
                          <Activity className="h-4 w-4 mt-1 text-gray-500" />
                          <div className="flex-1">
                            <div className="font-medium">{activity.action}</div>
                            <div className="text-sm text-gray-600">{activity.description}</div>
                            <div className="text-xs text-gray-500 mt-1">
                              {format(new Date(activity.timestamp), 'dd/MM/yyyy HH:mm', { locale: es })}
                              {activity.metadata?.module && (
                                <span className="ml-2 px-1 bg-gray-100 rounded text-xs">
                                  {activity.metadata.module}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )) || (
                    <div className="text-center py-8 text-gray-500">
                      No hay actividad reciente disponible
                    </div>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>

        <div className="flex justify-end pt-4 border-t">
          <Button onClick={() => onOpenChange(false)}>
            Cerrar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}