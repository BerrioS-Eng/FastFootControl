'use client';

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Users, 
  Package, 
  ShoppingCart, 
  TrendingUp, 
  DollarSign,
  Clock,
  AlertCircle,
  BarChart3,
  Calendar,
  ArrowRight,
  Activity,
  Star,
  Shield
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { usePermissions } from '@/hooks/usePermissions';

import { RoleBadge } from '@/components/ui/role-badge';
import Link from 'next/link';

export default function DashboardPage() {
  const { user } = useAuth();
  const { hasPermission, isAdmin, isManager, isWorker, userRole } = usePermissions();

  const quickStats = [
    {
      title: 'Productos Activos',
      value: '24',
      change: '+12%',
      changeType: 'positive' as const,
      icon: Package,
      description: 'Productos disponibles',
      color: 'from-blue-500 to-blue-600',
      permission: 'canViewProducts'
    },
    {
      title: 'Ventas Hoy',
      value: '$1,247',
      change: '+8%',
      changeType: 'positive' as const,
      icon: DollarSign,
      description: 'Ingresos del día',
      color: 'from-green-500 to-green-600',
      permission: 'canViewSales'
    },
    {
      title: 'Órdenes Pendientes',
      value: '7',
      change: '-3',
      changeType: 'negative' as const,
      icon: Clock,
      description: 'En preparación',
      color: 'from-orange-500 to-orange-600',
      permission: 'canViewSales'
    },
    {
      title: 'Usuarios Activos',
      value: '12',
      change: '+2',
      changeType: 'positive' as const,
      icon: Users,
      description: 'Equipo conectado',
      color: 'from-purple-500 to-purple-600',
      permission: 'canViewUsers'
    }
  ];

  const quickActions = [
    {
      title: 'Registrar Venta',
      description: 'Crear nueva venta',
      icon: ShoppingCart,
      href: '/dashboard/sales',
      color: 'from-green-500 to-green-600',
      permission: 'canCreateSales'
    },
    {
      title: 'Agregar Producto',
      description: 'Nuevo producto al menú',
      icon: Package,
      href: '/dashboard/products',
      color: 'from-blue-500 to-blue-600',
      permission: 'canCreateProducts'
    },
    {
      title: 'Ver Reportes',
      description: 'Analytics y estadísticas',
      icon: BarChart3,
      href: '/dashboard/analytics',
      color: 'from-purple-500 to-purple-600',
      permission: 'canViewReports'
    },
    {
      title: 'Gestionar Usuarios',
      description: 'Administrar equipo',
      icon: Users,
      href: '/dashboard/users',
      color: 'from-red-500 to-red-600',
      permission: 'canViewUsers'
    }
  ];

  const getWelcomeMessage = () => {
    const hour = new Date().getHours();
    let greeting;
    
    if (hour < 12) greeting = 'Buenos días';
    else if (hour < 18) greeting = 'Buenas tardes';
    else greeting = 'Buenas noches';
    
    return `${greeting}, ${user?.fullName || user?.userName || 'Usuario'}`;
  };

  const getRoleDescription = () => {
    return 'Bienvenido al sistema DeliChicharrones.';
  };

  return (
    <div className="space-y-6">
      {/* Header de Bienvenida */}
      <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-2xl p-6 text-white">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/20 rounded-lg">
                <img src="/logo.png" alt="DeliChicharrones" className="h-6 w-6 rounded-full" />
              </div>
              <div>
                <h1 className="text-2xl lg:text-3xl font-bold">{getWelcomeMessage()}</h1>
                <p className="text-orange-100">{getRoleDescription()}</p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Badge className="bg-white/20 text-white border-white/30">
              <Activity className="h-3 w-3 mr-1" />
              Activo
            </Badge>
          </div>
        </div>
      </div>

      {/* Estadísticas Rápidas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {quickStats.map((stat, index) => {
          const Icon = stat.icon;
          const canView = hasPermission(stat.permission as keyof typeof hasPermission);
          
          return (
            <Card key={index} className={`border-0 shadow-lg bg-gradient-to-r ${stat.color} text-white overflow-hidden relative`}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-white/90 text-sm font-medium">{stat.title}</p>
                    <div className="flex items-center gap-2">
                      {canView ? (
                        <>
                          <span className="text-2xl font-bold">{stat.value}</span>
                          <Badge className={`text-xs ${
                            stat.changeType === 'positive' 
                              ? 'bg-white/20 text-white' 
                              : 'bg-red-500/20 text-red-200'
                          }`}>
                            {stat.change}
                          </Badge>
                        </>
                      ) : (
                        <div className="flex items-center gap-2 text-white/70">
                          <Shield className="h-4 w-4" />
                          <span className="text-sm">Sin acceso</span>
                        </div>
                      )}
                    </div>
                    <p className="text-white/80 text-xs">{stat.description}</p>
                  </div>
                  <div className="p-3 bg-white/20 rounded-lg">
                    <Icon className="h-6 w-6" />
                  </div>
                </div>
                <div className="absolute bottom-0 right-0 w-20 h-20 bg-white/10 rounded-full translate-x-8 translate-y-8" />
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Acciones Rápidas */}
      <Card className="shadow-lg border-0">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <div className="p-2 bg-orange-100 rounded-lg">
              <Star className="h-5 w-5 text-orange-600" />
            </div>
            Acciones Rápidas
          </CardTitle>
          <CardDescription>
            Funciones principales del sistema
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {quickActions.map((action, index) => {
                  const Icon = action.icon;
                  const canAccess = hasPermission(action.permission as keyof typeof hasPermission);
                  
                  return canAccess ? (
                    <Link key={index} href={action.href}>
                      <Card className="hover:shadow-md transition-all duration-300 cursor-pointer border-2 hover:border-orange-200 group">
                        <CardContent className="p-4">
                          <div className="flex items-center gap-3">
                            <div className={`p-3 bg-gradient-to-r ${action.color} rounded-lg group-hover:scale-110 transition-transform`}>
                              <Icon className="h-5 w-5 text-white" />
                            </div>
                            <div className="flex-1">
                              <h3 className="font-semibold text-gray-900 group-hover:text-orange-600 transition-colors">
                                {action.title}
                              </h3>
                              <p className="text-sm text-gray-600">{action.description}</p>
                            </div>
                            <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-orange-600 group-hover:translate-x-1 transition-all" />
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  ) : (
                    <Card key={index} className="border-2 border-gray-100 bg-gray-50">
                      <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="p-3 bg-gray-200 rounded-lg">
                            <Shield className="h-5 w-5 text-gray-400" />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-semibold text-gray-400">{action.title}</h3>
                            <p className="text-sm text-gray-500">Sin permisos de acceso</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}