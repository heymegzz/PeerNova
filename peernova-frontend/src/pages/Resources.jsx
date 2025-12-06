import { useEffect, useMemo, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ExclamationTriangleIcon, BookOpenIcon } from '@heroicons/react/24/outline';
import DashboardLayout from '../components/layouts/DashboardLayout';
import ResourceCard from '../components/cards/ResourceCard';
import Button from '../components/common/Button';
import Pagination from '../components/pagination/Pagination';
import LoadingSpinner from '../components/states/LoadingSpinner';
import EmptyState from '../components/states/EmptyState';
import CreateResourceModal from '../components/modals/CreateResourceModal';
import EditResourceModal from '../components/modals/EditResourceModal';
import ENDPOINTS from '../api/endpoints';
import axiosInstance from '../api/axios';
import { ITEMS_PER_PAGE, RESOURCE_CATEGORIES } from '../constants';
import { ToastContainer } from '../components/notifications/Toast';

const DATE_FILTERS = [
  { label: 'Any time', value: '' },
  { label: 'This week', value: 'week' },
  { label: 'This month', value: 'month' },
  { label: 'This year', value: 'year' },
];

function Resources() {
  const [searchParams, setSearchParams] = useSearchParams();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
  const [debouncedSearch, setDebouncedSearch] = useState(searchTerm);
  const [viewMode, setViewMode] = useState(searchParams.get('view') || 'grid');
  const [sortBy, setSortBy] = useState(searchParams.get('sort') || 'newest');
  const [categoryFilter, setCategoryFilter] = useState(searchParams.get('category') || '');
  const [dateFilter, setDateFilter] = useState(searchParams.get('date') || '');
  const [page, setPage] = useState(Number(searchParams.get('page')) || 1);
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingResource, setEditingResource] = useState(null);

  const [toasts, setToasts] = useState([]);

  const addToast = (type, message) => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, type, message }]);
  };

  const dismissToast = (id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setPage(1);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  useEffect(() => {
    const params = new URLSearchParams();
    if (debouncedSearch) params.set('search', debouncedSearch);
    if (viewMode !== 'grid') params.set('view', viewMode);
    if (sortBy !== 'newest') params.set('sort', sortBy);
    if (categoryFilter) params.set('category', categoryFilter);
    if (dateFilter) params.set('date', dateFilter);
    if (page > 1) params.set('page', String(page));
    setSearchParams(params);
  }, [debouncedSearch, viewMode, sortBy, categoryFilter, dateFilter, page, setSearchParams]);

  const queryKey = useMemo(
    () => ['resources', { debouncedSearch, sortBy, categoryFilter, dateFilter, page }],
    [debouncedSearch, sortBy, categoryFilter, dateFilter, page]
  );

  const {
    data,
    isLoading,
    isError,
  } = useQuery({
    queryKey,
    queryFn: async () => {
      const response = await axiosInstance.get(ENDPOINTS.RESOURCES, {
        params: {
          page,
          limit: ITEMS_PER_PAGE,
          search: debouncedSearch,
          sort: sortBy,
          category: categoryFilter,
          date: dateFilter,
        },
      });
      return response.data.data || { items: [], total: 0 };
    },
    keepPreviousData: true,
  });

  const resources = data?.items || [];
  const total = data?.total || 0;
  const totalPages = Math.max(1, Math.ceil(total / ITEMS_PER_PAGE));

  const createMutation = useMutation({
    mutationFn: (payload) =>
      axiosInstance.post(ENDPOINTS.RESOURCES, payload, {
        headers: { 'Content-Type': 'multipart/form-data' },
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['resources'] });
      setIsCreateOpen(false);
      addToast('success', 'Resource uploaded successfully');
    },
    onError: (error) => {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to upload resource. Please try again.';
      addToast('error', errorMessage);
    },
  });

  const editMutation = useMutation({
    mutationFn: ({ id, payload }) =>
      axiosInstance.put(`${ENDPOINTS.RESOURCES}/${id}`, payload, {
        headers: { 'Content-Type': 'multipart/form-data' },
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['resources'] });
      setEditingResource(null);
      addToast('success', 'Resource updated successfully');
    },
    onError: () => {
      addToast('error', 'Failed to update resource. Please try again.');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (resource) =>
      axiosInstance.delete(`${ENDPOINTS.RESOURCES}/${resource.id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['resources'] });
      setEditingResource(null);
      addToast('success', 'Resource deleted successfully');
    },
    onError: () => {
      addToast('error', 'Failed to delete resource. Please try again.');
    },
  });

  const isMutating =
    createMutation.isPending ||
    editMutation.isPending ||
    deleteMutation.isPending;

  const handleResetFilters = () => {
    setCategoryFilter('');
    setDateFilter('');
    setSortBy('newest');
    setSearchTerm('');
    setDebouncedSearch('');
    setPage(1);
  };

  const handlePageChange = (nextPage) => {
    if (nextPage < 1 || nextPage > totalPages) return;
    setPage(nextPage);
  };

  const handleCreateResource = (payload) => {
    createMutation.mutate(payload);
  };

  const handleEditResource = (payload) => {
    if (!editingResource) return;
    editMutation.mutate({ id: editingResource.id, payload });
  };

  const handleDeleteResource = (resource) => {
    deleteMutation.mutate(resource);
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
      <DashboardLayout
        title="Resources"
        description="A clean library of notes, slides, and materials shared by your peers."
        actions={
          <div className="flex items-center gap-3">
            <button
              type="button"
              className="inline-flex items-center gap-2 rounded-lg border border-[#333333] bg-[#0f0f0f] px-3 py-1.5 text-xs text-gray-200 hover:bg-[#151515] lg:hidden"
              onClick={() => setIsFiltersOpen((prev) => !prev)}
            >
              <span>{isFiltersOpen ? 'Hide filters' : 'Show filters'}</span>
            </button>
            <Button variant="primary" size="sm" onClick={() => setIsCreateOpen(true)}>
              + Upload Resource
            </Button>
          </div>
        }
      >
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Filters sidebar */}
          <aside
            className={`
              lg:col-span-1 space-y-6 rounded-xl border border-[#1a1a1a] bg-[#090909] px-4 py-4
              lg:block ${isFiltersOpen ? 'block' : 'hidden'}
            `}
          >
            <div>
              <h3 className="text-xs font-semibold text-gray-300 uppercase tracking-wide mb-3">
                Search
              </h3>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by title or description..."
                className="w-full px-3 py-2 rounded-lg bg-[#111111] border border-[#333333] text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white"
              />
            </div>

            <div>
              <h3 className="text-xs font-semibold text-gray-300 uppercase tracking-wide mb-3">
                Category
              </h3>
              <div className="space-y-2 text-xs text-gray-300">
                {RESOURCE_CATEGORIES.map((cat) => (
                  <label key={cat} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="categoryFilter"
                      value={cat}
                      checked={categoryFilter === cat}
                      onChange={(e) => {
                        setCategoryFilter(e.target.value);
                        setPage(1);
                      }}
                      className="w-3 h-3 bg-[#111111] border border-[#333333] text-white focus:ring-white"
                    />
                    <span>{cat}</span>
                  </label>
                ))}
                <button
                  type="button"
                  onClick={() => setCategoryFilter('')}
                  className="mt-1 text-[11px] text-gray-500 hover:text-gray-300 underline underline-offset-2"
                >
                  Clear category filter
                </button>
              </div>
            </div>

            <div>
              <h3 className="text-xs font-semibold text-gray-300 uppercase tracking-wide mb-3">
                Upload Date
              </h3>
              <div className="space-y-2 text-xs text-gray-300">
                {DATE_FILTERS.map((opt) => (
                  <label key={opt.label} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="dateFilter"
                      value={opt.value}
                      checked={dateFilter === opt.value}
                      onChange={(e) => {
                        setDateFilter(e.target.value);
                        setPage(1);
                      }}
                      className="w-3 h-3 bg-[#111111] border border-[#333333] text-white focus:ring-white"
                    />
                    <span>{opt.label}</span>
                  </label>
                ))}
              </div>
            </div>

            <button
              type="button"
              onClick={handleResetFilters}
              className="text-xs text-gray-400 hover:text-white underline underline-offset-2"
            >
              Reset all filters
            </button>
          </aside>

          {/* Main list area */}
          <section className="lg:col-span-3 space-y-4">
            {/* Controls */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
              <div className="flex items-center gap-3">
                <span className="text-xs text-gray-400">
                  View:
                </span>
                <div className="inline-flex rounded-full border border-[#333333] bg-[#111111] p-1 text-[11px]">
                  <button
                    type="button"
                    onClick={() => setViewMode('grid')}
                    className={`px-3 py-1 rounded-md ${
                      viewMode === 'grid'
                        ? 'bg-white text-black'
                        : 'text-gray-300 hover:bg-[#1a1a1a]'
                    }`}
                  >
                    Grid
                  </button>
                  <button
                    type="button"
                    onClick={() => setViewMode('list')}
                    className={`px-3 py-1 rounded-md ${
                      viewMode === 'list'
                        ? 'bg-white text-black'
                        : 'text-gray-300 hover:bg-[#1a1a1a]'
                    }`}
                  >
                    List
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-xs text-gray-400">
                  Sort by
                </span>
                <select
                  value={sortBy}
                  onChange={(e) => {
                    setSortBy(e.target.value);
                    setPage(1);
                  }}
                  className="px-3 py-1.5 rounded-full bg-[#111111] border border-[#333333] text-[11px] text-white focus:outline-none focus:ring-2 focus:ring-white"
                >
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                  <option value="most-downloaded">Most Downloaded</option>
                  <option value="alpha">Alphabetical (A-Z)</option>
                </select>
              </div>
            </div>

            {/* Content */}
            {isLoading ? (
              <LoadingSpinner fullPage message="Loading resources..." />
            ) : isError ? (
              <EmptyState
                icon={ExclamationTriangleIcon}
                title="Unable to load resources"
                message="There was an error fetching resources. Please try again in a moment."
                actionText="Retry"
                onAction={() => queryClient.invalidateQueries({ queryKey })}
              />
            ) : resources.length === 0 ? (
              <EmptyState
                icon={BookOpenIcon}
                title="No resources found"
                message="Try adjusting your search or filters, or upload a new resource to get started."
                actionText="Upload a Resource"
                onAction={() => setIsCreateOpen(true)}
              />
            ) : (
              <>
                <p className="text-xs text-gray-400 mb-3">
                  Showing {resources.length} of {total} resources
                </p>

                {viewMode === 'grid' ? (
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {resources.map((resource) => (
                      <ResourceCard
                        key={resource.id}
                        resource={resource}
                        viewMode="grid"
                        onEdit={setEditingResource}
                        onDelete={handleDeleteResource}
                        onView={handleViewResource}
                        onDownload={handleDownloadResource}
                        isOwner={resource.isOwner}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="rounded-xl border border-[#1a1a1a] bg-[#111111] overflow-hidden">
                    <div className="hidden md:grid grid-cols-12 gap-3 px-4 py-2 border-b border-[#1a1a1a] text-[11px] text-gray-500">
                      <div className="col-span-2">Category</div>
                      <div className="col-span-3">Title</div>
                      <div className="col-span-4">Description</div>
                      <div className="col-span-1">Uploaded By</div>
                      <div className="col-span-2 text-right">Actions</div>
                    </div>
                    {resources.map((resource) => (
                      <ResourceCard
                        key={resource.id}
                        resource={resource}
                        viewMode="list"
                        onEdit={setEditingResource}
                        onDelete={handleDeleteResource}
                        onView={handleViewResource}
                        onDownload={handleDownloadResource}
                        isOwner={resource.isOwner}
                      />
                    ))}
                  </div>
                )}

                <Pagination
                  currentPage={page}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                  totalResults={total}
                  itemsPerPage={ITEMS_PER_PAGE}
                />
              </>
            )}
          </section>
        </div>
      </DashboardLayout>

      <CreateResourceModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onSubmit={handleCreateResource}
        isLoading={createMutation.isPending}
      />

      <EditResourceModal
        isOpen={Boolean(editingResource)}
        onClose={() => setEditingResource(null)}
        resource={editingResource}
        onSubmit={handleEditResource}
        onDelete={handleDeleteResource}
        isLoading={editMutation.isPending || deleteMutation.isPending}
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

export default Resources;


