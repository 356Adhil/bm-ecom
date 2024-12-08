// components/product/ProductGallery.jsx
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, X, ZoomIn } from "lucide-react";
import Image from "next/image";

export const ProductGallery = ({ images }) => {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [showFullscreen, setShowFullscreen] = useState(false);

  return (
    <>
      {/* Main Gallery */}
      <div className="relative">
        {/* Large Image Display */}
        <div className="relative aspect-square bg-zinc-100 overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedImageIndex}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="relative w-full h-full"
            >
              <Image
                src={images[selectedImageIndex]}
                alt={`Product view ${selectedImageIndex + 1}`}
                fill
                className="object-cover"
              />
              <button
                onClick={() => setShowFullscreen(true)}
                className="absolute bottom-4 right-4 p-3 bg-white/90 backdrop-blur-sm rounded-full shadow-lg"
              >
                <ZoomIn size={20} />
              </button>
            </motion.div>
          </AnimatePresence>

          {/* Navigation Arrows */}
          {images.length > 1 && (
            <>
              <button
                onClick={() =>
                  setSelectedImageIndex(
                    (prev) => (prev - 1 + images.length) % images.length
                  )
                }
                className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-lg"
              >
                <ChevronLeft size={24} />
              </button>
              <button
                onClick={() =>
                  setSelectedImageIndex((prev) => (prev + 1) % images.length)
                }
                className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-lg"
              >
                <ChevronRight size={24} />
              </button>
            </>
          )}
        </div>

        {/* Thumbnail Strip */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 px-4 py-2 bg-white/90 backdrop-blur-sm rounded-full shadow-lg">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => setSelectedImageIndex(index)}
              className={`relative w-8 h-8 rounded-full overflow-hidden ${
                index === selectedImageIndex ? "ring-2 ring-black" : ""
              }`}
            >
              <Image
                src={images[index]}
                alt={`Thumbnail ${index + 1}`}
                fill
                className="object-cover"
              />
            </button>
          ))}
        </div>
      </div>

      {/* Fullscreen Gallery */}
      <AnimatePresence>
        {showFullscreen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black z-50 flex flex-col"
          >
            {/* Fullscreen Header */}
            <div className="p-4 flex justify-between items-center">
              <span className="text-white">
                {selectedImageIndex + 1} / {images.length}
              </span>
              <button
                onClick={() => setShowFullscreen(false)}
                className="text-white p-2"
              >
                <X size={24} />
              </button>
            </div>

            {/* Fullscreen Image Viewer */}
            <div className="flex-1 relative">
              <AnimatePresence mode="wait">
                <motion.div
                  key={selectedImageIndex}
                  initial={{ opacity: 0, scale: 1.1 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="absolute inset-0"
                >
                  <Image
                    src={images[selectedImageIndex]}
                    alt={`Full view ${selectedImageIndex + 1}`}
                    fill
                    className="object-contain"
                  />
                </motion.div>
              </AnimatePresence>

              {/* Fullscreen Navigation */}
              <button
                onClick={() =>
                  setSelectedImageIndex(
                    (prev) => (prev - 1 + images.length) % images.length
                  )
                }
                className="absolute left-4 top-1/2 -translate-y-1/2 p-4 text-white"
              >
                <ChevronLeft size={32} />
              </button>
              <button
                onClick={() =>
                  setSelectedImageIndex((prev) => (prev + 1) % images.length)
                }
                className="absolute right-4 top-1/2 -translate-y-1/2 p-4 text-white"
              >
                <ChevronRight size={32} />
              </button>
            </div>

            {/* Fullscreen Thumbnails */}
            <div className="p-4">
              <div className="flex gap-2 overflow-x-auto no-scrollbar">
                {images.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImageIndex(index)}
                    className={`relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 ${
                      index === selectedImageIndex ? "ring-2 ring-white" : ""
                    }`}
                  >
                    <Image
                      src={images[index]}
                      alt={`Thumbnail ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
