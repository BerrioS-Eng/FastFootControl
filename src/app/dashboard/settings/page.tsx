'use client';

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { 
  IconSettings, 
  IconBell, 
  IconPalette, 
  IconLanguage,
  IconShield,
  IconMoon,
  IconSun
} from "@tabler/icons-react";

export default function SettingsPage() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-3 mb-8">
          <IconSettings className="h-8 w-8 text-orange-500" />
          <h1 className="text-3xl font-bold text-gray-900">Configuración</h1>
        </div>

        <div className="grid gap-6">
          {/* Apariencia */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <IconPalette className="h-5 w-5" />
                Apariencia
              </CardTitle>
              <CardDescription>
                Personaliza la apariencia de la aplicación
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base flex items-center gap-2">
                    {isDarkMode ? <IconMoon className="h-4 w-4" /> : <IconSun className="h-4 w-4" />}
                    Tema oscuro
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Activa el modo oscuro para reducir la fatiga visual
                  </p>
                </div>
                <Switch
                  checked={isDarkMode}
                  onCheckedChange={setIsDarkMode}
                />
              </div>
            </CardContent>
          </Card>

          {/* Notificaciones */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <IconBell className="h-5 w-5" />
                Notificaciones
              </CardTitle>
              <CardDescription>
                Configura cómo y cuándo recibir notificaciones
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">Notificaciones push</Label>
                  <p className="text-sm text-muted-foreground">
                    Recibe notificaciones en tiempo real
                  </p>
                </div>
                <Switch
                  checked={notifications}
                  onCheckedChange={setNotifications}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">Notificaciones por email</Label>
                  <p className="text-sm text-muted-foreground">
                    Recibe resúmenes diarios por correo electrónico
                  </p>
                </div>
                <Switch
                  checked={emailNotifications}
                  onCheckedChange={setEmailNotifications}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">Sonidos del sistema</Label>
                  <p className="text-sm text-muted-foreground">
                    Reproduce sonidos para acciones importantes
                  </p>
                </div>
                <Switch
                  checked={soundEnabled}
                  onCheckedChange={setSoundEnabled}
                />
              </div>
            </CardContent>
          </Card>

          {/* Idioma y Región */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <IconLanguage className="h-5 w-5" />
                Idioma y Región
              </CardTitle>
              <CardDescription>
                Configuración de localización
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span className="text-sm font-medium">Idioma:</span>
                <span className="text-sm">Español (ES)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm font-medium">Zona horaria:</span>
                <span className="text-sm">GMT-5 (Bogotá)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm font-medium">Formato de fecha:</span>
                <span className="text-sm">DD/MM/YYYY</span>
              </div>
            </CardContent>
          </Card>

          {/* Seguridad */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <IconShield className="h-5 w-5" />
                Seguridad
              </CardTitle>
              <CardDescription>
                Configuración de seguridad y privacidad
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button variant="outline" className="w-full justify-start">
                Cambiar contraseña
              </Button>
              <Button variant="outline" className="w-full justify-start">
                Configurar autenticación de dos factores
              </Button>
              <Button variant="outline" className="w-full justify-start">
                Ver sesiones activas
              </Button>
            </CardContent>
          </Card>

          {/* Botones de acción */}
          <div className="flex gap-4">
            <Button className="flex-1">
              Guardar cambios
            </Button>
            <Button variant="outline" className="flex-1">
              Restablecer configuración
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}