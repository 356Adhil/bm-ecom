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
import { useEffect, useState } from 'react';
import { SessionProvider, useSession } from 'next-auth/react';
import { useStore } from './lib/store';
import { WelcomeToast } from './components/ui/WelcomeToast';
import { useSessionExpiration } from './hooks/useSessionExpiration';

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
        <SessionProvider>
          <ModalProvider>
            <SearchProvider>
              <RootLayoutContent>{children}</RootLayoutContent>
            </SearchProvider>
          </ModalProvider>
        </SessionProvider>
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
  useSessionExpiration(); // Add this line
  const { data: session, status } = useSession(); // Use status as well
  // const setCurrentUser = useStore((state) => state.setCurrentUser);
  const { setCurrentUser, syncWithDatabase } = useStore();
  const [showWelcome, setShowWelcome] = useState(false);

  useEffect(() => {
    register();
  }, []);

  // Handle user session
  useEffect(() => {
    if (status === 'authenticated' && session?.user?.id) {
      setCurrentUser(session.user.id);
      syncWithDatabase();
      setShowWelcome(true);
      setTimeout(() => setShowWelcome(false), 3000);
    }
  }, [status, session, setCurrentUser, syncWithDatabase]);

  return (
    <>
      {children}
      <Navigation />
      <AuthModal isOpen={isAuthOpen} onClose={closeAuth} />
      <SearchOverlay isOpen={isSearchOpen} onClose={closeSearch} />
      <CartDrawer isOpen={isCartOpen} onClose={closeCart} />
      <WishlistDrawer isOpen={isWishlistOpen} onClose={closeWishlist} />
      {showWelcome && session?.user && (
        <WelcomeToast user={session.user} onClose={() => setShowWelcome(false)} />
      )}
    </>
  );
}
