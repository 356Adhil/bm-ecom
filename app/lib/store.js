import { create } from "zustand";

export const useStore = create((set) => ({
  cart: [],
  wishlist: [],
  searchHistory: [],

  addToCart: (product, quantity = 1) =>
    set((state) => {
      const existing = state.cart.find((item) => item.id === product.id);
      if (existing) {
        return {
          cart: state.cart.map((item) =>
            item.id === product.id
              ? { ...item, quantity: item.quantity + quantity }
              : item
          ),
        };
      }
      return { cart: [...state.cart, { ...product, quantity }] };
    }),

  removeFromCart: (productId) =>
    set((state) => ({
      cart: state.cart.filter((item) => item.id !== productId),
    })),

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
      searchHistory: [
        term,
        ...state.searchHistory.filter((t) => t !== term),
      ].slice(0, 5),
    })),
}));
