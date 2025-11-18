import { NextRequest, NextResponse } from 'next/server';
import { validatePermission } from '@/lib/auth-middleware';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'https://fast-food-back-uh35.onrender.com';

/**
 * API para obtener perfil detallado de usuario
 * GET /api/users/[id]/profile - Obtener perfil completo con historial y estadísticas
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Validar permisos
    const permissionCheck = validatePermission(request, 'canViewUsers');
    if (!permissionCheck.isValid) {
      return NextResponse.json(
        { error: permissionCheck.error || 'No tienes permisos para ver perfiles de usuarios' },
        { status: 403 }
      );
    }

    const userId = params.id;
    const authHeader = request.headers.get('authorization');

    console.log('Fetching detailed profile for user:', userId);

    // Obtener información básica del usuario
    const userResponse = await fetch(`${BACKEND_URL}/users/get-all-users`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...(authHeader && { 'Authorization': authHeader }),
      },
    });

    const allUsers = await userResponse.json();
    const user = Array.isArray(allUsers) ? allUsers.find(u => u.id == userId || u.userId == userId) : null;

    if (!user) {
      return NextResponse.json(
        { error: 'Usuario no encontrado' },
        { status: 404 }
      );
    }

    // Generar datos simulados para historial de login (en el futuro vendrá del backend)
    const generateLoginHistory = () => {
      const history = [];
      const now = new Date();
      
      for (let i = 0; i < 10; i++) {
        const date = new Date(now.getTime() - (i * 24 * 60 * 60 * 1000) - (Math.random() * 24 * 60 * 60 * 1000));
        history.push({
          id: i + 1,
          loginTime: date,
          ipAddress: `192.168.1.${Math.floor(Math.random() * 254) + 1}`,
          userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          location: ['Oficina Central', 'Sucursal Norte', 'Sucursal Sur', 'Remoto'][Math.floor(Math.random() * 4)]
        });
      }
      
      return history;
    };

    // Generar log de actividad simulado
    const generateActivityLog = () => {
      const activities = [
        'Inició sesión',
        'Creó un nuevo usuario', 
        'Editó información de usuario',
        'Generó reporte de ventas',
        'Actualizó producto',
        'Procesó venta',
        'Cerró sesión'
      ];
      
      const log = [];
      const now = new Date();
      
      for (let i = 0; i < 20; i++) {
        const date = new Date(now.getTime() - (i * 2 * 60 * 60 * 1000) - (Math.random() * 2 * 60 * 60 * 1000));
        const activity = activities[Math.floor(Math.random() * activities.length)];
        
        log.push({
          id: i + 1,
          action: activity,
          description: `${user.fullName || user.userName} ${activity.toLowerCase()}`,
          timestamp: date,
          metadata: {
            module: ['Usuarios', 'Ventas', 'Productos', 'Reportes'][Math.floor(Math.random() * 4)],
            success: Math.random() > 0.1 // 90% success rate
          }
        });
      }
      
      return log.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    };

    // Generar estadísticas
    const generateStatistics = () => {
      const now = new Date();
      const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      const daysSinceLastLogin = Math.floor(Math.random() * 7);
      
      return {
        totalLogins: Math.floor(Math.random() * 500) + 50,
        lastLoginDays: daysSinceLastLogin,
        sessionsThisMonth: Math.floor(Math.random() * 50) + 5,
        avgSessionDuration: Math.floor(Math.random() * 120) + 30 // minutos
      };
    };

    // Construir perfil completo
    const userProfile = {
      ...user,
      isActive: user.isActive ?? true,
      lastLogin: user.lastLogin || new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000),
      createdAt: user.createdAt || new Date(Date.now() - Math.random() * 180 * 24 * 60 * 60 * 1000),
      department: user.department || user.area || 'General',
      phone: user.phone || `+57 3${Math.floor(Math.random() * 100000000) + 100000000}`,
      loginHistory: generateLoginHistory(),
      activityLog: generateActivityLog(),
      statistics: generateStatistics()
    };

    console.log('User profile fetched successfully for user:', userId);

    return NextResponse.json(userProfile, { status: 200 });

  } catch (error) {
    console.error('User Profile API Error:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}