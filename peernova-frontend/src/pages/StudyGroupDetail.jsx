import { useParams, useNavigate, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import DashboardLayout from '../components/layouts/DashboardLayout';
import LoadingSpinner from '../components/states/LoadingSpinner';
import EmptyState from '../components/states/EmptyState';
import Button from '../components/common/Button';
import ENDPOINTS from '../api/endpoints';
import axiosInstance from '../api/axios';
import ConfirmDeleteModal from '../components/modals/ConfirmDeleteModal';
import { ToastContainer } from '../components/notifications/Toast';
import { useState } from 'react';

function StudyGroupDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [toasts, setToasts] = useState([]);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const addToast = (type, message) => {
    const toastId = Date.now();
    setToasts((prev) => [...prev, { id: toastId, type, message }]);
  };

  const dismissToast = (toastId) => {
    setToasts((prev) => prev.filter((t) => t.id !== toastId));
  };

  const {
    data,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['study-group', id],
    queryFn: async () => {
      const response = await axiosInstance.get(`${ENDPOINTS.STUDY_GROUPS}/${id}`);
      return response.data.data;
    },
  });

  const group = data;

  const joinMutation = useMutation({
    mutationFn: () => axiosInstance.post(`${ENDPOINTS.STUDY_GROUPS}/${id}/join`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['study-group', id] });
      addToast('success', 'Joined group');
    },
    onError: () => addToast('error', 'Failed to join group.'),
  });

  const leaveMutation = useMutation({
    mutationFn: () => axiosInstance.delete(`${ENDPOINTS.STUDY_GROUPS}/${id}/leave`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['study-group', id] });
      addToast('success', 'Left group');
    },
    onError: () => addToast('error', 'Failed to leave group.'),
  });

  const deleteMutation = useMutation({
    mutationFn: () => axiosInstance.delete(`${ENDPOINTS.STUDY_GROUPS}/${id}`),
    onSuccess: () => {
      addToast('success', 'Study group deleted');
      queryClient.invalidateQueries({ queryKey: ['study-groups'] });
      navigate('/study-groups');
    },
    onError: () => addToast('error', 'Failed to delete group.'),
  });

  const isMember = group?.isMember;
  const isOwner = group?.isOwner;

  const handleJoinLeave = () => {
    if (isMember) {
      leaveMutation.mutate();
    } else {
      joinMutation.mutate();
    }
  };

  const handleDelete = () => {
    setShowDeleteConfirm(true);
  };

  const confirmDelete = () => {
    deleteMutation.mutate();
  };

  const isMutating =
    joinMutation.isPending ||
    leaveMutation.isPending ||
    deleteMutation.isPending;

  if (isLoading) {
    return (
      <DashboardLayout title="Study Group">
        <LoadingSpinner fullPage message="Loading study group..." />
      </DashboardLayout>
    );
  }

  if (isError || !group) {
    return (
      <DashboardLayout title="Study Group">
        <EmptyState
          icon="⚠️"
          title="Study group not found"
          message="This group may have been deleted or is not accessible."
          actionText="Back to Study Groups"
          onAction={() => navigate('/study-groups')}
        />
      </DashboardLayout>
    );
  }

  return (
    <>
      <DashboardLayout
        title={group.name}
        description={group.description}
        actions={
          <div className="flex gap-2">
            {isOwner && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleDelete}
              >
                Delete
              </Button>
            )}
            <Button
              variant={isMember ? 'secondary' : 'primary'}
              size="sm"
              onClick={handleJoinLeave}
            >
              {isMember ? 'Leave Group' : 'Join Group'}
            </Button>
          </div>
        }
      >
        {/* Header meta */}
        <section className="mb-8">
          <div className="flex flex-wrap items-center gap-3 text-xs text-gray-400">
            <span className="inline-flex items-center rounded-full bg-[#111111] px-3 py-1 text-xs text-gray-300">
              {group.subject}
            </span>
            <span>Created {group.createdAtLabel || 'recently'}</span>
            <span>
              By{' '}
              <span className="text-gray-200">{group.createdBy || 'Unknown'}</span>
            </span>
            <span>•</span>
            <span>👥 {group.memberCount ?? 0} members</span>
          </div>
        </section>

        {/* Tabs (static layout, content focus on Overview + Members) */}
        <section className="mb-6">
          <div className="inline-flex rounded-lg border border-[#1a1a1a] bg-[#111111] p-1 text-xs text-gray-300 mb-4">
            <button className="px-3 py-1 rounded-md bg-white text-black">
              Overview
            </button>
            <button className="px-3 py-1 rounded-md hover:bg-[#1a1a1a]">
              Members
            </button>
            <button className="px-3 py-1 rounded-md hover:bg-[#1a1a1a]">
              Resources
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-4">
              <div className="border border-[#1a1a1a] bg-[#111111] rounded-xl p-4">
                <h3 className="text-sm font-semibold text-white mb-2">
                  Overview
                </h3>
                <p className="text-sm text-gray-300 whitespace-pre-line">
                  {group.description}
                </p>
              </div>

              <div className="border border-[#1a1a1a] bg-[#111111] rounded-xl p-4">
                <h3 className="text-sm font-semibold text-white mb-2">
                  Group Details
                </h3>
                <dl className="space-y-2 text-sm text-gray-300">
                  <div className="flex justify-between">
                    <dt className="text-gray-400">Subject</dt>
                    <dd>{group.subject}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-gray-400">Created</dt>
                    <dd>{group.createdAtLabel || 'Recently'}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-gray-400">Members</dt>
                    <dd>{group.memberCount ?? 0}</dd>
                  </div>
                  {group.maxMembers && (
                    <div className="flex justify-between">
                      <dt className="text-gray-400">Max Members</dt>
                      <dd>{group.maxMembers}</dd>
                    </div>
                  )}
                </dl>
              </div>
            </div>

            <aside className="space-y-4">
              <div className="border border-[#1a1a1a] bg-[#111111] rounded-xl p-4">
                <h3 className="text-sm font-semibold text-white mb-2">
                  Members
                </h3>
                {Array.isArray(group.members) && group.members.length > 0 ? (
                  <ul className="space-y-2 text-sm text-gray-300 max-h-64 overflow-y-auto">
                    {group.members.map((member) => (
                      <li
                        key={member.id}
                        className="flex items-center justify-between gap-2"
                      >
                        <div className="flex items-center gap-2">
                          <div className="h-7 w-7 rounded-full bg-[#1a1a1a] flex items-center justify-center text-xs">
                            {(member.name || member.email || '?')
                              .charAt(0)
                              .toUpperCase()}
                          </div>
                          <div>
                            <p className="text-xs text-white">
                              {member.name || member.email}
                            </p>
                            <p className="text-[11px] text-gray-500">
                              Joined {member.joinedAtLabel || 'recently'}
                            </p>
                          </div>
                        </div>
                        {isOwner && !member.isOwner && (
                          <span className="text-[10px] text-gray-500">
                            Owner controls coming soon
                          </span>
                        )}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-xs text-gray-500">
                    No members yet. Be the first to join!
                  </p>
                )}
              </div>

              <div className="border border-[#1a1a1a] bg-[#111111] rounded-xl p-4">
                <h3 className="text-sm font-semibold text-white mb-2">
                  Quick Links
                </h3>
                <div className="flex flex-col gap-2 text-xs">
                  <Link
                    to="/study-groups"
                    className="text-gray-300 hover:text-white"
                  >
                    ← Back to Study Groups
                  </Link>
                </div>
              </div>
            </aside>
          </div>
        </section>
      </DashboardLayout>

      <ConfirmDeleteModal
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={confirmDelete}
        itemName={group.name}
        isLoading={deleteMutation.isPending}
        title="Delete Study Group"
        message="Are you sure you want to delete this study group? This action cannot be undone."
      />

      <ToastContainer toasts={toasts} dismissToast={dismissToast} />

      {isMutating && (
        <div className="fixed inset-0 z-40 flex items-end justify-center pointer-events-none">
          <div className="mb-8 rounded-full bg-black/70 px-4 py-2 text-xs text-gray-300 flex items-center gap-2">
            <span className="animate-spin rounded-full h-3 w-3 border border-white border-t-transparent" />
            <span>Updating group...</span>
          </div>
        </div>
      )}
    </>
  );
}

export default StudyGroupDetail;


