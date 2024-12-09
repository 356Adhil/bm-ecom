// app/cart/page.js
'use client';
import { useStore } from '../lib/store';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { Minus, Plus, X, ShoppingBag } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function CartPage() {
  const { cart, addToCart, removeFromCart } = useStore();
  const router = useRouter();

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div className="min-h-screen bg-zinc-50">
      <main className="p-4 max-w-4xl mx-auto pb-24">
        {cart.length === 0 ? (
          <div className="text-center py-12">
            <ShoppingBag size={48} className="mx-auto text-zinc-300 mb-4" />
            <p className="text-zinc-500">Your cart is empty</p>
          </div>
        ) : (
          <div className="space-y-4">
            {cart.map((item) => (
              <motion.div key={item.id} layout className="flex gap-4 bg-white p-4 rounded-xl">
                <div className="relative w-24 h-24 flex-shrink-0">
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    className="object-cover rounded-lg"
                  />
                </div>
                <div className="flex-1">
                  <h4 className="font-medium">{item.name}</h4>
                  <p className="text-zinc-500 text-sm mb-2">${item.price}</p>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => addToCart(item, -1)}
                      className="p-1 hover:bg-zinc-100 rounded"
                    >
                      <Minus size={16} />
                    </button>
                    <span>{item.quantity}</span>
                    <button
                      onClick={() => addToCart(item, 1)}
                      className="p-1 hover:bg-zinc-100 rounded"
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                </div>
                <button
                  onClick={() => removeFromCart(item.id)}
                  className="p-2 hover:bg-zinc-100 rounded-lg"
                >
                  <X size={20} />
                </button>
              </motion.div>
            ))}

            <div className="bg-white p-4 rounded-xl">
              <div className="flex justify-between items-center mb-4">
                <span className="font-medium">Total</span>
                <span className="text-xl font-bold">${total.toFixed(2)}</span>
              </div>
              <button
                className="w-full bg-zinc-900 text-white py-4 rounded-xl font-medium"
                onClick={() => {
                  router.push('/checkout');
                }}
              >
                Proceed to Checkout
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
