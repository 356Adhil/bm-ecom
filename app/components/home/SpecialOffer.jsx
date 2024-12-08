import { motion } from "framer-motion";
import { useModals } from "@/app/contexts/ModalContext";

export const SpecialOffer = () => {
  const { openAuth } = useModals();

  return (
    <motion.section
      className="bg-gradient-to-br from-zinc-900 to-zinc-800 text-white mt-8 py-16 px-4 mb-24"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
    >
      <div className="max-w-6xl mx-auto">
        <h3 className="text-2xl font-bold mb-4">First Order Discount</h3>
        <p className="text-zinc-400 mb-8 max-w-md">
          Get 20% off on your first purchase when you sign up
        </p>
        <motion.button
          className="bg-white text-zinc-900 px-8 py-4 rounded-2xl font-medium"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={openAuth}
        >
          Sign Up Now
        </motion.button>
      </div>
    </motion.section>
  );
};
