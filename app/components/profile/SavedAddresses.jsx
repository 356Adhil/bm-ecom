// app/components/profile/SavedAddresses.jsx
'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export function SavedAddresses() {
  const [addresses, setAddresses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [newAddress, setNewAddress] = useState({
    name: '',
    street: '',
    city: '',
    state: '',
    zipCode: '',
    isDefault: false,
  });

  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        const response = await fetch('/api/user/addresses');
        if (response.ok) {
          const data = await response.json();
          setAddresses(data);
        }
      } catch (error) {
        console.error('Failed to fetch addresses:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAddresses();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/user/addresses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newAddress),
      });

      if (response.ok) {
        const data = await response.json();
        setAddresses([...addresses, data]);
        setIsAddingNew(false);
        setNewAddress({
          name: '',
          street: '',
          city: '',
          state: '',
          zipCode: '',
          isDefault: false,
        });
      }
    } catch (error) {
      console.error('Failed to add address:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-2xl p-6 shadow-sm animate-pulse">
        <div className="h-6 bg-zinc-200 rounded w-1/4 mb-6"></div>
        <div className="space-y-4">
          {[1, 2].map((i) => (
            <div key={i} className="border border-zinc-200 rounded-lg p-4">
              <div className="space-y-2">
                <div className="h-4 bg-zinc-200 rounded w-24"></div>
                <div className="h-3 bg-zinc-200 rounded w-48"></div>
                <div className="h-3 bg-zinc-200 rounded w-32"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Saved Addresses</h2>
        <motion.button
          className="text-zinc-500 hover:text-zinc-800"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsAddingNew(!isAddingNew)}
        >
          {isAddingNew ? 'Cancel' : 'Add New'}
        </motion.button>
      </div>

      {isAddingNew ? (
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Name"
            value={newAddress.name}
            onChange={(e) => setNewAddress({ ...newAddress, name: e.target.value })}
            className="w-full rounded-lg border border-zinc-300 px-3 py-2"
          />
          <input
            type="text"
            placeholder="Street Address"
            value={newAddress.street}
            onChange={(e) => setNewAddress({ ...newAddress, street: e.target.value })}
            className="w-full rounded-lg border border-zinc-300 px-3 py-2"
          />
          <div className="grid grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="City"
              value={newAddress.city}
              onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
              className="rounded-lg border border-zinc-300 px-3 py-2"
            />
            <input
              type="text"
              placeholder="State"
              value={newAddress.state}
              onChange={(e) => setNewAddress({ ...newAddress, state: e.target.value })}
              className="rounded-lg border border-zinc-300 px-3 py-2"
            />
          </div>
          <input
            type="text"
            placeholder="ZIP Code"
            value={newAddress.zipCode}
            onChange={(e) => setNewAddress({ ...newAddress, zipCode: e.target.value })}
            className="w-full rounded-lg border border-zinc-300 px-3 py-2"
          />
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="isDefault"
              checked={newAddress.isDefault}
              onChange={(e) => setNewAddress({ ...newAddress, isDefault: e.target.checked })}
            />
            <label htmlFor="isDefault">Set as default address</label>
          </div>
          <motion.button
            type="submit"
            className="w-full bg-zinc-900 text-white rounded-lg px-4 py-2"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Save Address
          </motion.button>
        </form>
      ) : (
        <div className="space-y-4">
          {addresses.map((address) => (
            <motion.div
              key={address.id}
              className="border border-zinc-200 rounded-lg p-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-medium">{address.name}</p>
                  <p className="text-sm text-zinc-600">{address.street}</p>
                  <p className="text-sm text-zinc-600">
                    {address.city}, {address.state} {address.zipCode}
                  </p>
                </div>
                {address.isDefault && (
                  <span className="bg-zinc-100 text-zinc-800 px-2 py-1 rounded-full text-xs">
                    Default
                  </span>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
