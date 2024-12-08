// components/home/FeaturedProducts.jsx
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ProductCard } from "../ui/ProductCard";
import { categories } from "../../data/categories";
import { featuredProducts } from "../../data/products";

export const FeaturedProducts = () => {
  const [activeCategory, setActiveCategory] = useState("All");
  const [filteredProducts, setFilteredProducts] = useState(featuredProducts);

  useEffect(() => {
    const filtered =
      activeCategory === "All"
        ? featuredProducts
        : featuredProducts.filter(
            (product) => product.category === activeCategory
          );
    setFilteredProducts(filtered);
  }, [activeCategory]);

  return (
    <section className="px-4 py-8 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-2xl font-bold">Featured Products</h3>
        <motion.button
          className="text-zinc-500 hover:text-zinc-800 transition-colors"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          View All
        </motion.button>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-4 no-scrollbar">
        {["All", ...categories.map((c) => c.name)].map((category) => (
          <motion.button
            key={category}
            className={`px-4 py-2 rounded-full text-sm whitespace-nowrap transition-all duration-200 ${
              activeCategory === category
                ? "bg-zinc-900 text-white"
                : "bg-white text-zinc-600 hover:bg-zinc-100"
            }`}
            onClick={() => setActiveCategory(category)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {category}
          </motion.button>
        ))}
      </div>

      <motion.div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6" layout>
        <AnimatePresence mode="popLayout">
          {filteredProducts.map((product, index) => (
            <motion.div
              key={product.id}
              layout
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.2 }}
            >
              <ProductCard product={product} index={index} />
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
    </section>
  );
};
