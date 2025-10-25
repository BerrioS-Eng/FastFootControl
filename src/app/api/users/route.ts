import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'https://fast-food-back-uh35.onrender.com';

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    
    console.log('🔵 Fetching all users from backend...');
    
    const response = await fetch(`${BACKEND_URL}/users/get-all-users`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...(authHeader && { 'Authorization': authHeader }),
      },
    });

    const responseText = await response.text();
    console.log('🔵 Backend get users response:', response.status, responseText);

    let data;
    try {
      data = JSON.parse(responseText);
    } catch {
      data = { message: responseText };
    }

    if (!response.ok) {
      return NextResponse.json(
        { error: data.message || 'Failed to fetch users' },
        { status: response.status }
      );
    }

    console.log('✅ Users fetched successfully:', Array.isArray(data) ? `${data.length} users` : 'data received');
    return NextResponse.json(data, { status: 200 });
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