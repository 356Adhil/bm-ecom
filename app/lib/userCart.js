// lib/userCart.js
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useUserCart = create(
  persist(
    (set, get) => ({
      userCarts: {}, // Stores carts for different users

      initializeUserCart: (userId, guestCart = [], guestWishlist = []) => {
        const state = get();
        if (!state.userCarts[userId]) {
          // If this is a new user, initialize with guest data
          set((state) => ({
            userCarts: {
              ...state.userCarts,
              [userId]: {
                cart: guestCart,
                wishlist: guestWishlist,
              },
            },
          }));
        } else {
          // If returning user, merge guest data with existing user data
          const existingUserData = state.userCarts[userId] || { cart: [], wishlist: [] };
          // Ensure we have arrays to spread
          const existingCart = Array.isArray(existingUserData.cart) ? existingUserData.cart : [];
          const existingWishlist = Array.isArray(existingUserData.wishlist)
            ? existingUserData.wishlist
            : [];

          const mergedCart = [...existingCart];
          const mergedWishlist = [...existingWishlist];

          // Merge cart items
          guestCart.forEach((guestItem) => {
            const existingItem = mergedCart.find((item) => item.id === guestItem.id);
            if (existingItem) {
              existingItem.quantity += guestItem.quantity;
            } else {
              mergedCart.push({ ...guestItem });
            }
          });

          // Merge wishlist items (avoiding duplicates)
          guestWishlist.forEach((guestItem) => {
            if (!mergedWishlist.some((item) => item.id === guestItem.id)) {
              mergedWishlist.push(guestItem);
            }
          });

          set((state) => ({
            userCarts: {
              ...state.userCarts,
              [userId]: {
                cart: mergedCart,
                wishlist: mergedWishlist,
              },
            },
          }));
        }
      },

      getUserData: (userId) => {
        const state = get();
        return state.userCarts[userId] || { cart: [], wishlist: [] };
      },

      updateUserCart: (userId, cart) => {
        const state = get();
        const userData = state.userCarts[userId] || { cart: [], wishlist: [] };
        set((state) => ({
          userCarts: {
            ...state.userCarts,
            [userId]: {
              ...userData,
              cart,
            },
          },
        }));
      },

      updateUserWishlist: (userId, wishlist) => {
        const state = get();
        const userData = state.userCarts[userId] || { cart: [], wishlist: [] };
        set((state) => ({
          userCarts: {
            ...state.userCarts,
            [userId]: {
              ...userData,
              wishlist,
            },
          },
        }));
      },
    }),
    {
      name: 'user-cart-storage',
    }
  )
);
