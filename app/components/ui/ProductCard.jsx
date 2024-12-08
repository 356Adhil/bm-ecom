// components/ui/ProductCard.jsx
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Star, Heart, ShoppingBag } from "lucide-react";
import Image from "next/image";
import { useStore } from "../../lib/store";

const tagStyles = {
  Bestseller: "bg-yellow-100 text-yellow-800",
  New: "bg-green-100 text-green-800",
  Popular: "bg-purple-100 text-purple-800",
  Limited: "bg-red-100 text-red-800",
};

export const ProductCard = ({ product, index }) => {
  const router = useRouter();
  const { addToCart, toggleWishlist, wishlist } = useStore();
  const isWishlisted = wishlist.some((item) => item.id === product.id);

  return (
    <motion.div
      className="bg-white p-4 rounded-3xl group relative"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ y: -4 }}
    >
      <motion.button
        onClick={(e) => {
          e.stopPropagation();
          toggleWishlist(product);
        }}
        className={`absolute top-6 right-6 z-10 p-2 rounded-full transition-colors
          ${
            isWishlisted
              ? "bg-red-500 text-white"
              : "bg-white text-zinc-600 hover:bg-zinc-100"
          }`}
        whileTap={{ scale: 0.9 }}
      >
        <Heart
          size={20}
          className={`transition-colors ${isWishlisted ? "fill-current" : ""}`}
        />
      </motion.button>

      <motion.button
        onClick={(e) => {
          e.stopPropagation();
          addToCart(product, 1);
        }}
        className="absolute bottom-6 right-6 z-10 p-2 bg-zinc-900 hover:bg-zinc-800 text-white rounded-full 
          opacity-0 group-hover:opacity-100 transition-all duration-200"
        whileTap={{ scale: 0.9 }}
      >
        <ShoppingBag size={20} />
      </motion.button>

      <div
        onClick={() => router.push(`/products/${product.id}`)}
        className="cursor-pointer"
      >
        <div className="relative aspect-square mb-4 rounded-2xl overflow-hidden">
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
          {product.tag && (
            <span
              className={`absolute top-2 left-2 px-3 py-1 rounded-full text-xs font-medium
              ${
                tagStyles[product.tag]
              } transition-transform duration-200 hover:scale-105`}
            >
              {product.tag}
            </span>
          )}
        </div>

        <h4 className="font-medium mb-2 group-hover:text-zinc-700 transition-colors">
          {product.name}
        </h4>
        <div className="flex justify-between items-center">
          <span className="font-bold">${product.price.toFixed(2)}</span>
          <div className="flex items-center gap-1">
            <Star size={14} className="fill-yellow-400 text-yellow-400" />
            <span className="text-sm text-zinc-500">{product.rating}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
