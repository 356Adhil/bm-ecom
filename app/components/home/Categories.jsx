// components/home/Categories.jsx
import { motion } from 'framer-motion';
import { categories } from '../../data/categories';

export const Categories = () => {
  return (
    <section className="px-4 py-8 max-w-6xl mx-auto">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {categories.map((category, index) => (
          <motion.div
            key={category.name}
            className="bg-white p-6 rounded-3xl group cursor-pointer"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ y: -4 }}
          >
            <span className="text-4xl mb-4 block">{category.icon}</span>
            <h3 className="font-semibold mb-2 group-hover:text-zinc-600">{category.name}</h3>
            <p className="text-sm text-zinc-500">{category.description}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
};
