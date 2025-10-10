# FastFoodControl - Configuración con PostgreSQL

## 📋 Requisitos Previos

1. **Node.js** (versión 18 o superior)
2. **PostgreSQL** (versión 12 o superior)
3. **npm** o **yarn**

## 🚀 Instalación y Configuración

### 1. Instalar PostgreSQL

#### Windows:
- Descarga PostgreSQL desde: https://www.postgresql.org/download/windows/
- Ejecuta el instalador y sigue las instrucciones
- **Importante**: Recuerda la contraseña del usuario `postgres`

#### macOS:
```bash
brew install postgresql
brew services start postgresql
```

#### Linux (Ubuntu/Debian):
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
sudo systemctl enable postgresql
```

### 2. Crear la Base de Datos

Abre la consola de PostgreSQL:

#### Windows:
- Busca "SQL Shell (psql)" en el menú de inicio
- O desde CMD: `psql -U postgres`

#### macOS/Linux:
```bash
sudo -u postgres psql
```

Ejecuta los siguientes comandos en psql:
```sql
-- Crear la base de datos
CREATE DATABASE fastfoodcontrol;

-- Crear un usuario específico (opcional pero recomendado)
CREATE USER fastfood_user WITH PASSWORD 'tu_contraseña_segura';
GRANT ALL PRIVILEGES ON DATABASE fastfoodcontrol TO fastfood_user;

-- Salir de psql
\q
```

### 3. Configurar Variables de Entorno

Edita el archivo `.env.local` en la raíz del proyecto:

```env
# Database Configuration (PostgreSQL)
DATABASE_URL=postgresql://tu_usuario:tu_contraseña@localhost:5432/fastfoodcontrol
DB_HOST=localhost
DB_PORT=5432
DB_NAME=fastfoodcontrol
DB_USER=tu_usuario
DB_PASSWORD=tu_contraseña

# JWT Configuration
JWT_SECRET=tu-clave-secreta-jwt-muy-larga-y-segura-aqui
JWT_EXPIRES_IN=7d

# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:3000/api
NEXT_PUBLIC_API_BASE_URL=http://localhost:3000/api

# Environment
NODE_ENV=development
```

**Ejemplo con usuario postgres:**
```env
DATABASE_URL=postgresql://postgres:tu_contraseña_postgres@localhost:5432/fastfoodcontrol
DB_HOST=localhost
DB_PORT=5432
DB_NAME=fastfoodcontrol
DB_USER=postgres
DB_PASSWORD=tu_contraseña_postgres
JWT_SECRET=mi-clave-secreta-jwt-super-segura-123456789
JWT_EXPIRES_IN=7d
NEXT_PUBLIC_API_URL=http://localhost:3000/api
NEXT_PUBLIC_API_BASE_URL=http://localhost:3000/api
NODE_ENV=development
```

### 4. Instalar Dependencias

```bash
npm install
```

### 5. Inicializar la Base de Datos

```bash
npm run init-db
```

Este comando:
- Verifica la conexión a PostgreSQL
- Crea todas las tablas necesarias
- Inserta datos de prueba
- Crea usuarios por defecto

### 6. Ejecutar la Aplicación

```bash
npm run dev
```

La aplicación estará disponible en: http://localhost:3000

## 👤 Credenciales de Acceso

### Administrador
- **Usuario**: `admin`
- **Contraseña**: `admin123`
- **Permisos**: Completos (crear, editar, eliminar usuarios y productos)

### Usuario Normal
- **Usuario**: `usuario1`
- **Contraseña**: `user123`
- **Permisos**: Básicos (ver y crear ventas)

## 🏗️ Estructura de la Base de Datos

### Tablas Principales:
- **users**: Usuarios del sistema
- **products**: Productos del menú
- **sales**: Ventas realizadas
- **sale_items**: Productos incluidos en cada venta
- **direct_costs**: Costos adicionales por venta
- **ingredients**: Ingredientes disponibles
- **product_ingredients**: Relación producto-ingrediente

### Características:
- ✅ Autenticación JWT
- ✅ Hashing de contraseñas con bcrypt
- ✅ Relaciones entre tablas
- ✅ Índices para mejor rendimiento
- ✅ Triggers para actualización automática de timestamps
- ✅ Validaciones de integridad

## 🔧 Comandos Útiles

```bash
# Inicializar base de datos
npm run init-db

# Generar nuevos hashes de contraseña
npm run generate-hashes

# Ejecutar en desarrollo
npm run dev

# Construir para producción
npm run build

# Ejecutar en producción
npm run start
```

## 🚨 Solución de Problemas

### Error de Conexión a PostgreSQL
1. Verifica que PostgreSQL esté ejecutándose:
   ```bash
   # Windows
   services.msc (busca PostgreSQL)
   
   # macOS
   brew services list | grep postgresql
   
   # Linux
   sudo systemctl status postgresql
   ```

2. Verifica las credenciales en `.env.local`
3. Asegúrate de que la base de datos `fastfoodcontrol` existe

### Error "relation does not exist"
- Ejecuta `npm run init-db` para crear las tablas

### Error JWT_SECRET
- Asegúrate de haber configurado `JWT_SECRET` en `.env.local`

### Puerto ya en uso
- Cambia el puerto en `package.json` o mata el proceso:
  ```bash
  # Windows
  netstat -ano | findstr :3000
  taskkill /PID <PID> /F
  
  # macOS/Linux
  lsof -ti:3000 | xargs kill
  ```

## 📱 Rutas de la Aplicación

- **`/`**: Página principal
- **`/login`**: Inicio de sesión
- **`/dashboard`**: Panel principal (requiere autenticación)
- **`/dashboard/users`**: Gestión de usuarios (requiere rol ADMIN)
- **`/dashboard/products`**: Gestión de productos
- **`/dashboard/sales`**: Gestión de ventas
- **`/dashboard/analytics`**: Análisis y reportes

## 🔐 APIs Disponibles

### Autenticación
- `POST /api/auth/login`: Iniciar sesión

### Usuarios
- `GET /api/users`: Obtener todos los usuarios
- `POST /api/users`: Crear nuevo usuario
- `PUT /api/users`: Actualizar usuario
- `DELETE /api/users?id=<id>`: Eliminar usuario

### Productos
- `GET /api/products`: Obtener todos los productos
- `POST /api/products`: Crear nuevo producto
- `PUT /api/products`: Actualizar producto
- `DELETE /api/products?id=<id>`: Eliminar producto

## 🎯 Próximos Pasos

1. **Accede a la aplicación**: http://localhost:3000/login
2. **Inicia sesión** con las credenciales de administrador
3. **Explora las funcionalidades**:
   - Gestión de usuarios
   - Gestión de productos
   - Sistema de ventas
4. **Personaliza** según tus necesidades

¡Tu sistema FastFoodControl con PostgreSQL está listo para usar! 🎉