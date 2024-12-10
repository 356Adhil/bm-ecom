import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useStore = create(
  persist(
    (set, get) => ({
      cart: [],
      wishlist: [],
      searchHistory: [],
      currentUser: null, // Add this to track user state

      syncWithDatabase: async () => {
        const state = get();
        if (!state.currentUser) return;

        try {
          const response = await fetch('/api/user/sync', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              cart: state.cart,
              wishlist: state.wishlist,
            }),
          });

          if (!response.ok) {
            const data = await response.json();
            console.error('Sync failed:', data);
            throw new Error(data.message);
          }
        } catch (error) {
          console.error('Failed to sync with database:', error);
        }
      },

      setCurrentUser: (userId) => {
        set({ currentUser: userId });
      },

      addToCart: (product, quantity = 1) =>
        set((state) => {
          const existing = state.cart.find((item) => item.id === product.id);
          if (existing) {
            return {
              cart: state.cart.map((item) =>
                item.id === product.id ? { ...item, quantity: item.quantity + quantity } : item
              ),
            };
          }
          return { cart: [...state.cart, { ...product, quantity }] };
        }),

      removeFromCart: (productId) =>
        set((state) => ({
          cart: state.cart.filter((item) => item.id !== productId),
        })),

      clearCart: () => set({ cart: [] }),

      toggleWishlist: (product) =>
        set((state) => {
          const exists = state.wishlist.some((item) => item.id === product.id);
          return {
            wishlist: exists
              ? state.wishlist.filter((item) => item.id !== product.id)
              : [...state.wishlist, product],
          };
        }),

      addSearchHistory: (term) =>
        set((state) => ({
          searchHistory: [term, ...state.searchHistory.filter((t) => t !== term)].slice(0, 5),
        })),
    }),
    {
      name: 'store-storage',
    }
  )
);
