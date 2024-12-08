// contexts/ModalContext.jsx
"use client";
import { createContext, useContext, useState } from "react";

const ModalContext = createContext({
  openSearch: () => {},
  openCart: () => {},
  openAuth: () => {},
  openWishlist: () => {},
  closeSearch: () => {},
  closeCart: () => {},
  closeAuth: () => {},
  closeWishlist: () => {},
  isSearchOpen: false,
  isCartOpen: false,
  isAuthOpen: false,
  isWishlistOpen: false,
});

export const ModalProvider = ({ children }) => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);

  const openSearch = () => setIsSearchOpen(true);
  const closeSearch = () => setIsSearchOpen(false);
  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);
  const openAuth = () => setIsAuthOpen(true);
  const closeAuth = () => setIsAuthOpen(false);
  const openWishlist = () => setIsWishlistOpen(true);
  const closeWishlist = () => setIsWishlistOpen(false);

  return (
    <ModalContext.Provider
      value={{
        openSearch,
        openCart,
        openAuth,
        openWishlist,
        closeSearch,
        closeCart,
        closeAuth,
        closeWishlist,
        isSearchOpen,
        isCartOpen,
        isAuthOpen,
        isWishlistOpen,
      }}
    >
      {children}
    </ModalContext.Provider>
  );
};

export const useModals = () => {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error("useModals must be used within a ModalProvider");
  }
  return context;
};
