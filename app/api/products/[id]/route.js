// app/api/products/[id]/route.js
import { featuredProducts } from "@/app/data/products";
import { NextResponse } from "next/server";

export async function GET(request, { params }) {
  const product = featuredProducts.find((p) => p.id.toString() === params.id);

  if (!product) {
    return new NextResponse("Product not found", { status: 404 });
  }

  return NextResponse.json(product);
}
