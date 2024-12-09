// components/layout/AuthModal.jsx
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

export const AuthModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50 flex items-end md:items-center justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          className="bg-white w-full md:max-w-md md:rounded-3xl rounded-t-3xl p-6"
          initial={{ y: '100%' }}
          animate={{ y: 0 }}
          exit={{ y: '100%' }}
          transition={{ type: 'spring', damping: 25 }}
        >
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold">Welcome to Boba Metals</h2>
            <button onClick={onClose} className="p-2 hover:bg-zinc-100 rounded-full">
              <X size={24} />
            </button>
          </div>

          <div className="space-y-4">
            <button className="w-full bg-zinc-900 text-white py-4 rounded-2xl font-medium">
              Sign in with Email
            </button>
            <button className="w-full bg-white border-2 border-zinc-200 py-4 rounded-2xl font-medium">
              Continue as Guest
            </button>
            <p className="text-center text-zinc-500 text-sm">
              By continuing, you agree to our Terms of Service
            </p>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
