// components/cart/CartDrawer.jsx
import { useStore } from '@/app/lib/store';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Minus, ShoppingBag, ArrowRight } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

export const CartDrawer = ({ isOpen, onClose }) => {
  const { cart, addToCart, removeFromCart } = useStore();
  const router = useRouter();

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50"
          onClick={onClose}
        >
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25 }}
            className="absolute right-0 top-0 bottom-0 w-full max-w-md bg-white"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="text-xl font-bold">Shopping Cart ({cart.length})</h2>
              <button
                onClick={onClose}
                className="p-2 hover:bg-zinc-100 rounded-full transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            {/* Cart Items */}
            {cart.length === 0 ? (
              <div className="h-[calc(100vh-200px)] flex flex-col items-center justify-center p-4">
                <ShoppingBag size={48} className="text-zinc-300 mb-4" />
                <p className="text-zinc-500 mb-8">Your cart is empty</p>
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
              <>
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {cart.map((item) => (
                    <motion.div
                      layout
                      key={item.id}
                      className="flex gap-4 bg-zinc-50 p-4 rounded-xl"
                    >
                      {/* Product Image */}
                      <div className="relative w-20 h-20 flex-shrink-0">
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          className="object-cover rounded-lg"
                          sizes="(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 20vw"
                        />
                      </div>

                      {/* Product Details */}
                      <div className="flex-1">
                        <div className="flex justify-between">
                          <h4 className="font-medium">{item.name}</h4>
                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="p-1 hover:bg-zinc-200 rounded-lg transition-colors"
                          >
                            <X size={18} />
                          </button>
                        </div>
                        <p className="text-zinc-500 text-sm mb-2">${item.price}</p>

                        {/* Quantity Controls */}
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => addToCart(item, -1)}
                            className="p-1 hover:bg-zinc-200 rounded-full transition-colors"
                            disabled={item.quantity <= 1}
                          >
                            <Minus size={16} />
                          </button>
                          <span className="font-medium w-8 text-center">{item.quantity}</span>
                          <button
                            onClick={() => addToCart(item, 1)}
                            className="p-1 hover:bg-zinc-200 rounded-full transition-colors"
                          >
                            <Plus size={16} />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Cart Summary */}
                <div className="border-t p-4 space-y-4 bg-white">
                  {/* Subtotal */}
                  <div className="flex justify-between items-center">
                    <span className="text-zinc-500">Subtotal</span>
                    <span className="font-medium">${total.toFixed(2)}</span>
                  </div>

                  {/* Shipping */}
                  <div className="flex justify-between items-center">
                    <span className="text-zinc-500">Shipping</span>
                    <span className="font-medium text-green-600">Free</span>
                  </div>

                  {/* Total */}
                  <div className="flex justify-between items-center pt-2 border-t">
                    <span className="font-medium">Total</span>
                    <span className="text-xl font-bold">${total.toFixed(2)}</span>
                  </div>

                  {/* Actions */}
                  <div className="space-y-3">
                    <button
                      onClick={() => {
                        onClose();
                        router.push('/cart');
                      }}
                      className="w-full py-3 bg-zinc-100 rounded-xl font-medium transition-colors hover:bg-zinc-200"
                    >
                      View Cart
                    </button>
                    <button
                      className="w-full py-3 bg-zinc-900 text-white rounded-xl font-medium transition-colors hover:bg-zinc-800"
                      onClick={() => {
                        onClose();
                        router.push('/checkout');
                      }}
                    >
                      Checkout
                    </button>
                  </div>

                  {/* Continue Shopping */}
                  <button
                    onClick={() => {
                      onClose();
                      router.push('/products');
                    }}
                    className="w-full flex items-center justify-center gap-2 text-zinc-500 hover:text-zinc-800 transition-colors"
                  >
                    <ArrowRight size={20} />
                    Continue Shopping
                  </button>
                </div>
              </>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
