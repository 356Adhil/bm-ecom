'use client';
import localFont from 'next/font/local';
import { CartDrawer } from './components/cart/CartDrawer';
import { AuthModal } from './components/layout/AuthModal';
import { SearchOverlay } from './components/search/SearchOverlay';
import { Navigation } from './components/layout/Navigation';
import './globals.css';
import { ModalProvider, useModals } from './contexts/ModalContext';
import { SearchProvider } from './contexts/SearchContext';
import { WishlistDrawer } from './components/wishlist/WishlistDrawer';
import { register } from './serviceWorker';
import { useEffect } from 'react';

const geistSans = localFont({
  src: './fonts/GeistVF.woff',
  variable: '--font-geist-sans',
  weight: '100 900',
});

const geistMono = localFont({
  src: './fonts/GeistMonoVF.woff',
  variable: '--font-geist-mono',
  weight: '100 900',
});

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"
        />
        <meta name="theme-color" content="#ffffff" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" href="/icons/icon.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Boba Metals" />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <ModalProvider>
          <SearchProvider>
            <RootLayoutContent>{children}</RootLayoutContent>
          </SearchProvider>
        </ModalProvider>
      </body>
    </html>
  );
}

function RootLayoutContent({ children }) {
  const {
    isCartOpen,
    closeCart,
    isAuthOpen,
    closeAuth,
    isSearchOpen,
    closeSearch,
    isWishlistOpen,
    closeWishlist,
  } = useModals();

  useEffect(() => {
    register();
  }, []);

  return (
    <>
      {children}

      <Navigation />

      <AuthModal isOpen={isAuthOpen} onClose={closeAuth} />

      <SearchOverlay isOpen={isSearchOpen} onClose={closeSearch} />

      <CartDrawer isOpen={isCartOpen} onClose={closeCart} />

      <WishlistDrawer isOpen={isWishlistOpen} onClose={closeWishlist} />
    </>
  );
}
