// components/layout/AuthModal.jsx
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { signIn } from 'next-auth/react';
import Image from 'next/image';

export const AuthModal = ({ isOpen, onClose }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (isLogin) {
      const result = await signIn('credentials', {
        redirect: false,
        email: formData.email,
        password: formData.password,
      });

      if (result?.error) {
        setError(result.error);
      } else {
        onClose();
      }
    } else {
      try {
        const res = await fetch('/api/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });

        if (res.ok) {
          const result = await signIn('credentials', {
            redirect: false,
            email: formData.email,
            password: formData.password,
          });
          if (!result?.error) onClose();
        } else {
          const data = await res.json();
          setError(data.message);
        }
      } catch (err) {
        setError('Something went wrong. Please try again.');
      }
    }
  };

  const handleGoogleSignIn = () => {
    signIn('google', { callbackUrl: window.location.origin });
  };

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
            <h2 className="text-2xl font-bold">{isLogin ? 'Welcome back' : 'Create account'}</h2>
            <button onClick={onClose} className="p-2 hover:bg-zinc-100 rounded-full">
              <X size={24} />
            </button>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 text-red-500 rounded-lg text-sm">{error}</div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <input
                type="text"
                placeholder="Full name"
                className="w-full px-4 py-3 rounded-xl border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-zinc-500"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            )}
            <input
              type="email"
              placeholder="Email address"
              className="w-full px-4 py-3 rounded-xl border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-zinc-500"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
            <input
              type="password"
              placeholder="Password"
              className="w-full px-4 py-3 rounded-xl border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-zinc-500"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required
            />
            <button
              type="submit"
              className="w-full bg-zinc-900 text-white py-4 rounded-2xl font-medium hover:bg-zinc-800"
            >
              {isLogin ? 'Sign in' : 'Create account'}
            </button>
          </form>

          <div className="my-6 flex items-center">
            <div className="flex-1 border-t border-zinc-200" />
            <span className="px-4 text-sm text-zinc-500">or</span>
            <div className="flex-1 border-t border-zinc-200" />
          </div>

          <button
            onClick={handleGoogleSignIn}
            className="w-full bg-white border-2 border-zinc-200 py-4 rounded-2xl font-medium flex items-center justify-center gap-2 hover:bg-zinc-50"
          >
            <Image src="/google-icon.svg" alt="Google" width={20} height={20} />
            Continue with Google
          </button>

          <p className="text-center mt-6 text-zinc-500">
            {isLogin ? "Don't have an account? " : 'Already have an account? '}
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-zinc-900 font-medium hover:underline"
            >
              {isLogin ? 'Sign up' : 'Sign in'}
            </button>
          </p>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
