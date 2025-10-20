import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

const Analytics = () => {
  return (
    <div className="p-4 sm:p-6 space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Analytics</h1>
        <p className="text-sm sm:text-base text-gray-600">
          Estadísticas y métricas del negocio
        </p>
      </div>

      <div className="grid gap-4 sm:gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Ventas Hoy</CardTitle>
            <CardDescription>Ingresos del día actual</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl sm:text-3xl font-bold text-green-600">$0</div>
            <p className="text-xs sm:text-sm text-gray-500 mt-1">
              +0% desde ayer
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Productos</CardTitle>
            <CardDescription>Total en inventario</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl sm:text-3xl font-bold text-blue-600">0</div>
            <p className="text-xs sm:text-sm text-gray-500 mt-1">
              Productos registrados
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow md:col-span-2 lg:col-span-1">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Usuarios</CardTitle>
            <CardDescription>Personal registrado</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl sm:text-3xl font-bold text-purple-600">0</div>
            <p className="text-xs sm:text-sm text-gray-500 mt-1">
              Administradores y trabajadores
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Próximamente</CardTitle>
          <CardDescription>
            Funciones avanzadas de analytics estarán disponibles pronto
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-2 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
            <div className="p-3 sm:p-4 bg-gray-50 rounded-lg">
              <h4 className="font-semibold text-sm sm:text-base">Gráficos de ventas</h4>
              <p className="text-xs sm:text-sm text-gray-600">Visualización temporal</p>
            </div>
            <div className="p-3 sm:p-4 bg-gray-50 rounded-lg">
              <h4 className="font-semibold text-sm sm:text-base">Reportes PDF</h4>
              <p className="text-xs sm:text-sm text-gray-600">Exportación de datos</p>
            </div>
            <div className="p-3 sm:p-4 bg-gray-50 rounded-lg">
              <h4 className="font-semibold text-sm sm:text-base">Inventario bajo</h4>
              <p className="text-xs sm:text-sm text-gray-600">Alertas automáticas</p>
            </div>
            <div className="p-3 sm:p-4 bg-gray-50 rounded-lg">
              <h4 className="font-semibold text-sm sm:text-base">Tendencias</h4>
              <p className="text-xs sm:text-sm text-gray-600">Análisis predictivo</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default Analytics