'use client'
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { UsersService } from '@/services/users.service';
import { AuthService } from '@/services/auth.service';

interface ConnectionStatus {
  backend: 'connecting' | 'connected' | 'error';
  auth: 'idle' | 'testing' | 'success' | 'error';
  users: 'idle' | 'testing' | 'success' | 'error';
  message: string;
}

export default function BackendConnectionTest() {
  const [status, setStatus] = useState<ConnectionStatus>({
    backend: 'connecting',
    auth: 'idle',
    users: 'idle',
    message: 'Inicializando...'
  });

  const [logs, setLogs] = useState<string[]>([]);

  const addLog = (message: string) => {
    setLogs(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  const testBackendConnection = async () => {
    try {
      setStatus(prev => ({ ...prev, backend: 'connecting', message: 'Conectando al backend...' }));
      addLog('Probando conexión al backend Spring Boot en http://localhost:8080');

      const response = await fetch('http://localhost:8080', {
        method: 'GET',
        mode: 'cors'
      });

      if (response.ok) {
        setStatus(prev => ({ ...prev, backend: 'connected', message: 'Backend conectado' }));
        addLog('Backend respondió correctamente');
        return true;
      } else {
        throw new Error(`Backend respondió con status: ${response.status}`);
      }
    } catch (error) {
      setStatus(prev => ({ ...prev, backend: 'error', message: `Error de conexión: ${error}` }));
      addLog(`Error conectando al backend: ${error}`);
      return false;
    }
  };

  const testAuthEndpoint = async () => {
    try {
      setStatus(prev => ({ ...prev, auth: 'testing' }));
      addLog('Probando endpoint de autenticación...');

      await AuthService.login({
        userName: 'admin',
        password: 'admin123'
      });

      setStatus(prev => ({ ...prev, auth: 'success' }));
      addLog('Autenticación exitosa');
    } catch (error) {
      setStatus(prev => ({ ...prev, auth: 'error' }));
      addLog(`Error en autenticación: ${error}`);
    }
  };

  const testUsersEndpoint = async () => {
    try {
      setStatus(prev => ({ ...prev, users: 'testing' }));
      addLog('Probando endpoint de usuarios...');

      const users = await UsersService.getAllUsers();
      
      setStatus(prev => ({ ...prev, users: 'success' }));
      addLog(`Usuarios obtenidos correctamente: ${users.length} usuarios`);
    } catch (error) {
      setStatus(prev => ({ ...prev, users: 'error' }));
      addLog(`Error obteniendo usuarios: ${error}`);
    }
  };

  const runFullTest = async () => {
    setLogs([]);
    addLog('Iniciando pruebas de conexión...');

    const backendConnected = await testBackendConnection();
    
    if (backendConnected) {
      await testAuthEndpoint();
      await testUsersEndpoint();
    }
  };

  useEffect(() => {
    runFullTest();
  }, []);

  const getStatusColor = (statusValue: string) => {
    switch (statusValue) {
      case 'connected':
      case 'success':
        return 'bg-green-500';
      case 'connecting':
      case 'testing':
        return 'bg-yellow-500';
      case 'error':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getStatusText = (statusValue: string) => {
    switch (statusValue) {
      case 'connected':
      case 'success':
        return 'Exitoso';
      case 'connecting':
      case 'testing':
        return 'Probando...';
      case 'error':
        return 'Error';
      default:
        return 'Esperando';
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          Prueba de Conexión Backend
          <Button 
            onClick={runFullTest} 
            variant="outline" 
            size="sm"
            disabled={status.backend === 'connecting'}
          >
            Reintentar
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Estado de conexiones */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center gap-2">
            <Badge className={getStatusColor(status.backend)}>
              Backend
            </Badge>
            <span className="text-sm">{getStatusText(status.backend)}</span>
          </div>
          
          <div className="flex items-center gap-2">
            <Badge className={getStatusColor(status.auth)}>
              Auth
            </Badge>
            <span className="text-sm">{getStatusText(status.auth)}</span>
          </div>
          
          <div className="flex items-center gap-2">
            <Badge className={getStatusColor(status.users)}>
              Users
            </Badge>
            <span className="text-sm">{getStatusText(status.users)}</span>
          </div>
        </div>

        {/* Mensaje de estado */}
        <div className="p-3 bg-gray-100 rounded-md">
          <p className="text-sm">{status.message}</p>
        </div>

        {/* Configuración actual */}
        <div className="space-y-2 text-sm">
          <h4 className="font-semibold">Configuración actual:</h4>
          <ul className="list-disc list-inside space-y-1 text-gray-600">
            <li>Backend URL: {process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8080'}</li>
            <li>Frontend URL: http://localhost:3000</li>
            <li>Modo: {process.env.NODE_ENV}</li>
          </ul>
        </div>

        {/* Logs */}
        <div className="space-y-2">
          <h4 className="font-semibold text-sm">Logs de conexión:</h4>
          <div className="max-h-40 overflow-y-auto bg-black text-green-400 p-3 rounded text-xs font-mono">
            {logs.map((log, index) => (
              <div key={index}>{log}</div>
            ))}
          </div>
        </div>

        {/* Instrucciones para solucionar problemas */}
        {status.backend === 'error' && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-md">
            <h4 className="font-semibold text-red-800 mb-2">Para solucionar problemas:</h4>
            <ol className="list-decimal list-inside text-sm text-red-700 space-y-1">
              <li>Verifica que el backend Spring Boot esté ejecutándose en el puerto 8080</li>
              <li>Ejecuta: <code className="bg-red-100 px-1 rounded">mvnw.cmd spring-boot:run</code></li>
              <li>Verifica que CORS esté configurado en el backend</li>
              <li>Revisa que PostgreSQL esté ejecutándose</li>
            </ol>
          </div>
        )}
      </CardContent>
    </Card>
  );
}