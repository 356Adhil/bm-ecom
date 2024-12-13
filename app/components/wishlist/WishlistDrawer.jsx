// components/wishlist/WishlistDrawer.jsx
import { motion, AnimatePresence } from 'framer-motion';
import { X, Heart, ShoppingBag, Trash2, ArrowRight } from 'lucide-react';
import Image from 'next/image';
import { useWishlistStore } from '@/app/lib/wishlist';
import { useStore } from '@/app/lib/store';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export const WishlistDrawer = ({ isOpen, onClose }) => {
  const { items, removeItem, isLoading, sync } = useWishlistStore();
  const { addToCart } = useStore();
  const router = useRouter();

  // Sync wishlist when drawer opens
  useEffect(() => {
    if (isOpen) {
      sync();
    }
  }, [isOpen, sync]);

  const handleAddToCart = async (product) => {
    addToCart(product, 1);
    await removeItem(product.id);
    // Optionally show a success message
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/25 z-40"
            onClick={onClose}
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-white z-50 flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b">
              <div className="flex items-center gap-2">
                <Heart size={20} className="text-red-500" />
                <h2 className="text-lg font-semibold">My Wishlist</h2>
                <span className="bg-zinc-100 px-2 py-1 rounded-full text-sm">{items.length}</span>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-zinc-100 rounded-full transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto">
              {isLoading ? (
                <div className="flex items-center justify-center h-full">
                  <div className="animate-spin rounded-full h-8 w-8 border-2 border-zinc-900 border-t-transparent" />
                </div>
              ) : items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full p-4 text-center">
                  <Heart size={48} className="text-zinc-300 mb-2" />
                  <p className="text-zinc-600 mb-2">Your wishlist is empty</p>
                  <button
                    onClick={() => {
                      onClose();
                      router.push('/products');
                    }}
                    className="flex items-center gap-2 px-6 py-3 bg-zinc-900 text-white rounded-xl font-medium"
                  >
                    Start Shopping
                    <ArrowRight size={20} />
                  </button>
                </div>
              ) : (
                <div className="p-4 space-y-4">
                  {items.map((item) => (
                    <motion.div
                      key={item.productId}
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className="flex gap-4 bg-white p-4 rounded-xl border"
                    >
                      {/* Product Image */}
                      <div className="relative w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          className="object-cover"
                          sizes="(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 20vw"
                        />
                      </div>

                      {/* Product Info */}
                      <div className="flex-1">
                        <h3 className="font-medium mb-1">{item.name}</h3>
                        <p className="text-zinc-600 font-medium">${item.price.toFixed(2)}</p>
                      </div>

                      {/* Actions */}
                      <div className="flex flex-col gap-2">
                        <motion.button
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleAddToCart(item)}
                          className="p-2 bg-zinc-900 text-white rounded-full hover:bg-zinc-800 transition-colors"
                        >
                          <ShoppingBag size={16} />
                        </motion.button>
                        <motion.button
                          whileTap={{ scale: 0.95 }}
                          onClick={() => removeItem(item.productId)}
                          className="p-2 bg-zinc-100 rounded-full hover:bg-zinc-200 transition-colors text-red-500"
                        >
                          <Trash2 size={16} />
                        </motion.button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
