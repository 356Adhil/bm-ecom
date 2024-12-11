// app/components/profile/AccountSettings.jsx
'use client';
import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { motion } from 'framer-motion';

export function AccountSettings() {
  const { data: session } = useSession();
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      const response = await fetch('/api/user/password', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentPassword: passwordForm.currentPassword,
          newPassword: passwordForm.newPassword,
        }),
      });

      if (response.ok) {
        setSuccess('Password updated successfully');
        setIsChangingPassword(false);
        setPasswordForm({
          currentPassword: '',
          newPassword: '',
          confirmPassword: '',
        });
      } else {
        const data = await response.json();
        setError(data.message || 'Failed to update password');
      }
    } catch (error) {
      setError('An error occurred. Please try again.');
    }
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm">
      <h2 className="text-xl font-semibold mb-6">Account Settings</h2>

      <div className="space-y-6">
        {/* Account Type */}
        <div>
          <h3 className="text-lg font-medium mb-2">Account Type</h3>
          <p className="text-zinc-600">Signed in with: {session?.user?.provider || 'email'}</p>
        </div>

        {/* Password Change Section */}
        {session?.user?.provider === 'credentials' && (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">Password</h3>
              <motion.button
                className="text-zinc-500 hover:text-zinc-800"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsChangingPassword(!isChangingPassword)}
              >
                {isChangingPassword ? 'Cancel' : 'Change Password'}
              </motion.button>
            </div>

            {isChangingPassword && (
              <form onSubmit={handlePasswordChange} className="space-y-4">
                {error && <p className="text-red-600 text-sm">{error}</p>}
                {success && <p className="text-green-600 text-sm">{success}</p>}
                <input
                  type="password"
                  placeholder="Current Password"
                  value={passwordForm.currentPassword}
                  onChange={(e) =>
                    setPasswordForm({
                      ...passwordForm,
                      currentPassword: e.target.value,
                    })
                  }
                  className="w-full rounded-lg border border-zinc-300 px-3 py-2"
                />
                <input
                  type="password"
                  placeholder="New Password"
                  value={passwordForm.newPassword}
                  onChange={(e) =>
                    setPasswordForm({
                      ...passwordForm,
                      newPassword: e.target.value,
                    })
                  }
                  className="w-full rounded-lg border border-zinc-300 px-3 py-2"
                />
                <input
                  type="password"
                  placeholder="Confirm New Password"
                  value={passwordForm.confirmPassword}
                  onChange={(e) =>
                    setPasswordForm({
                      ...passwordForm,
                      confirmPassword: e.target.value,
                    })
                  }
                  className="w-full rounded-lg border border-zinc-300 px-3 py-2"
                />
                <motion.button
                  type="submit"
                  className="w-full bg-zinc-900 text-white rounded-lg px-4 py-2"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Update Password
                </motion.button>
              </form>
            )}
          </div>
        )}

        {/* Delete Account Section */}
        <div>
          <h3 className="text-lg font-medium text-red-600 mb-2">Danger Zone</h3>
          <motion.button
            className="text-red-600 border border-red-600 rounded-lg px-4 py-2 w-full hover:bg-red-50"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Delete Account
          </motion.button>
        </div>
      </div>
    </div>
  );
}
