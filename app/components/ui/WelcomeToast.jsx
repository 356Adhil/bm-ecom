import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check } from 'lucide-react';

export const WelcomeToast = ({ user, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 50 }}
        className="fixed bottom-20 left-1/2 -translate-x-1/2 bg-white shadow-lg rounded-2xl px-4 py-3 flex items-center gap-3"
      >
        <div className="bg-green-500 rounded-full p-1">
          <Check size={16} className="text-white" />
        </div>
        <p className="text-sm font-medium">Welcome back, {user?.name?.split(' ')[0] || 'there'}!</p>
      </motion.div>
    </AnimatePresence>
  );
};

export default WelcomeToast;
