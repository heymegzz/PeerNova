import { useParams, useNavigate, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import DashboardLayout from '../components/layouts/DashboardLayout';
import LoadingSpinner from '../components/states/LoadingSpinner';
import EmptyState from '../components/states/EmptyState';
import Button from '../components/common/Button';
import ENDPOINTS from '../api/endpoints';
import axiosInstance from '../api/axios';
import ConfirmDeleteModal from '../components/modals/ConfirmDeleteModal';
import { ToastContainer } from '../components/notifications/Toast';
import { useState } from 'react';

function ResourceDetail() {
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
    queryKey: ['resource', id],
    queryFn: async () => {
      const response = await axiosInstance.get(`${ENDPOINTS.RESOURCES}/${id}`);
      return response.data.data;
    },
  });

  const resource = data;
  const isOwner = resource?.isOwner;

  const deleteMutation = useMutation({
    mutationFn: () => axiosInstance.delete(`${ENDPOINTS.RESOURCES}/${id}`),
    onSuccess: () => {
      addToast('success', 'Resource deleted');
      queryClient.invalidateQueries({ queryKey: ['resources'] });
      navigate('/resources');
    },
    onError: () => addToast('error', 'Failed to delete resource.'),
  });

  const handleDownload = () => {
    if (resource?.fileUrl) {
      window.open(resource.fileUrl, '_blank');
    } else {
      addToast('error', 'Download link is not available for this resource.');
    }
  };

  const handleDelete = () => {
    setShowDeleteConfirm(true);
  };

  const confirmDelete = () => {
    deleteMutation.mutate();
  };

  const isMutating = deleteMutation.isPending;

  if (isLoading) {
    return (
      <DashboardLayout title="Resource">
        <LoadingSpinner fullPage message="Loading resource..." />
      </DashboardLayout>
    );
  }

  if (isError || !resource) {
    return (
      <DashboardLayout title="Resource">
        <EmptyState
          icon={ExclamationTriangleIcon}
          title="Resource not found"
          message="This resource may have been deleted or is not accessible."
          actionText="Back to Resources"
          onAction={() => navigate('/resources')}
        />
      </DashboardLayout>
    );
  }

  return (
    <>
      <DashboardLayout
        title={resource.title}
        description={resource.description}
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
              variant="primary"
              size="sm"
              onClick={handleDownload}
            >
              Download
            </Button>
          </div>
        }
      >
        {/* Header meta */}
        <section className="mb-8">
          <div className="flex flex-wrap items-center gap-3 text-xs text-gray-400">
            <span className="inline-flex items-center rounded-full bg-[#111111] px-3 py-1 text-xs text-gray-300">
              {resource.category}
            </span>
            <span>Uploaded {resource.createdAtLabel || 'recently'}</span>
            <span>
              By{' '}
              <span className="text-gray-200">{resource.uploadedBy || 'Unknown'}</span>
            </span>
          </div>
        </section>

        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="border border-[#1a1a1a] bg-[#111111] rounded-xl p-6">
              <h3 className="text-sm font-semibold text-white mb-4">
                Description
              </h3>
              <p className="text-sm text-gray-300 whitespace-pre-line leading-relaxed">
                {resource.description || 'No description provided for this resource.'}
              </p>
            </div>
          </div>

          <aside className="space-y-4">
            <div className="border border-[#1a1a1a] bg-[#111111] rounded-xl p-4">
              <h3 className="text-sm font-semibold text-white mb-2">
                Resource Details
              </h3>
              <dl className="space-y-2 text-sm text-gray-300">
                <div className="flex justify-between">
                  <dt className="text-gray-400">Category</dt>
                  <dd>{resource.category}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-gray-400">Uploaded</dt>
                  <dd>{resource.createdAtLabel || 'Recently'}</dd>
                </div>
                {resource.downloadCount != null && (
                  <div className="flex justify-between">
                    <dt className="text-gray-400">Downloads</dt>
                    <dd>{resource.downloadCount}</dd>
                  </div>
                )}
                {resource.subject && (
                  <div className="flex justify-between">
                    <dt className="text-gray-400">Subject</dt>
                    <dd>{resource.subject}</dd>
                  </div>
                )}
              </dl>
            </div>

            <div className="border border-[#1a1a1a] bg-[#111111] rounded-xl p-4">
              <h3 className="text-sm font-semibold text-white mb-2">
                Quick Links
              </h3>
              <div className="flex flex-col gap-2 text-xs">
                <Link
                  to="/resources"
                  className="text-gray-300 hover:text-white"
                >
                  ← Back to Resources
                </Link>
              </div>
            </div>
          </aside>
        </section>
      </DashboardLayout>

      <ConfirmDeleteModal
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={confirmDelete}
        itemName={resource.title}
        isLoading={deleteMutation.isPending}
        title="Delete Resource"
        message="Are you sure you want to delete this resource? This action cannot be undone."
      />

      <ToastContainer toasts={toasts} dismissToast={dismissToast} />

      {isMutating && (
        <div className="fixed inset-0 z-40 flex items-end justify-center pointer-events-none">
          <div className="mb-8 rounded-full bg-black/70 px-4 py-2 text-xs text-gray-300 flex items-center gap-2">
            <span className="animate-spin rounded-full h-3 w-3 border border-white border-t-transparent" />
            <span>Updating resource...</span>
          </div>
        </div>
      )}
    </>
  );
}

export default ResourceDetail;


