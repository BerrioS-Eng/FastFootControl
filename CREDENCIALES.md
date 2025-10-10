# ⚡ Guía Rápida - Obtener Credenciales PostgreSQL

## 🔑 Cómo obtener las credenciales de PostgreSQL

### 1. **Si acabas de instalar PostgreSQL:**

Durante la instalación te pidió una contraseña para el usuario `postgres`. Esa es tu contraseña.

**Actualiza `.env.local` con:**
```env
DATABASE_URL=postgresql://postgres:TU_CONTRASEÑA_AQUI@localhost:5432/fastfoodcontrol
DB_USER=postgres
DB_PASSWORD=TU_CONTRASEÑA_AQUI
```

### 2. **Si no recuerdas la contraseña:**

#### Windows:
```cmd
# Reiniciar PostgreSQL sin autenticación
net stop postgresql-x64-14
net start postgresql-x64-14

# Conectarse como postgres
psql -U postgres

# Cambiar contraseña
ALTER USER postgres PASSWORD 'nueva_contraseña';
```

#### macOS/Linux:
```bash
# Conectarse como postgres
sudo -u postgres psql

# Cambiar contraseña
ALTER USER postgres PASSWORD 'nueva_contraseña';
```

### 3. **Verificar conexión:**

```bash
# Probar conexión con psql
psql -U postgres -d fastfoodcontrol

# Si la base de datos no existe:
psql -U postgres -c "CREATE DATABASE fastfoodcontrol;"
```

## 🚀 Pasos Rápidos para Empezar

1. **Instala PostgreSQL** (si no lo tienes)
2. **Crea la base de datos:**
   ```sql
   CREATE DATABASE fastfoodcontrol;
   ```
3. **Actualiza `.env.local`** con tus credenciales
4. **Ejecuta:**
   ```bash
   npm run init-db
   npm run dev
   ```
5. **Ve a:** http://localhost:3000/login
6. **Inicia sesión con:**
   - Usuario: `admin`
   - Contraseña: `admin123`

## 🆘 Ayuda Rápida

### ¿PostgreSQL no está instalado?
- **Windows**: https://www.postgresql.org/download/windows/
- **macOS**: `brew install postgresql`
- **Linux**: `sudo apt install postgresql`

### ¿Error de conexión?
1. Verifica que PostgreSQL esté ejecutándose
2. Confirma usuario y contraseña en `.env.local`
3. Asegúrate de que la base de datos `fastfoodcontrol` existe

### ¿Necesitas ayuda?
Revisa el archivo `CONFIGURACION_POSTGRESQL.md` para instrucciones completas.

## 🎯 Credenciales por Defecto de la App

Una vez configurada la base de datos, usa estas credenciales para acceder:

### 👨‍💼 Administrador
- **Usuario**: `admin`
- **Contraseña**: `admin123`

### 👤 Usuario Normal  
- **Usuario**: `usuario1`
- **Contraseña**: `user123`