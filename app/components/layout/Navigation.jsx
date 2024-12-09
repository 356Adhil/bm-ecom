// components/layout/Navigation.jsx
import { motion } from 'framer-motion';
import { Home, Search, ShoppingBag, Heart, User } from 'lucide-react';
import { useModals } from '@/app/contexts/ModalContext';
import { usePathname, useRouter } from 'next/navigation';
import { useStore } from '@/app/lib/store';

export const Navigation = () => {
  const { openSearch, openCart, openAuth, openWishlist, isSearchOpen, isCartOpen } = useModals();
  const router = useRouter();
  const pathname = usePathname();
  const { wishlist, cart } = useStore();
  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const items = [
    {
      label: 'Home',
      icon: Home,
      onClick: () => router.push('/'),
      isActive: pathname === '/',
    },
    {
      label: 'Search',
      icon: Search,
      onClick: openSearch,
      isActive: isSearchOpen, // Update this line to use isSearchOpen
    },
    {
      label: 'Wishlist',
      icon: Heart,
      onClick: openWishlist,
      isActive: false,
      badge: wishlist.length,
    },
    {
      label: 'Cart',
      icon: ShoppingBag,
      onClick: openCart,
      isActive: isCartOpen, // Changed from pathname === '/cart' to isCartOpen
      badge: cartItemCount,
    },
    {
      label: 'Account',
      icon: User,
      onClick: openAuth,
      isActive: false,
    },
  ];

  return (
    <nav className="fixed bottom-0 inset-x-0 bg-white border-t py-4 px-6 grid grid-cols-5 gap-4 z-40">
      {items.map((item) => {
        const Icon = item.icon;
        return (
          <motion.button
            key={item.label}
            className="flex flex-col items-center gap-1 relative"
            whileTap={{ scale: 0.9 }}
            onClick={item.onClick}
          >
            <div className="relative">
              <Icon
                size={24}
                className={`${
                  item.isActive
                    ? 'text-zinc-900'
                    : item.label === 'Wishlist' && wishlist.length > 0
                      ? 'text-red-500'
                      : 'text-zinc-700'
                }`}
              />
              {item.badge > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-4 h-4 rounded-full flex items-center justify-center">
                  {item.badge}
                </span>
              )}
            </div>
            <span
              className={`text-xs ${item.isActive ? 'text-zinc-900 font-medium' : 'text-zinc-500'}`}
            >
              {item.label}
            </span>
            {item.isActive && (
              <motion.div
                layoutId="activeTab"
                className="absolute -top-4 w-12 h-1 bg-zinc-900 rounded-full"
                transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
              />
            )}
          </motion.button>
        );
      })}
    </nav>
  );
};
