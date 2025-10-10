// Products API Route Handlers
import { NextRequest, NextResponse } from 'next/server';
import { ProductsService } from '@/services/products.service';
import { ProductDTO } from '@/types/api';

// GET all products
export async function GET() {
  try {
    const products = await ProductsService.getAllProducts();
    return NextResponse.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
}

// POST create product
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const name = formData.get('name') as string;
    const description = formData.get('description') as string;
    const price = parseFloat(formData.get('price') as string);
    const category = formData.get('category') as string;
    const availability = formData.get('availability') === 'true';
    const image = formData.get('image') as File | null;

    const productData = {
      name,
      description,
      price,
      category,
      availability,
      ...(image && { image }),
    };

    const product = await ProductsService.createProduct(productData);
    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    console.error('Error creating product:', error);
    return NextResponse.json(
      { error: 'Failed to create product' },
      { status: 500 }
    );
  }
}