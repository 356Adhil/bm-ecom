// app/profile/page.js
'use client';
import { useSession } from 'next-auth/react';
import { useState } from 'react';
import { ProfileInfo } from '@/app/components/profile/ProfileInfo';
import { OrderHistory } from '@/app/components/profile/OrderHistory';
import { SavedAddresses } from '@/app/components/profile/SavedAddresses';
import { AccountSettings } from '@/app/components/profile/AccountSettings';
import { motion, AnimatePresence } from 'framer-motion';

export default function ProfilePage() {
  const { data: session } = useSession();
  const [activeTab, setActiveTab] = useState('info');

  const tabs = [
    { id: 'info', label: 'Profile Info' },
    { id: 'orders', label: 'Order History' },
    { id: 'addresses', label: 'Saved Addresses' },
    { id: 'settings', label: 'Account Settings' },
  ];

  if (!session) return null;

  return (
    <main className="min-h-screen px-4 py-8 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">My Profile</h1>

      <div className="flex gap-2 overflow-x-auto pb-4 no-scrollbar">
        {tabs.map((tab) => (
          <motion.button
            key={tab.id}
            className={`px-4 py-2 rounded-full text-sm whitespace-nowrap transition-all duration-200 ${
              activeTab === tab.id
                ? 'bg-zinc-900 text-white'
                : 'bg-white text-zinc-600 hover:bg-zinc-100'
            }`}
            onClick={() => setActiveTab(tab.id)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {tab.label}
          </motion.button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.2 }}
          className="mt-6"
        >
          {activeTab === 'info' && <ProfileInfo />}
          {activeTab === 'orders' && <OrderHistory />}
          {activeTab === 'addresses' && <SavedAddresses />}
          {activeTab === 'settings' && <AccountSettings />}
        </motion.div>
      </AnimatePresence>
    </main>
  );
}
