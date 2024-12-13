// lib/store.js
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useStore = create(
  persist(
    (set, get) => ({
      cart: [],
      searchHistory: [],
      currentUser: null,

      syncWithDatabase: async () => {
        const state = get();
        if (!state.currentUser) return;

        try {
          const response = await fetch('/api/user/sync', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              cart: state.cart,
            }),
          });

          if (!response.ok) {
            const data = await response.json();
            throw new Error(data.message || 'Failed to sync with database');
          }

          const data = await response.json();
          return data;
        } catch (error) {
          console.error('Failed to sync with database:', error.message);
        }
      },

      setCurrentUser: (userId) => {
        set({ currentUser: userId });
        // Optionally trigger a sync when user is set
        if (userId) {
          get().syncWithDatabase();
        }
      },

      addToCart: (product, quantity = 1) =>
        set((state) => {
          const existing = state.cart.find((item) => item.id === product.id);
          const newCart = existing
            ? state.cart.map((item) =>
                item.id === product.id ? { ...item, quantity: item.quantity + quantity } : item
              )
            : [...state.cart, { ...product, quantity }];

          return { cart: newCart };
        }, true), // true here will trigger the storage middleware

      removeFromCart: (productId) =>
        set(
          (state) => ({
            cart: state.cart.filter((item) => item.id !== productId),
          }),
          true
        ),

      clearCart: () => set({ cart: [] }, true),

      addSearchHistory: (term) =>
        set(
          (state) => ({
            searchHistory: [term, ...state.searchHistory.filter((t) => t !== term)].slice(0, 5),
          }),
          true
        ),
    }),
    {
      name: 'store-storage',
      onRehydrateStorage: () => (state) => {
        // Optionally sync with database when store is rehydrated
        if (state && state.currentUser) {
          state.syncWithDatabase();
        }
      },
    }
  )
);
