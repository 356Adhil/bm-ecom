// components/search/SearchOverlay.jsx
import { motion, AnimatePresence } from 'framer-motion';
import { X, Search as SearchIcon } from 'lucide-react';
import { ProductCard } from '../ui/ProductCard';
import { useSearchContext } from '@/app/contexts/SearchContext';

export const SearchOverlay = ({ isOpen, onClose }) => {
  const { searchQuery, setSearchQuery, selectedCategory, setSelectedCategory, filteredProducts } =
    useSearchContext();

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-white z-30" // Reduced z-index to be below Navigation
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
      >
        <div className="flex flex-col h-[calc(100%-64px)]">
          {' '}
          {/* Adjusted height to account for Navigation */}
          {/* Search Header */}
          <div className="sticky top-0 bg-white z-10 p-4">
            <div className="flex items-center gap-3 mb-4">
              <button onClick={onClose} className="p-2 hover:bg-zinc-100 rounded-full">
                <X size={24} />
              </button>
              <div className="flex-1 flex items-center bg-zinc-100 rounded-full px-4 py-2">
                <SearchIcon size={20} className="text-zinc-500" />
                <input
                  autoFocus
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="ml-2 bg-transparent focus:outline-none w-full"
                />
              </div>
            </div>

            {/* Category Pills */}
            <div className="flex gap-2 overflow-x-auto py-2 no-scrollbar">
              {['All', 'Dinnerware', 'Drinkware', 'Serveware', 'Kitchenware'].map((category) => (
                <motion.button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-full text-sm whitespace-nowrap ${
                    selectedCategory === category
                      ? 'bg-zinc-900 text-white'
                      : 'bg-zinc-100 text-zinc-600'
                  }`}
                  whileTap={{ scale: 0.95 }}
                >
                  {category}
                </motion.button>
              ))}
            </div>
          </div>
          {/* Search Results */}
          <div className="flex-1 overflow-y-auto p-4">
            {searchQuery && (
              <p className="text-sm text-zinc-500 mb-4">{filteredProducts.length} results found</p>
            )}

            {searchQuery === '' && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-4">Popular Searches</h3>
                <div className="flex flex-wrap gap-2">
                  {['Dinner Sets', 'Coffee Mugs', 'Serving Bowls', 'Cutlery'].map((term) => (
                    <button
                      key={term}
                      onClick={() => setSearchQuery(term)}
                      className="px-4 py-2 bg-zinc-100 rounded-full text-sm"
                    >
                      {term}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {filteredProducts.map((product, index) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  index={index}
                  showQuickAdd
                  onClose={onClose} // Add this line
                />
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
