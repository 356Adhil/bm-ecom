// app/components/profile/ProfileInfo.jsx
'use client';
import { useState } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';

export function ProfileInfo() {
  const router = useRouter();
  const { data: session, update } = useSession();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: session?.user?.name || '',
    email: session?.user?.email || '',
  });

  const handleLogout = async () => {
    await signOut({ redirect: false });
    router.push('/');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        await update({ ...session, user: { ...session?.user, ...formData } });
        setIsEditing(false);
      }
    } catch (error) {
      console.error('Failed to update profile:', error);
    }
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Profile Information</h2>
        <div className="flex gap-4 items-center">
          <motion.button
            className="text-zinc-500 hover:text-zinc-800"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsEditing(!isEditing)}
          >
            {isEditing ? 'Cancel' : 'Edit'}
          </motion.button>
          <motion.button
            className="text-red-500 hover:text-red-700 flex items-center gap-2"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleLogout}
          >
            <span>Logout</span>
          </motion.button>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-zinc-700">Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              disabled={!isEditing}
              className="mt-1 block w-full rounded-lg border border-zinc-300 px-3 py-2 focus:border-zinc-500 focus:outline-none disabled:bg-zinc-50"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-700">Email</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              disabled={!isEditing}
              className="mt-1 block w-full rounded-lg border border-zinc-300 px-3 py-2 focus:border-zinc-500 focus:outline-none disabled:bg-zinc-50"
            />
          </div>

          {isEditing && (
            <motion.button
              type="submit"
              className="w-full bg-zinc-900 text-white rounded-lg px-4 py-2 mt-4"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Save Changes
            </motion.button>
          )}
        </div>
      </form>
    </div>
  );
}
