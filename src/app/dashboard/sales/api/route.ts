// Sales API Route Handlers
import { NextRequest, NextResponse } from 'next/server';
import { SalesService } from '@/services/sales.service';

// GET all sales
export async function GET() {
  try {
    const sales = await SalesService.getAllSales();
    return NextResponse.json(sales);
  } catch (error) {
    console.error('Error fetching sales:', error);
    return NextResponse.json(
      { error: 'Failed to fetch sales' },
      { status: 500 }
    );
  }
}

// POST create sale
export async function POST(request: NextRequest) {
  try {
    const saleData = await request.json();
    const sale = await SalesService.registerSale(saleData);
    return NextResponse.json(sale, { status: 201 });
  } catch (error) {
    console.error('Error creating sale:', error);
    return NextResponse.json(
      { error: 'Failed to create sale' },
      { status: 500 }
    );
  }
}