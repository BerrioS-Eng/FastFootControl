'use client'
import React from 'react';
import BackendConnectionTest from '@/components/BackendConnectionTest';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function ConfigPage() {
  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                🔧 Configuración del Sistema
              </h1>
              <p className="text-gray-600 mt-1">
                Verifica la conexión entre frontend y backend
              </p>
            </div>
            <Link href="/dashboard">
              <Button variant="outline">
                ← Volver al Dashboard
              </Button>
            </Link>
          </div>
        </div>

        {/* Componente de prueba de conexión */}
        <BackendConnectionTest />

        {/* Información adicional */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">📋 Estado del Sistema</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-blue-50 rounded-lg">
              <h3 className="font-semibold text-blue-800">Frontend (Next.js)</h3>
              <ul className="text-sm text-blue-600 mt-2 space-y-1">
                <li>✅ Puerto: 3000</li>
                <li>✅ Estado: Ejecutándose</li>
                <li>✅ Estructura: Optimizada</li>
                <li>✅ Dependencias: Limpias</li>
              </ul>
            </div>
            
            <div className="p-4 bg-orange-50 rounded-lg">
              <h3 className="font-semibold text-orange-800">Backend (Spring Boot)</h3>
              <ul className="text-sm text-orange-600 mt-2 space-y-1">
                <li>⚠️ Puerto: 8080</li>
                <li>⚠️ Estado: Verificando...</li>
                <li>⚠️ CORS: Por configurar</li>
                <li>ℹ️ Separado del frontend</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Guía rápida */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">🚀 Guía Rápida</h2>
          <div className="space-y-3">
            <div className="p-3 bg-gray-50 rounded">
              <h4 className="font-medium">1. Iniciar Backend</h4>
              <code className="text-sm bg-black text-green-400 px-2 py-1 rounded mt-1 block">
                cd FastFoodControl && mvnw.cmd spring-boot:run
              </code>
            </div>
            
            <div className="p-3 bg-gray-50 rounded">
              <h4 className="font-medium">2. Verificar PostgreSQL</h4>
              <p className="text-sm text-gray-600 mt-1">
                Asegúrate de que PostgreSQL esté ejecutándose en el puerto 5432
              </p>
            </div>
            
            <div className="p-3 bg-gray-50 rounded">
              <h4 className="font-medium">3. Configurar CORS</h4>
              <p className="text-sm text-gray-600 mt-1">
                El backend debe permitir requests desde http://localhost:3000
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}