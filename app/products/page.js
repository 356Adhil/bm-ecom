'use client';
import { useState, useEffect, useCallback } from 'react';
import { ProductCard } from '../components/ui/ProductCard';

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [filters, setFilters] = useState({
    category: 'all',
    priceRange: [],
    sort: 'newest',
  });

  // Move fetchProducts into useCallback to prevent infinite loops
  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams({
        category: filters.category,
        sort: filters.sort,
      });
      const res = await fetch(`/api/products?${queryParams}`);
      const data = await res.json();
      setProducts(data);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
    setLoading(false);
  }, [filters.category, filters.sort]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // Add function to update filters (resolves unused setFilters warning)
  const handleFilterChange = (newFilters) => {
    setFilters((prev) => ({
      ...prev,
      ...newFilters,
    }));
  };

  return (
    <div className="min-h-screen bg-zinc-50">
      <main className="pb-20">
        {/* Add filter controls */}
        <div className="p-4">
          <select
            value={filters.category}
            onChange={(e) => handleFilterChange({ category: e.target.value })}
            className="mb-4 p-2 rounded-lg border"
          >
            <option value="all">All Categories</option>
            <option value="electronics">Electronics</option>
            <option value="clothing">Clothing</option>
            {/* Add more categories as needed */}
          </select>

          <select
            value={filters.sort}
            onChange={(e) => handleFilterChange({ sort: e.target.value })}
            className="ml-2 mb-4 p-2 rounded-lg border"
          >
            <option value="newest">Newest</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
          </select>
        </div>

        {/* Product Grid */}
        <div className="p-4">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {loading
              ? // Skeleton Loading
                [...Array(8)].map((_, i) => (
                  <div key={i} className="animate-pulse">
                    <div className="bg-zinc-200 aspect-square rounded-2xl mb-4" />
                    <div className="h-4 bg-zinc-200 rounded w-3/4 mb-2" />
                    <div className="h-4 bg-zinc-200 rounded w-1/2" />
                  </div>
                ))
              : products.map((product, index) => (
                  <ProductCard key={product.id} product={product} index={index} />
                ))}
          </div>
        </div>
      </main>
    </div>
  );
}
