import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/database';
import * as jwt from 'jsonwebtoken';

// JWT payload interface
interface JWTPayload {
  userId: number;
  username: string;
  email: string;
  role: string;
}

// Middleware to verify JWT token
function verifyToken(request: NextRequest): JWTPayload | null {
  const authHeader = request.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }

  const token = authHeader.substring(7);
  try {
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      throw new Error('JWT_SECRET is not defined');
    }
    return jwt.verify(token, jwtSecret) as JWTPayload;
  } catch {
    return null;
  }
}

// GET /api/products - Get all products
export async function GET(request: NextRequest) {
  try {
    const user = verifyToken(request);
    if (!user) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const result = await query(
      'SELECT id, name, description, price, cost, category, image_url, is_available, stock_quantity, created_at, updated_at FROM products ORDER BY name'
    );

    return NextResponse.json({
      success: true,
      data: result.rows,
    });

  } catch (error) {
    console.error('Get products error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/products - Create new product
export async function POST(request: NextRequest) {
  try {
    const user = verifyToken(request);
    if (!user) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { name, description, price, cost, category, imageUrl, isAvailable = true, stockQuantity = 0 } = body;

    if (!name || !price || !cost) {
      return NextResponse.json(
        { success: false, message: 'Name, price, and cost are required' },
        { status: 400 }
      );
    }

    // Insert new product
    const result = await query(
      'INSERT INTO products (name, description, price, cost, category, image_url, is_available, stock_quantity) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *',
      [name, description, price, cost, category, imageUrl, isAvailable, stockQuantity]
    );

    return NextResponse.json({
      success: true,
      message: 'Product created successfully',
      data: result.rows[0],
    });

  } catch (error) {
    console.error('Create product error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT /api/products - Update product
export async function PUT(request: NextRequest) {
  try {
    const user = verifyToken(request);
    if (!user) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { id, name, description, price, cost, category, imageUrl, isAvailable, stockQuantity } = body;

    if (!id) {
      return NextResponse.json(
        { success: false, message: 'Product ID is required' },
        { status: 400 }
      );
    }

    // Update product
    const result = await query(
      'UPDATE products SET name = $1, description = $2, price = $3, cost = $4, category = $5, image_url = $6, is_available = $7, stock_quantity = $8, updated_at = CURRENT_TIMESTAMP WHERE id = $9 RETURNING *',
      [name, description, price, cost, category, imageUrl, isAvailable, stockQuantity, id]
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        { success: false, message: 'Product not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Product updated successfully',
      data: result.rows[0],
    });

  } catch (error) {
    console.error('Update product error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE /api/products - Delete product
export async function DELETE(request: NextRequest) {
  try {
    const user = verifyToken(request);
    if (!user) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { success: false, message: 'Product ID is required' },
        { status: 400 }
      );
    }

    // Delete product
    const result = await query(
      'DELETE FROM products WHERE id = $1 RETURNING id',
      [id]
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        { success: false, message: 'Product not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Product deleted successfully',
    });

  } catch (error) {
    console.error('Delete product error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}