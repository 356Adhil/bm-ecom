'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Check, ShoppingBag, Truck } from 'lucide-react';
import { useStore } from '../lib/store';

export default function OrderSuccessPage() {
  const router = useRouter();
  const { clearCart } = useStore();

  useEffect(() => {
    clearCart();
  }, [clearCart]);

  return (
    <div className="min-h-screen bg-zinc-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl p-6 max-w-lg w-full text-center">
        <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
          <Check className="w-8 h-8 text-green-500" />
        </div>

        <h1 className="text-2xl font-bold mb-4">Order Confirmed!</h1>
        <p className="text-zinc-500 mb-8">
          Thank you for your purchase. We&apos;ll send you a confirmation email with your order
          details.
        </p>

        <div className="space-y-4 mb-8">
          <div className="flex items-center gap-4 p-4 bg-zinc-50 rounded-xl">
            <div className="w-10 h-10 bg-zinc-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <Truck className="w-5 h-5" />
            </div>
            <div className="text-left">
              <p className="font-medium">Shipping Updates</p>
              <p className="text-sm text-zinc-500">
                You&apos;ll receive shipping updates via email
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 p-4 bg-zinc-50 rounded-xl">
            <div className="w-10 h-10 bg-zinc-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div className="text-left">
              <p className="font-medium">Track Your Order</p>
              <p className="text-sm text-zinc-500">Check your email for tracking information</p>
            </div>
          </div>
        </div>

        <div className="space-x-4">
          <button
            onClick={() => router.push('/')}
            className="px-8 py-4 bg-zinc-900 text-white rounded-xl font-medium"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    </div>
  );
}
