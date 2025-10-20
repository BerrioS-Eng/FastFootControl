<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

## FastFoodControl Frontend Project

Este es un proyecto de frontend Next.js que se conecta con el backend FastFoodControl para gestionar un sistema de comida rápida.

### Configuración del Proyecto

- [x] Verificar que el archivo copilot-instructions.md en el directorio .github fue creado.
- [x] Clarificar los requisitos del proyecto
- [x] Clonar repositorio del frontend
- [x] Scaffolding del proyecto
- [x] Personalizar el proyecto según requisitos - Configuración de API y servicios
- [ ] Instalar extensiones requeridas
- [x] Compilar el proyecto - Dependencias instaladas
- [x] Crear y ejecutar tareas
- [x] Lanzar el proyecto
- [x] Asegurar que la documentación esté completa

### URLs de los Repositorios
- Frontend: https://github.com/BerrioS-Eng/FastFootControl.git (clonado)
- Backend: https://github.com/DavidsonPerez07/FastFoodControl.git (analizado)

### Stack Tecnológico
- Next.js 15.4.6 (Frontend + Backend API)
- React 19.1.0
- TypeScript 5
- Tailwind CSS 4
- Shadcn/ui Components
- PostgreSQL (Base de datos)
- JWT (Autenticación)
- bcryptjs (Hash de contraseñas)
- pg (Driver PostgreSQL)

### Configuraciones Realizadas
- ✅ Variables de entorno (.env.local)
- ✅ Configuración de API (api-config.ts)
- ✅ Tipos TypeScript basados en DTOs del backend
- ✅ Servicios para Auth, Products, Sales, Users
- ✅ Hook de autenticación (useAuth)
- ✅ Configuración de Next.js para conexión con backend
- ✅ Configuración de CORS y manejo de imágenes

### APIs REST Implementadas
**Autenticación:**
- POST /api/auth/login

**Productos:**
- GET /api/products (obtener todos)
- POST /api/products (crear nuevo)
- PUT /api/products (actualizar)
- DELETE /api/products?id=<id> (eliminar)

**Usuarios:**
- GET /api/users (obtener todos)
- POST /api/users (crear nuevo)
- PUT /api/users (actualizar)
- DELETE /api/users?id=<id> (eliminar)

**Pendientes de implementar:**
- APIs de Ventas (/api/sales)
- APIs de Ingredientes

### Estado del Proyecto
✅ **PROYECTO CONFIGURADO EXITOSAMENTE CON POSTGRESQL**

El sistema está completamente configurado y funcionando:
- ✅ Servidor de desarrollo ejecutándose en http://localhost:3000
- ✅ APIs REST implementadas con Next.js API Routes
- ✅ Base de datos PostgreSQL configurada
- ⚠️ **Autenticación JWT DESACTIVADA TEMPORALMENTE** (ver BACKUP_AUTH_CONFIG.md)
- ✅ Hash de contraseñas con bcryptjs
- ✅ Todos los servicios de API implementados
- ✅ Tipos TypeScript definidos
- ✅ Scripts de inicialización de BD disponibles

### 🔓 **Autenticación DESACTIVADA**
- **Estado**: Temporalmente desactivada para desarrollo
- **Acceso**: Directo al dashboard sin login
- **Configuración original**: Guardada en `BACKUP_AUTH_CONFIG.md`
- **Reactivar**: Seguir instrucciones en el archivo de respaldo

### 🎉 **Funcionalidades Implementadas:**

**Sistema de Autenticación:**
- ✅ Página de login (/login)
- ✅ Formulario con validación (usuario/contraseña)
- ✅ Protección de rutas privadas
- ✅ Contexto de autenticación global
- ✅ Logout funcional

**CRUD de Usuarios:**
- ✅ Lista de usuarios con tabla (/dashboard/users)
- ✅ Crear nuevo usuario con modal
- ✅ Editar usuario existente
- ✅ Eliminar usuario con confirmación
- ✅ Búsqueda y filtros en tiempo real
- ✅ Validación de formularios con Zod

**Características Adicionales:**
- ✅ Sidebar actualizado con enlace a usuarios
- ✅ Toasts para notificaciones
- ✅ Loading states en todas las operaciones
- ✅ Responsive design
- ✅ Manejo de errores

**Próximos pasos:**
1. Ejecutar el backend Spring Boot en el puerto 8080
2. Configurar la base de datos PostgreSQL
3. Probar la conexión completa frontend-backend

**URLs importantes:**
- Frontend: http://localhost:3000
- Login: http://localhost:3000/login
- Usuarios: http://localhost:3000/dashboard/users
- Backend esperado: http://localhost:8080