import { NextRequest, NextResponse } from 'next/server';
import { validatePermission } from '@/lib/auth-middleware';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'https://fast-food-back-uh35.onrender.com';

/**
 * API para acciones en lote sobre usuarios
 * POST /api/users/bulk - Ejecutar acciones en lote
 */
export async function POST(request: NextRequest) {
  try {
    // Validar permisos básicos
    const permissionCheck = validatePermission(request, 'canEditUsers');
    if (!permissionCheck.isValid) {
      return NextResponse.json(
        { error: permissionCheck.error || 'No tienes permisos para realizar acciones en lote' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { action, userIds, newRole } = body;

    if (!action || !Array.isArray(userIds) || userIds.length === 0) {
      return NextResponse.json(
        { error: 'Acción y lista de usuarios requeridas' },
        { status: 400 }
      );
    }

    console.log('🔵 Bulk action:', action, 'for users:', userIds, 'by user:', permissionCheck.user?.username);

    const authHeader = request.headers.get('authorization');
    const results = [];
    let successCount = 0;
    let errorCount = 0;

    // Procesar cada usuario individualmente
    // En el futuro, el backend debería soportar acciones en lote nativas
    for (const userId of userIds) {
      try {
        let response;

        switch (action) {
          case 'activate':
            // Simular activación (actualizando el estado del usuario)
            response = await fetch(`${BACKEND_URL}/users/update-user`, {
              method: 'PUT',
              headers: {
                'Content-Type': 'application/json',
                ...(authHeader && { 'Authorization': authHeader }),
              },
              body: JSON.stringify({
                userId: userId,
                isActive: true
              }),
            });
            break;

          case 'deactivate':
            // Simular desactivación
            response = await fetch(`${BACKEND_URL}/users/update-user`, {
              method: 'PUT',
              headers: {
                'Content-Type': 'application/json',
                ...(authHeader && { 'Authorization': authHeader }),
              },
              body: JSON.stringify({
                userId: userId,
                isActive: false
              }),
            });
            break;

          case 'changeRole':
            if (!newRole) {
              throw new Error('Nuevo rol requerido');
            }
            // Validar permisos para cambiar roles
            const rolePermissionCheck = validatePermission(request, 'canEditUsers');
            if (!rolePermissionCheck.isValid) {
              throw new Error('Sin permisos para cambiar roles');
            }

            response = await fetch(`${BACKEND_URL}/users/update-user`, {
              method: 'PUT',
              headers: {
                'Content-Type': 'application/json',
                ...(authHeader && { 'Authorization': authHeader }),
              },
              body: JSON.stringify({
                userId: userId,
                role: newRole
              }),
            });
            break;

          case 'delete':
            // Validar permisos de eliminación
            const deletePermissionCheck = validatePermission(request, 'canDeleteUsers');
            if (!deletePermissionCheck.isValid) {
              throw new Error('Sin permisos para eliminar usuarios');
            }

            response = await fetch(`${BACKEND_URL}/users/delete-user?userId=${userId}`, {
              method: 'DELETE',
              headers: {
                'Content-Type': 'application/json',
                ...(authHeader && { 'Authorization': authHeader }),
              },
            });
            break;

          default:
            throw new Error(`Acción no soportada: ${action}`);
        }

        if (response && response.ok) {
          results.push({ userId, status: 'success', action });
          successCount++;
        } else {
          const errorText = response ? await response.text() : 'Unknown error';
          results.push({ userId, status: 'error', action, error: errorText });
          errorCount++;
        }

      } catch (error) {
        console.error(`Error processing user ${userId}:`, error);
        results.push({ 
          userId, 
          status: 'error', 
          action, 
          error: error instanceof Error ? error.message : 'Unknown error' 
        });
        errorCount++;
      }
    }

    console.log(`✅ Bulk action completed: ${successCount} success, ${errorCount} errors`);

    return NextResponse.json({
      message: `Acción completada: ${successCount} exitosos, ${errorCount} errores`,
      results,
      summary: {
        total: userIds.length,
        success: successCount,
        errors: errorCount,
        action
      }
    }, { status: 200 });

  } catch (error) {
    console.error('Bulk Action API Error:', error);
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
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}