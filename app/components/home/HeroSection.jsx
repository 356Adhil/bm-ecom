import { motion } from "framer-motion";

export const HeroSection = ({ onExploreClick }) => {
  return (
    <motion.section
      className="px-4 py-12 md:py-24 max-w-6xl mx-auto"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <h2 className="text-4xl md:text-6xl font-bold mb-6">
        Elevate Your
        <br />
        Table Setting
      </h2>
      <p className="text-zinc-500 text-lg mb-8 max-w-md">
        Discover our curated collection of premium crockery and kitchenware
      </p>
      <motion.button
        className="bg-zinc-900 text-white px-8 py-4 rounded-2xl font-medium"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={onExploreClick}
      >
        Explore Collection
      </motion.button>
    </motion.section>
  );
};
