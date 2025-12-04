import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import DashboardLayout from '../components/layouts/DashboardLayout';
import LoadingSpinner from '../components/states/LoadingSpinner';
import EmptyState from '../components/states/EmptyState';
import Button from '../components/common/Button';
import ENDPOINTS from '../api/endpoints';
import axiosInstance from '../api/axios';
import ConfirmDeleteModal from '../components/modals/ConfirmDeleteModal';
import { ToastContainer } from '../components/notifications/Toast';

function Settings() {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState('account');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [toasts, setToasts] = useState([]);

  const addToast = (type, message) => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, type, message }]);
  };

  const dismissToast = (id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  const {
    data,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['settings'],
    queryFn: async () => {
      const response = await axiosInstance.get(ENDPOINTS.SETTINGS);
      return response.data.data;
    },
  });

  const settings = data;

  const changePasswordMutation = useMutation({
    mutationFn: (payload) => axiosInstance.put(ENDPOINTS.PROFILE_PASSWORD, payload),
    onSuccess: () => {
      addToast('success', 'Password updated successfully');
    },
    onError: () => addToast('error', 'Failed to update password.'),
  });

  const updateSettingsMutation = useMutation({
    mutationFn: (payload) => axiosInstance.put(ENDPOINTS.SETTINGS, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['settings'] });
      addToast('success', 'Preferences saved');
    },
    onError: () => addToast('error', 'Failed to save preferences.'),
  });

  const deleteAccountMutation = useMutation({
    mutationFn: () => axiosInstance.delete(ENDPOINTS.PROFILE),
    onSuccess: () => {
      addToast('success', 'Account deleted');
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/';
    },
    onError: () => addToast('error', 'Failed to delete account.'),
  });

  const isMutating =
    changePasswordMutation.isPending ||
    updateSettingsMutation.isPending ||
    deleteAccountMutation.isPending;

  const handleChangePassword = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const oldPassword = formData.get('oldPassword');
    const newPassword = formData.get('newPassword');
    const confirmPassword = formData.get('confirmPassword');

    if (newPassword !== confirmPassword) {
      addToast('error', 'New password and confirmation do not match.');
      return;
    }

    changePasswordMutation.mutate({
      oldPassword,
      newPassword,
      confirmPassword,
    });
  };

  const handleSavePreferences = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const payload = {
      theme: formData.get('theme'),
      emailNotifications: formData.get('emailNotifications') === 'on',
      inAppNotifications: formData.get('inAppNotifications') === 'on',
      privateProfile: formData.get('privateProfile') === 'on',
      hideActivity: formData.get('hideActivity') === 'on',
    };

    if (payload.theme) {
      localStorage.setItem('theme', payload.theme);
      document.documentElement.classList.toggle('dark', payload.theme === 'dark');
    }

    updateSettingsMutation.mutate(payload);
  };

  const handleDeleteAccount = () => {
    setShowDeleteConfirm(true);
  };

  const confirmDeleteAccount = () => {
    deleteAccountMutation.mutate();
  };

  if (isLoading) {
    return (
      <DashboardLayout title="Settings">
        <LoadingSpinner fullPage message="Loading settings..." />
      </DashboardLayout>
    );
  }

  if (isError || !settings) {
    return (
      <DashboardLayout title="Settings">
        <EmptyState
          icon="⚙️"
          title="Unable to load settings"
          message="There was an issue loading your settings. Please try again later."
        />
      </DashboardLayout>
    );
  }

  const prefs = settings.preferences || {};

  return (
    <>
      <DashboardLayout title="Settings">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Tabs list */}
          <aside className="w-full lg:w-56 space-y-2">
            <button
              type="button"
              onClick={() => setActiveTab('account')}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm ${
                activeTab === 'account'
                  ? 'bg-white text-black'
                  : 'bg-[#111111] text-gray-300 hover:bg-[#1a1a1a]'
              }`}
            >
              Account Settings
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('preferences')}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm ${
                activeTab === 'preferences'
                  ? 'bg-white text-black'
                  : 'bg-[#111111] text-gray-300 hover:bg-[#1a1a1a]'
              }`}
            >
              Preferences
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('about')}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm ${
                activeTab === 'about'
                  ? 'bg-white text-black'
                  : 'bg-[#111111] text-gray-300 hover:bg-[#1a1a1a]'
              }`}
            >
              About
            </button>
          </aside>

          {/* Tab content */}
          <section className="flex-1 space-y-6">
            {activeTab === 'account' && (
              <>
                <div className="border border-[#1a1a1a] bg-[#111111] rounded-xl p-4">
                  <h3 className="text-sm font-semibold text-white mb-3">
                    Change Password
                  </h3>
                  <form onSubmit={handleChangePassword} className="space-y-3 text-sm">
                    <div>
                      <label className="block text-xs text-gray-300 mb-1">
                        Current Password
                      </label>
                      <input
                        type="password"
                        name="oldPassword"
                        required
                        className="w-full px-3 py-2 rounded-lg bg-[#111111] border border-[#333333] text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-300 mb-1">
                        New Password
                      </label>
                      <input
                        type="password"
                        name="newPassword"
                        required
                        className="w-full px-3 py-2 rounded-lg bg-[#111111] border border-[#333333] text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-300 mb-1">
                        Confirm New Password
                      </label>
                      <input
                        type="password"
                        name="confirmPassword"
                        required
                        className="w-full px-3 py-2 rounded-lg bg-[#111111] border border-[#333333] text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white"
                      />
                    </div>
                    <div className="flex justify-end">
                      <Button
                        type="submit"
                        variant="primary"
                        size="sm"
                        isLoading={changePasswordMutation.isPending}
                      >
                        Save Password
                      </Button>
                    </div>
                  </form>
                </div>

                <div className="border border-[#1a1a1a] bg-[#111111] rounded-xl p-4">
                  <h3 className="text-sm font-semibold text-white mb-2">
                    Delete Account
                  </h3>
                  <p className="text-xs text-gray-400 mb-3">
                    This will permanently delete your account, study groups, and resources.
                    This action cannot be undone.
                  </p>
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    onClick={handleDeleteAccount}
                  >
                    Delete my account
                  </Button>
                </div>
              </>
            )}

            {activeTab === 'preferences' && (
              <div className="border border-[#1a1a1a] bg-[#111111] rounded-xl p-4">
                <h3 className="text-sm font-semibold text-white mb-3">
                  Preferences
                </h3>
                <form onSubmit={handleSavePreferences} className="space-y-4 text-sm">
                  <div>
                    <label className="block text-xs text-gray-300 mb-1">
                      Theme
                    </label>
                    <select
                      name="theme"
                      defaultValue={prefs.theme || 'dark'}
                      className="w-full px-3 py-2 rounded-lg bg-[#111111] border border-[#333333] text-sm text-white focus:outline-none focus:ring-2 focus:ring-white"
                    >
                      <option value="light">Light</option>
                      <option value="dark">Dark</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-gray-300 text-xs">
                      <input
                        type="checkbox"
                        name="emailNotifications"
                        defaultChecked={prefs.emailNotifications}
                        className="w-4 h-4 bg-[#111111] border border-[#333333] rounded cursor-pointer accent-white"
                      />
                      Email Notifications
                    </label>
                    <label className="flex items-center gap-2 text-gray-300 text-xs">
                      <input
                        type="checkbox"
                        name="inAppNotifications"
                        defaultChecked={prefs.inAppNotifications}
                        className="w-4 h-4 bg-[#111111] border border-[#333333] rounded cursor-pointer accent-white"
                      />
                      In-app Notifications
                    </label>
                    <label className="flex items-center gap-2 text-gray-300 text-xs">
                      <input
                        type="checkbox"
                        name="privateProfile"
                        defaultChecked={prefs.privateProfile}
                        className="w-4 h-4 bg-[#111111] border border-[#333333] rounded cursor-pointer accent-white"
                      />
                      Private Profile
                    </label>
                    <label className="flex items-center gap-2 text-gray-300 text-xs">
                      <input
                        type="checkbox"
                        name="hideActivity"
                        defaultChecked={prefs.hideActivity}
                        className="w-4 h-4 bg-[#111111] border border-[#333333] rounded cursor-pointer accent-white"
                      />
                      Hide Activity
                    </label>
                  </div>

                  <div className="flex justify-end">
                    <Button
                      type="submit"
                      variant="primary"
                      size="sm"
                      isLoading={updateSettingsMutation.isPending}
                    >
                      Save Preferences
                    </Button>
                  </div>
                </form>
              </div>
            )}

            {activeTab === 'about' && (
              <div className="border border-[#1a1a1a] bg-[#111111] rounded-xl p-4 text-sm text-gray-300">
                <h3 className="text-sm font-semibold text-white mb-3">
                  About PeerNova
                </h3>
                <p className="text-xs text-gray-400 mb-4">
                  PeerNova is a campus collaboration platform designed to help students
                  connect, share resources, and learn together.
                </p>
                <dl className="space-y-2 text-xs">
                  <div className="flex justify-between">
                    <dt className="text-gray-400">App Version</dt>
                    <dd>v1.0.0</dd>
                  </div>
                </dl>
                <div className="mt-4 space-y-2 text-xs">
                  <a href="#" className="text-gray-300 hover:text-white block">
                    Privacy Policy
                  </a>
                  <a href="#" className="text-gray-300 hover:text-white block">
                    Terms of Service
                  </a>
                  <a href="#" className="text-gray-300 hover:text-white block">
                    Contact Support
                  </a>
                  <a href="#" className="text-gray-300 hover:text-white block">
                    GitHub
                  </a>
                </div>
              </div>
            )}
          </section>
        </div>
      </DashboardLayout>

      <ConfirmDeleteModal
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={confirmDeleteAccount}
        itemName="Your PeerNova account"
        isLoading={deleteAccountMutation.isPending}
        title="Delete Account"
        message="Are you sure you want to delete your account? This action is permanent and cannot be undone."
      />

      <ToastContainer toasts={toasts} dismissToast={dismissToast} />

      {isMutating && (
        <div className="fixed inset-0 z-40 flex items-end justify-center pointer-events-none">
          <div className="mb-8 rounded-full bg-black/70 px-4 py-2 text-xs text-gray-300 flex items-center gap-2">
            <span className="animate-spin rounded-full h-3 w-3 border border-white border-t-transparent" />
            <span>Saving changes...</span>
          </div>
        </div>
      )}
    </>
  );
}

export default Settings;


