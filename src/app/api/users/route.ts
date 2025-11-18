import { NextRequest, NextResponse } from 'next/server';
import { validatePermission } from '@/lib/auth-middleware';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'https://fast-food-back-uh35.onrender.com';

export async function GET(request: NextRequest) {
  try {
    // 🔓 AUTENTICACIÓN TEMPORALMENTE DESACTIVADA PARA DESARROLLO
    // const permissionCheck = validatePermission(request, 'canViewUsers');
    // if (!permissionCheck.isValid) {
    //   console.log('🔴 Permission denied for GET /users:', permissionCheck.error);
    //   return NextResponse.json(
    //     { error: permissionCheck.error || 'No tienes permisos para ver usuarios' },
    //     { status: 403 }
    //   );
    // }
    console.log('🔓 Access granted - Authentication disabled for development');

    // Extraer parámetros de query para paginación, filtros y ordenamiento
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search') || '';
    const role = searchParams.get('role') || '';
    const isActive = searchParams.get('isActive');
    const department = searchParams.get('department') || '';
    const sortBy = searchParams.get('sortBy') || 'createdAt';
    const sortOrder = searchParams.get('sortOrder') || 'desc';

    const authHeader = request.headers.get('authorization');
    
    console.log('🔵 Fetching users with params:', { page, limit, search, role, isActive, department, sortBy, sortOrder });
    
    // Por ahora, obtenemos todos los usuarios del backend y aplicamos filtros en el frontend
    // En el futuro, el backend debería soportar estos parámetros directamente
    const response = await fetch(`${BACKEND_URL}/users/get-all-users`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...(authHeader && { 'Authorization': authHeader }),
      },
    });

    const responseText = await response.text();
    console.log('🔵 Backend get users response:', response.status, responseText);

    let allUsers;
    try {
      allUsers = JSON.parse(responseText);
    } catch {
      allUsers = [];
    }

    if (!response.ok) {
      return NextResponse.json(
        { error: 'Failed to fetch users' },
        { status: response.status }
      );
    }

    // Asegurarse de que tenemos un array
    if (!Array.isArray(allUsers)) {
      allUsers = [];
    }

    // Agregar campos predeterminados si no existen
    allUsers = allUsers.map(user => ({
      ...user,
      isActive: user.isActive ?? true,
      lastLogin: user.lastLogin || new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000),
      createdAt: user.createdAt || new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000),
      department: user.department || user.area || 'General',
      phone: user.phone || '',
    }));

    // Aplicar filtros
    let filteredUsers = allUsers.filter(user => {
      // Filtro de búsqueda (búsqueda en múltiples campos)
      if (search) {
        const searchLower = search.toLowerCase();
        const matchesSearch = (
          user.userName?.toLowerCase().includes(searchLower) ||
          user.fullName?.toLowerCase().includes(searchLower) ||
          user.email?.toLowerCase().includes(searchLower) ||
          user.department?.toLowerCase().includes(searchLower)
        );
        if (!matchesSearch) return false;
      }

      // Filtro por rol
      if (role && user.role !== role) return false;

      // Filtro por estado activo
      if (isActive !== null && isActive !== '') {
        const activeFilter = isActive === 'true';
        if (user.isActive !== activeFilter) return false;
      }

      // Filtro por departamento
      if (department && user.department !== department) return false;

      return true;
    });

    // Aplicar ordenamiento
    filteredUsers.sort((a, b) => {
      let aValue = a[sortBy as keyof typeof a];
      let bValue = b[sortBy as keyof typeof b];

      // Manejar fechas
      if (sortBy === 'createdAt' || sortBy === 'lastLogin') {
        aValue = new Date(aValue as string).getTime();
        bValue = new Date(bValue as string).getTime();
      }

      // Manejar strings
      if (typeof aValue === 'string') {
        aValue = aValue.toLowerCase();
        bValue = (bValue as string).toLowerCase();
      }

      if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

    // Aplicar paginación
    const totalItems = filteredUsers.length;
    const totalPages = Math.ceil(totalItems / limit);
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedUsers = filteredUsers.slice(startIndex, endIndex);

    // Crear respuesta con metadatos de paginación
    const response_data = {
      data: paginatedUsers,
      meta: {
        currentPage: page,
        totalPages,
        totalItems,
        itemsPerPage: limit,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1,
      }
    };

    console.log('✅ Users fetched successfully:', {
      total: totalItems,
      filtered: paginatedUsers.length,
      page: `${page}/${totalPages}`
    });

    return NextResponse.json(response_data, { status: 200 });
  } catch (error) {
    console.error('Users API Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // 🔓 AUTENTICACIÓN TEMPORALMENTE DESACTIVADA PARA DESARROLLO
    // const permissionCheck = validatePermission(request, 'canCreateUsers');
    // if (!permissionCheck.isValid) {
    //   console.log('🔴 Permission denied for POST /users:', permissionCheck.error);
    //   return NextResponse.json(
    //     { error: permissionCheck.error || 'No tienes permisos para crear usuarios' },
    //     { status: 403 }
    //   );
    // }
    console.log('🔓 Access granted - Authentication disabled for development');

    const body = await request.json();
    const authHeader = request.headers.get('authorization');
    
    console.log('🔵 Creating user with data:', body);
    
    const response = await fetch(`${BACKEND_URL}/users/create-user`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(authHeader && { 'Authorization': authHeader }),
      },
      body: JSON.stringify(body),
    });

    const responseText = await response.text();
    console.log('🔵 Backend create user response:', response.status, responseText);

    let data;
    try {
      data = JSON.parse(responseText);
    } catch {
      data = { message: responseText };
    }

    if (!response.ok) {
      return NextResponse.json(
        { error: data.message || 'Failed to create user' },
        { status: response.status }
      );
    }

    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error('Create User API Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    // 🔓 AUTENTICACIÓN TEMPORALMENTE DESACTIVADA PARA DESARROLLO
    // const permissionCheck = validatePermission(request, 'canEditUsers');
    // if (!permissionCheck.isValid) {
    //   console.log('🔴 Permission denied for PUT /users:', permissionCheck.error);
    //   return NextResponse.json(
    //     { error: permissionCheck.error || 'No tienes permisos para editar usuarios' },
    //     { status: 403 }
    //   );
    // }
    console.log('🔓 Access granted - Authentication disabled for development');

    const body = await request.json();
    const authHeader = request.headers.get('authorization');
    
    console.log('🔵 Updating user with data:', body);
    
    const response = await fetch(`${BACKEND_URL}/users/update-user`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...(authHeader && { 'Authorization': authHeader }),
      },
      body: JSON.stringify(body),
    });

    const responseText = await response.text();
    console.log('🔵 Backend update user response:', response.status, responseText);

    let data;
    try {
      data = JSON.parse(responseText);
    } catch {
      data = { message: responseText };
    }

    if (!response.ok) {
      return NextResponse.json(
        { error: data.message || 'Failed to update user' },
        { status: response.status }
      );
    }

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error('Update User API Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    // 🔓 AUTENTICACIÓN TEMPORALMENTE DESACTIVADA PARA DESARROLLO
    // const permissionCheck = validatePermission(request, 'canDeleteUsers');
    // if (!permissionCheck.isValid) {
    //   console.log('🔴 Permission denied for DELETE /users:', permissionCheck.error);
    //   return NextResponse.json(
    //     { error: permissionCheck.error || 'No tienes permisos para eliminar usuarios' },
    //     { status: 403 }
    //   );
    // }
    console.log('🔓 Access granted - Authentication disabled for development');

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const authHeader = request.headers.get('authorization');
    
    if (!id) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    console.log('🔵 Deleting user with ID:', id);

    const response = await fetch(`${BACKEND_URL}/users/delete-user?userId=${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        ...(authHeader && { 'Authorization': authHeader }),
      },
    });

    const responseText = await response.text();
    console.log('🔵 Backend delete user response:', response.status, responseText);

    let data;
    try {
      data = JSON.parse(responseText);
    } catch {
      data = { message: responseText };
    }

    if (!response.ok) {
      return NextResponse.json(
        { error: data.message || 'Failed to delete user' },
        { status: response.status }
      );
    }

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error('Delete User API Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}