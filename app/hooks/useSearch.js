// hooks/useSearch.js
import { useState } from "react";
import { useDebounce } from "./useDebounce";

export const useSearch = (initialProducts = []) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const debouncedSearch = useDebounce(searchQuery, 300);

  const filteredProducts = initialProducts.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
      product.description
        ?.toLowerCase()
        .includes(debouncedSearch.toLowerCase());
    const matchesCategory =
      selectedCategory === "All" || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return {
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    filteredProducts,
    debouncedSearch,
  };
};
