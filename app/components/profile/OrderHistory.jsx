// app/components/profile/OrderHistory.jsx
'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export function OrderHistory() {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch('/api/orders');
        if (response.ok) {
          const data = await response.json();
          setOrders(data);
        }
      } catch (error) {
        console.error('Failed to fetch orders:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (isLoading) {
    return (
      <div className="bg-white rounded-2xl p-6 shadow-sm animate-pulse">
        <div className="h-6 bg-zinc-200 rounded w-1/4 mb-6"></div>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="border border-zinc-200 rounded-lg p-4">
              <div className="flex justify-between items-start mb-2">
                <div className="space-y-2">
                  <div className="h-4 bg-zinc-200 rounded w-24"></div>
                  <div className="h-3 bg-zinc-200 rounded w-32"></div>
                </div>
                <div className="h-6 bg-zinc-200 rounded w-20"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm">
      <h2 className="text-xl font-semibold mb-6">Order History</h2>
      {orders.length === 0 ? (
        <p className="text-zinc-500 text-center py-8">No orders found</p>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <motion.div
              key={order.id}
              className="border border-zinc-200 rounded-lg p-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="flex justify-between items-start mb-2">
                <div>
                  <p className="font-medium">Order #{order.id}</p>
                  <p className="text-sm text-zinc-500">
                    {new Date(order.date).toLocaleDateString()}
                  </p>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-sm ${
                    order.status === 'delivered'
                      ? 'bg-green-100 text-green-800'
                      : order.status === 'processing'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-zinc-100 text-zinc-800'
                  }`}
                >
                  {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                </span>
              </div>
              <div className="text-sm text-zinc-600">Total: ${order.total.toFixed(2)}</div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
