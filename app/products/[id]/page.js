// app/products/[id]/page.js
"use client";
import { useState, useEffect } from "react";
import { use } from "react";
import { ProductDetails } from "@/app/components/product/ProductDetails";
import { useRouter } from "next/navigation";

export default function ProductPage({ params: paramsPromise }) {
  // Unwrap params at the top level
  const params = use(paramsPromise);
  const productId = params.id;

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchProduct = async () => {
      if (!productId) return;

      setLoading(true);
      try {
        const res = await fetch(`/api/products/${productId}`);
        if (!res.ok) {
          throw new Error("Product not found");
        }
        const data = await res.json();
        setProduct(data);
      } catch (error) {
        console.error("Error fetching product:", error);
        router.push("/products");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId, router]);

  // Loading state with skeleton UI
  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-50">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="grid md:grid-cols-2 gap-8">
            <div className="aspect-square bg-zinc-200 rounded-2xl animate-pulse" />
            <div className="space-y-4">
              <div className="h-8 w-3/4 bg-zinc-200 rounded animate-pulse" />
              <div className="h-4 w-1/2 bg-zinc-200 rounded animate-pulse" />
              <div className="h-16 w-full bg-zinc-200 rounded animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (!product) {
    return (
      <div className="min-h-screen bg-zinc-50">
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <h2 className="text-xl font-bold mb-2">Product not found</h2>
            <button
              onClick={() => router.push("/products")}
              className="text-blue-600 hover:underline"
            >
              Return to Products
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50">
      {/* Product Details */}
      <ProductDetails
        product={product}
        onClose={() => router.push("/products")}
        requiresAuth={false}
        inPage={true} // New prop to indicate this is a page view
      />
    </div>
  );
}
