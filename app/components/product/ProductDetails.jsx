import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Star, Minus, Plus, ShoppingBag, Heart, Check, Share2 } from 'lucide-react';
import { ProductGallery } from './ProductGallery';
import { useStore } from '@/app/lib/store';

export const ProductDetails = ({ product, onClose, requiresAuth, inPage = false }) => {
  const [quantity, setQuantity] = useState(1);
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);
  const [selectedSize, setSelectedSize] = useState('Medium');
  const { addToCart, toggleWishlist, wishlist } = useStore();
  const isWishlisted = wishlist.some((item) => item.id === product.id);

  const images = [
    product.image,
    '/api/placeholder/400/400',
    '/api/placeholder/400/400',
    '/api/placeholder/400/400',
  ];

  const sizes = ['Small', 'Medium', 'Large', 'XLarge'];

  const handleShare = async () => {
    try {
      await navigator.share({
        title: product.name,
        text: product.description,
        url: window.location.href,
      });
    } catch (err) {
      console.log('Error sharing:', err);
    }
  };

  const handleAddToCart = () => {
    if (requiresAuth) {
      onClose();
      return;
    }
    addToCart({ ...product, selectedSize }, quantity);
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  const Container = inPage ? motion.div : motion.div;
  const containerProps = inPage
    ? {
        className: 'max-w-6xl mx-auto py-8 px-4',
      }
    : {
        className: 'fixed inset-0 bg-white z-50 overflow-y-auto',
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        exit: { opacity: 0 },
      };

  return (
    <Container {...containerProps}>
      {!inPage && (
        <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-md">
          <div className="flex justify-between items-center p-4">
            <button
              onClick={onClose}
              className="p-2 hover:bg-zinc-100 rounded-full transition-colors"
            >
              <X size={24} />
            </button>
          </div>
        </div>
      )}

      <div className={`${inPage ? 'md:grid md:grid-cols-2 md:gap-8' : ''}`}>
        {/* Product Gallery */}
        <div className="md:sticky md:top-0 z-10">
          <ProductGallery images={images} />
        </div>

        {/* Product Info */}
        <div className="relative px-4 pb-24 md:p-4 md:pb-24">
          {/* Title and Actions */}
          <div className="flex justify-between items-start gap-4 -mt-4 md:mt-0 mb-4 backdrop-blur-md pt-4 sticky top-0 z-20">
            <div>
              <h2 className="text-xl md:text-2xl font-bold mb-1">{product.name}</h2>
              <div className="flex items-center gap-2">
                <div className="flex items-center">
                  <Star size={16} className="text-yellow-400 fill-yellow-400" />
                  <span className="ml-1 font-medium">{product.rating}</span>
                </div>
                <span className="text-zinc-300">•</span>
                <span className="text-sm text-zinc-500">{product.reviews || '150'} reviews</span>
              </div>
            </div>
            <div className="flex gap-2">
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={handleShare}
                className="p-2 md:p-3 bg-zinc-100 rounded-full hover:bg-zinc-200 transition-colors"
              >
                <Share2 size={18} className="text-zinc-600" />
              </motion.button>
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => toggleWishlist(product)}
                className="p-2 md:p-3 bg-zinc-100 rounded-full hover:bg-zinc-200 transition-colors"
              >
                <Heart
                  size={18}
                  className={`${isWishlisted ? 'fill-red-500 text-red-500' : 'text-zinc-600'}`}
                />
              </motion.button>
            </div>
          </div>

          {/* Price */}
          <div className="mb-4">
            <span className="text-2xl md:text-3xl font-bold">${product.price}</span>
          </div>

          {/* Size Selector */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-zinc-600 mb-2">Size</label>
            <div className="flex flex-wrap gap-2">
              {sizes.map((size) => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex-1 md:flex-none
                        ${
                          selectedSize === size
                            ? 'bg-zinc-900 text-white'
                            : 'bg-zinc-100 text-zinc-900 hover:bg-zinc-200'
                        }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* Quantity Selector and Add to Cart - Fixed at Bottom for Mobile */}
          <div className="fixed bottom-[72px] left-0 right-0 p-4 bg-white border-t md:relative md:bottom-auto md:p-0 md:bg-transparent md:border-0 z-40">
            <div className="flex items-center justify-between gap-4 max-w-6xl mx-auto">
              <div className="flex items-center gap-2 bg-zinc-100 rounded-full p-1">
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-2 hover:bg-zinc-200 rounded-full transition-colors"
                >
                  <Minus size={16} />
                </motion.button>
                <span className="w-8 text-center font-medium">{quantity}</span>
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setQuantity(quantity + 1)}
                  className="p-2 hover:bg-zinc-200 rounded-full transition-colors"
                >
                  <Plus size={16} />
                </motion.button>
              </div>

              <motion.button
                onClick={handleAddToCart}
                className="flex-1 bg-zinc-900 text-white py-3 px-4 rounded-full font-medium 
                      hover:bg-zinc-800 transition-colors"
                whileTap={{ scale: 0.98 }}
              >
                <AnimatePresence mode="wait">
                  {addedToCart ? (
                    <motion.div
                      key="added"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex items-center justify-center gap-2"
                    >
                      <Check size={18} />
                      Added
                    </motion.div>
                  ) : (
                    <motion.div
                      key="add"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex items-center justify-center gap-2"
                    >
                      <ShoppingBag size={18} />
                      {requiresAuth ? 'Sign in' : 'Add to Cart'}
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.button>
            </div>
          </div>

          {/* Product Details */}
          <div className="space-y-6 mt-6">
            {/* Description */}
            <div>
              <h3 className="text-lg font-semibold mb-2">Description</h3>
              <p className={`text-sm text-zinc-600 ${!showFullDescription && 'line-clamp-3'}`}>
                {product.description}
              </p>
              <button
                onClick={() => setShowFullDescription(!showFullDescription)}
                className="text-zinc-900 font-medium text-sm mt-2 hover:text-zinc-600 transition-colors"
              >
                {showFullDescription ? 'Show less' : 'Read more'}
              </button>
            </div>

            {/* Specifications */}
            <div>
              <h3 className="text-lg font-semibold mb-3">Specifications</h3>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: 'Material', value: 'Premium Ceramic' },
                  { label: 'Weight', value: '1.5 kg' },
                  { label: 'Size', value: `${selectedSize} (Standard)` },
                  { label: 'Care', value: 'Dishwasher Safe' },
                ].map((spec) => (
                  <div key={spec.label} className="bg-zinc-50 p-3 rounded-xl">
                    <span className="text-xs text-zinc-500 block mb-1">{spec.label}</span>
                    <span className="text-sm font-medium">{spec.value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Features */}
            <div className="mb-24 md:mb-6">
              <h3 className="text-lg font-semibold mb-3">Features</h3>
              <div className="grid gap-3">
                {[
                  'Dishwasher Safe',
                  'Microwave Safe',
                  'Scratch Resistant',
                  'Heat Resistant',
                  'Stackable Design',
                  'Eco-friendly Materials',
                ].map((feature) => (
                  <div key={feature} className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-zinc-900 rounded-full" />
                    <span className="text-sm text-zinc-600">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Container>
  );
};
