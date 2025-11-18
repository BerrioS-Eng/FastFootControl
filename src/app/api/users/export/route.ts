import { NextRequest, NextResponse } from 'next/server';
import { validatePermission } from '@/lib/auth-middleware';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'https://fast-food-back-uh35.onrender.com';

/**
 * API para exportar usuarios en formato CSV
 * POST /api/users/export - Exportar usuarios con filtros aplicados
 */
export async function POST(request: NextRequest) {
  try {
    // Validar permisos
    const permissionCheck = validatePermission(request, 'canViewUsers');
    if (!permissionCheck.isValid) {
      return NextResponse.json(
        { error: permissionCheck.error || 'No tienes permisos para exportar usuarios' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { filters = {}, columns = [], includeInactive = true } = body;

    console.log('🔵 Exporting users with filters:', filters, 'columns:', columns);

    const authHeader = request.headers.get('authorization');
    
    // Obtener todos los usuarios del backend
    const response = await fetch(`${BACKEND_URL}/users/get-all-users`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...(authHeader && { 'Authorization': authHeader }),
      },
    });

    let allUsers = [];
    if (response.ok) {
      const data = await response.json();
      allUsers = Array.isArray(data) ? data : [];
    }

    // Agregar campos predeterminados si no existen
    allUsers = allUsers.map(user => ({
      ...user,
      isActive: user.isActive ?? true,
      lastLogin: user.lastLogin || null,
      createdAt: user.createdAt || new Date().toISOString(),
      department: user.department || user.area || 'General',
      phone: user.phone || '',
    }));

    // Aplicar filtros
    let filteredUsers = allUsers.filter(user => {
      // Filtro por estado activo
      if (!includeInactive && !user.isActive) return false;

      // Filtro de búsqueda
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        const matchesSearch = (
          user.userName?.toLowerCase().includes(searchLower) ||
          user.fullName?.toLowerCase().includes(searchLower) ||
          user.email?.toLowerCase().includes(searchLower) ||
          user.department?.toLowerCase().includes(searchLower)
        );
        if (!matchesSearch) return false;
      }

      // Filtro por rol
      if (filters.role && user.role !== filters.role) return false;

      // Filtro por departamento
      if (filters.department && user.department !== filters.department) return false;

      return true;
    });

    // Definir columnas predeterminadas si no se especifican
    const defaultColumns = ['userName', 'fullName', 'email', 'role', 'isActive', 'createdAt'];
    const exportColumns = columns.length > 0 ? columns : defaultColumns;

    // Mapear etiquetas de columnas
    const columnLabels: Record<string, string> = {
      id: 'ID',
      userId: 'ID de Usuario',
      userName: 'Usuario',
      fullName: 'Nombre Completo',
      email: 'Email',
      phone: 'Teléfono',
      role: 'Rol',
      department: 'Departamento',
      area: 'Área',
      isActive: 'Estado',
      lastLogin: 'Último Acceso',
      createdAt: 'Fecha de Creación',
      updatedAt: 'Última Actualización',
      status: 'Estado'
    };

    // Formatear datos para CSV
    const formatValue = (value: any, column: string) => {
      if (value === null || value === undefined) return '';
      
      switch (column) {
        case 'isActive':
          return value ? 'Activo' : 'Inactivo';
        case 'role':
          switch (value) {
            case 'ADMIN': return 'Administrador';
            case 'MANAGER': return 'Gerente';
            case 'WORKER': return 'Trabajador';
            default: return value;
          }
        case 'lastLogin':
        case 'createdAt':
        case 'updatedAt':
          if (value) {
            const date = new Date(value);
            return date.toLocaleDateString('es-ES') + ' ' + date.toLocaleTimeString('es-ES');
          }
          return '';
        default:
          // Escapar comillas dobles para CSV
          return String(value).replace(/"/g, '""');
      }
    };

    // Crear contenido CSV
    const csvHeaders = exportColumns.map((col: string) => columnLabels[col] || col).join(',');
    const csvRows = filteredUsers.map(user => 
      exportColumns.map((column: string) => {
        const value = formatValue(user[column], column);
        // Envolver en comillas si contiene comas, saltos de línea o comillas
        if (value.includes(',') || value.includes('\n') || value.includes('"')) {
          return `"${value}"`;
        }
        return value;
      }).join(',')
    );

    const csvContent = [csvHeaders, ...csvRows].join('\n');

    // Agregar BOM para UTF-8 (para que Excel lo reconozca correctamente)
    const bom = '\uFEFF';
    const csvWithBom = bom + csvContent;

    console.log('✅ Users exported successfully:', {
      total: allUsers.length,
      filtered: filteredUsers.length,
      columns: exportColumns.length
    });

    // Crear respuesta con archivo CSV
    return new NextResponse(csvWithBom, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="usuarios_${new Date().toISOString().split('T')[0]}.csv"`,
      },
    });

  } catch (error) {
    console.error('Export Users API Error:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor al exportar usuarios' },
      { status: 500 }
    );
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}