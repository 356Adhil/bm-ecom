// app/api/products/[id]/route.js
import { featuredProducts } from '@/app/data/products';
import { NextResponse } from 'next/server';

export async function GET(request, context) {
  try {
    // Wait for params to be available
    const params = await context.params;
    const id = params.id;

    const product = featuredProducts.find((p) => p.id.toString() === id);

    if (!product) {
      return new NextResponse('Product not found', { status: 404 });
    }

    return NextResponse.json(product);
  } catch (error) {
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
