import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../components/layouts/DashboardLayout';
import LoadingSpinner from '../components/states/LoadingSpinner';
import EmptyState from '../components/states/EmptyState';
import ENDPOINTS from '../api/endpoints';
import axiosInstance from '../api/axios';
import StudyGroupCard from '../components/cards/StudyGroupCard';
import ResourceCard from '../components/cards/ResourceCard';
import { ToastContainer } from '../components/notifications/Toast';
import { useState } from 'react';

function Profile() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('groups'); // 'groups' | 'resources' | 'joined'
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
    queryKey: ['profile'],
    queryFn: async () => {
      const response = await axiosInstance.get(ENDPOINTS.PROFILE);
      return response.data.data;
    },
  });

  const profile = data;

  if (isLoading) {
    return (
      <DashboardLayout title="Profile">
        <LoadingSpinner fullPage message="Loading profile..." />
      </DashboardLayout>
    );
  }

  if (isError || !profile) {
    return (
      <DashboardLayout title="Profile">
        <EmptyState
          icon="⚠️"
          title="Unable to load profile"
          message="There was an issue loading your profile. Please try again later."
        />
      </DashboardLayout>
    );
  }

  const stats = profile.stats || {
    groupsCreated: 0,
    groupsJoined: 0,
    resourcesUploaded: 0,
    totalDownloads: 0,
  };

  const user = profile.user;

  const getInitials = (name = '') => {
    const parts = name.trim().split(' ');
    if (parts.length === 0) return '';
    if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
    return (parts[0].charAt(0) + parts[1].charAt(0)).toUpperCase();
  };

  const handleViewResource = (resource) => {
    navigate(`/resources/${resource.id}`);
  };

  const handleDownloadResource = (resource) => {
    if (resource.fileUrl) {
      window.open(resource.fileUrl, '_blank');
    } else {
      addToast('error', 'Download link is not available for this resource.');
    }
  };

  return (
    <>
      <DashboardLayout title="Profile">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left column: profile card */}
          <section className="space-y-4">
            <div className="border border-[#1a1a1a] bg-[#111111] rounded-2xl p-6 flex flex-col items-center text-center shadow-sm">
              <div className="h-20 w-20 rounded-full bg-white text-black flex items-center justify-center text-2xl font-bold mb-4">
                {getInitials(user.name || user.fullName || user.email)}
              </div>
              <h2 className="text-white font-semibold text-lg mb-1">
                {user.name || user.fullName}
              </h2>
              <p className="text-xs text-gray-400 mb-1">{user.email}</p>
              {user.university && (
                <p className="text-xs text-gray-400 mb-1">{user.university}</p>
              )}
              {profile.memberSinceLabel && (
                <p className="text-[11px] text-gray-500">
                  Member since {profile.memberSinceLabel}
                </p>
              )}
            </div>

            <div className="border border-[#1a1a1a] bg-[#111111] rounded-2xl p-4">
              <h3 className="text-sm font-semibold text-white mb-3">
                Stats
              </h3>
              <dl className="space-y-2 text-sm text-gray-300">
                <div className="flex justify-between">
                  <dt className="text-gray-400">Study Groups Created</dt>
                  <dd>{stats.groupsCreated}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-gray-400">Study Groups Joined</dt>
                  <dd>{stats.groupsJoined}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-gray-400">Resources Uploaded</dt>
                  <dd>{stats.resourcesUploaded}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-gray-400">Total Downloads</dt>
                  <dd>{stats.totalDownloads}</dd>
                </div>
              </dl>
            </div>
          </section>

          {/* Right column: tabs content */}
          <section className="lg:col-span-2 space-y-4">
            <div className="inline-flex rounded-full border border-[#1a1a1a] bg-[#111111] p-1 text-[11px] text-gray-300 mb-2">
              <button
                type="button"
                onClick={() => setActiveTab('groups')}
                className={`px-3 py-1 rounded-full ${
                  activeTab === 'groups' ? 'bg-white text-black' : 'hover:bg-[#1a1a1a]'
                }`}
              >
                Your Study Groups
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('resources')}
                className={`px-3 py-1 rounded-full ${
                  activeTab === 'resources' ? 'bg-white text-black' : 'hover:bg-[#1a1a1a]'
                }`}
              >
                Your Resources
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('joined')}
                className={`px-3 py-1 rounded-full ${
                  activeTab === 'joined' ? 'bg-white text-black' : 'hover:bg-[#1a1a1a]'
                }`}
              >
                Joined Groups
              </button>
            </div>

            {/* Your Study Groups */}
            {activeTab === 'groups' && (
              <div className="border border-[#1a1a1a] bg-[#111111] rounded-2xl p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-white">
                  Your Study Groups
                </h3>
                <span className="text-[11px] text-gray-500">
                  {profile.ownedGroups?.length || 0} groups
                </span>
              </div>
              {Array.isArray(profile.ownedGroups) && profile.ownedGroups.length > 0 ? (
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {profile.ownedGroups.map((group) => (
                    <StudyGroupCard
                      key={group.id}
                      group={group}
                      viewMode="grid"
                      isOwner
                      isMember
                    />
                  ))}
                </div>
              ) : (
                <p className="text-xs text-gray-500">
                  You haven't created any study groups yet.
                </p>
              )}
              </div>
            )}

            {/* Your Resources */}
            {activeTab === 'resources' && (
              <div className="border border-[#1a1a1a] bg-[#111111] rounded-2xl p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-white">
                  Your Resources
                </h3>
                <span className="text-[11px] text-gray-500">
                  {profile.ownedResources?.length || 0} resources
                </span>
              </div>
              {Array.isArray(profile.ownedResources) && profile.ownedResources.length > 0 ? (
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {profile.ownedResources.map((resource) => (
                    <ResourceCard
                      key={resource.id}
                      resource={resource}
                      viewMode="grid"
                      isOwner
                      onView={handleViewResource}
                      onDownload={handleDownloadResource}
                    />
                  ))}
                </div>
              ) : (
                <p className="text-xs text-gray-500">
                  You haven't uploaded any resources yet.
                </p>
              )}
              </div>
            )}

            {/* Joined Groups */}
            {activeTab === 'joined' && (
              <div className="border border-[#1a1a1a] bg-[#111111] rounded-2xl p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-white">
                  Joined Groups
                </h3>
                <span className="text-[11px] text-gray-500">
                  {profile.joinedGroups?.length || 0} groups
                </span>
              </div>
              {Array.isArray(profile.joinedGroups) && profile.joinedGroups.length > 0 ? (
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {profile.joinedGroups.map((group) => (
                    <StudyGroupCard
                      key={group.id}
                      group={group}
                      viewMode="grid"
                      isOwner={group.isOwner}
                      isMember
                    />
                  ))}
                </div>
              ) : (
                <p className="text-xs text-gray-500">
                  You're not a member of any groups yet.
                </p>
              )}
              </div>
            )}
          </section>
        </div>
      </DashboardLayout>

      <ToastContainer toasts={toasts} dismissToast={dismissToast} />
    </>
  );
}

export default Profile;


