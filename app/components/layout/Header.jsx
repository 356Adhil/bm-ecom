// components/layout/Header.jsx
import { Menu, LogIn, Search, ShoppingBag } from "lucide-react";
import { useStore } from "@/app/lib/store";

export const Header = ({ onLoginClick, onSearchClick, onCartClick }) => {
  const { cart } = useStore();
  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <header className="bg-white sticky top-0 z-40 px-4 py-3">
      <div className="flex items-center justify-between max-w-6xl mx-auto">
        <button className="p-2 hover:bg-zinc-100 rounded-full">
          <Menu size={24} />
        </button>
        <h1 className="text-xl font-bold">Boba Metals</h1>
        <div className="flex items-center gap-2">
          <button
            onClick={onSearchClick}
            className="p-2 hover:bg-zinc-100 rounded-full transition-colors"
          >
            <Search size={24} />
          </button>
          <button
            onClick={onCartClick}
            className="p-2 hover:bg-zinc-100 rounded-full transition-colors relative"
          >
            <ShoppingBag size={24} />
            {cartItemCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-zinc-900 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                {cartItemCount}
              </span>
            )}
          </button>
          <button
            onClick={onLoginClick}
            className="p-2 hover:bg-zinc-100 rounded-full transition-colors"
          >
            <LogIn size={24} />
          </button>
        </div>
      </div>
    </header>
  );
};