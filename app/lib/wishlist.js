// lib/wishlist.js
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useWishlistStore = create(
  persist(
    (set) => ({
      items: [],
      isLoading: false,
      error: null,

      setItems: (items) => set({ items }),

      addItem: async (product) => {
        try {
          set({ isLoading: true, error: null });
          const response = await fetch('/api/wishlist', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(product),
          });

          if (!response.ok) throw new Error('Failed to add item');
          const items = await response.json();
          set({ items, isLoading: false });
        } catch (error) {
          set({ error: error.message, isLoading: false });
        }
      },

      removeItem: async (productId) => {
        try {
          set({ isLoading: true, error: null });
          const response = await fetch(`/api/wishlist/${productId}`, {
            method: 'DELETE',
          });

          if (!response.ok) throw new Error('Failed to remove item');
          const items = await response.json();
          set({ items, isLoading: false });
        } catch (error) {
          set({ error: error.message, isLoading: false });
        }
      },

      sync: async () => {
        try {
          set({ isLoading: true, error: null });
          const response = await fetch('/api/wishlist');
          if (!response.ok) throw new Error('Failed to sync wishlist');
          const items = await response.json();
          set({ items, isLoading: false });
        } catch (error) {
          set({ error: error.message, isLoading: false });
        }
      },

      clear: () => set({ items: [], error: null }),
    }),
    {
      name: 'wishlist-storage',
    }
  )
);
