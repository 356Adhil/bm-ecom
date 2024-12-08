import { NextResponse } from "next/server";
import { featuredProducts } from "../../data/products";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("query");
  const category = searchParams.get("category");
  const sort = searchParams.get("sort");

  let filteredProducts = [...featuredProducts];

  if (query) {
    filteredProducts = filteredProducts.filter(
      (product) =>
        product.name.toLowerCase().includes(query.toLowerCase()) ||
        product.description.toLowerCase().includes(query.toLowerCase())
    );
  }

  if (category && category !== "all") {
    filteredProducts = filteredProducts.filter(
      (product) => product.category.toLowerCase() === category.toLowerCase()
    );
  }

  if (sort) {
    switch (sort) {
      case "price_asc":
        filteredProducts.sort((a, b) => a.price - b.price);
        break;
      case "price_desc":
        filteredProducts.sort((a, b) => b.price - a.price);
        break;
      case "popular":
        filteredProducts.sort((a, b) => b.reviews - a.reviews);
        break;
      default:
        filteredProducts.sort((a, b) => b.id - a.id);
    }
  }

  return NextResponse.json(filteredProducts);
}
