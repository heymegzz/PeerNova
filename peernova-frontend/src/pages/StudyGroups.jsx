import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import DashboardLayout from '../components/layouts/DashboardLayout';
import StudyGroupCard from '../components/cards/StudyGroupCard';
import Button from '../components/common/Button';
import Pagination from '../components/pagination/Pagination';
import LoadingSpinner from '../components/states/LoadingSpinner';
import EmptyState from '../components/states/EmptyState';
import CreateGroupModal from '../components/modals/CreateGroupModal';
import EditGroupModal from '../components/modals/EditGroupModal';
import ENDPOINTS from '../api/endpoints';
import axiosInstance from '../api/axios';
import { GROUP_SUBJECT_FILTERS, ITEMS_PER_PAGE, MEMBER_COUNT_FILTERS } from '../constants';
import { ToastContainer } from '../components/notifications/Toast';

function StudyGroups() {
  const [searchParams, setSearchParams] = useSearchParams();
  const queryClient = useQueryClient();

  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
  const [debouncedSearch, setDebouncedSearch] = useState(searchTerm);
  const [viewMode, setViewMode] = useState(searchParams.get('view') || 'grid');
  const [sortBy, setSortBy] = useState(searchParams.get('sort') || 'newest');
  const [selectedSubjects, setSelectedSubjects] = useState(
    searchParams.get('subjects')?.split(',').filter(Boolean) || []
  );
  const [memberFilter, setMemberFilter] = useState(searchParams.get('members') || '');
  const [page, setPage] = useState(Number(searchParams.get('page')) || 1);
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingGroup, setEditingGroup] = useState(null);

  const [toasts, setToasts] = useState([]);

  const addToast = (type, message) => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, type, message }]);
  };

  const dismissToast = (id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setPage(1);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Sync URL params
  useEffect(() => {
    const params = new URLSearchParams();
    if (debouncedSearch) params.set('search', debouncedSearch);
    if (viewMode !== 'grid') params.set('view', viewMode);
    if (sortBy !== 'newest') params.set('sort', sortBy);
    if (selectedSubjects.length > 0) params.set('subjects', selectedSubjects.join(','));
    if (memberFilter) params.set('members', memberFilter);
    if (page > 1) params.set('page', String(page));
    setSearchParams(params);
  }, [debouncedSearch, viewMode, sortBy, selectedSubjects, memberFilter, page, setSearchParams]);

  const queryKey = useMemo(
    () => ['study-groups', { debouncedSearch, sortBy, selectedSubjects, memberFilter, page }],
    [debouncedSearch, sortBy, selectedSubjects, memberFilter, page]
  );

  const {
    data,
    isLoading,
    isError,
  } = useQuery({
    queryKey,
    queryFn: async () => {
      const response = await axiosInstance.get(ENDPOINTS.STUDY_GROUPS, {
        params: {
          page,
          limit: ITEMS_PER_PAGE,
          search: debouncedSearch,
          sort: sortBy,
          subjects: selectedSubjects.join(','),
          members: memberFilter,
        },
      });
      return response.data.data || { items: [], total: 0 };
    },
    keepPreviousData: true,
  });

  const groups = data?.items || [];
  const total = data?.total || 0;
  const totalPages = Math.max(1, Math.ceil(total / ITEMS_PER_PAGE));

  const createMutation = useMutation({
    mutationFn: (payload) =>
      axiosInstance.post(ENDPOINTS.STUDY_GROUPS, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['study-groups'] });
      setIsCreateOpen(false);
      addToast('success', 'Study group created successfully');
    },
    onError: () => {
      addToast('error', 'Failed to create study group. Please try again.');
    },
  });

  const editMutation = useMutation({
    mutationFn: ({ id, payload }) =>
      axiosInstance.put(`${ENDPOINTS.STUDY_GROUPS}/${id}`, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['study-groups'] });
      setEditingGroup(null);
      addToast('success', 'Study group updated successfully');
    },
    onError: () => {
      addToast('error', 'Failed to update study group. Please try again.');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (group) =>
      axiosInstance.delete(`${ENDPOINTS.STUDY_GROUPS}/${group.id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['study-groups'] });
      setEditingGroup(null);
      addToast('success', 'Study group deleted successfully');
    },
    onError: () => {
      addToast('error', 'Failed to delete study group. Please try again.');
    },
  });

  const joinMutation = useMutation({
    mutationFn: (group) =>
      axiosInstance.post(`${ENDPOINTS.STUDY_GROUPS}/${group.id}/join`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['study-groups'] });
      addToast('success', 'Joined group');
    },
    onError: () => {
      addToast('error', 'Failed to join group. Please try again.');
    },
  });

  const leaveMutation = useMutation({
    mutationFn: (group) =>
      axiosInstance.delete(`${ENDPOINTS.STUDY_GROUPS}/${group.id}/leave`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['study-groups'] });
      addToast('success', 'Left group');
    },
    onError: () => {
      addToast('error', 'Failed to leave group. Please try again.');
    },
  });

  const handleToggleSubject = (subject) => {
    setPage(1);
    setSelectedSubjects((prev) =>
      prev.includes(subject)
        ? prev.filter((s) => s !== subject)
        : [...prev, subject]
    );
  };

  const handleResetFilters = () => {
    setSelectedSubjects([]);
    setMemberFilter('');
    setSortBy('newest');
    setSearchTerm('');
    setDebouncedSearch('');
    setPage(1);
  };

  const handlePageChange = (nextPage) => {
    if (nextPage < 1 || nextPage > totalPages) return;
    setPage(nextPage);
  };

  const handleCreateGroup = (payload) => {
    createMutation.mutate(payload);
  };

  const handleEditGroup = (payload) => {
    if (!editingGroup) return;
    editMutation.mutate({ id: editingGroup.id, payload });
  };

  const handleDeleteGroup = (group) => {
    deleteMutation.mutate(group);
  };

  const handleJoin = (group) => {
    if (group.isMember) {
      leaveMutation.mutate(group);
    } else {
      joinMutation.mutate(group);
    }
  };

  const isMutating =
    createMutation.isPending ||
    editMutation.isPending ||
    deleteMutation.isPending ||
    joinMutation.isPending ||
    leaveMutation.isPending;

  return (
    <>
      <DashboardLayout
        title="Study Groups"
        description="Discover, create, and manage focused groups for every subject."
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
              + Create Group
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
                placeholder="Search by group name..."
                className="w-full px-3 py-2 rounded-lg bg-[#111111] border border-[#333333] text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white"
              />
            </div>

            <div>
              <h3 className="text-xs font-semibold text-gray-300 uppercase tracking-wide mb-3">
                Subjects
              </h3>
              <div className="flex flex-wrap gap-2">
                {GROUP_SUBJECT_FILTERS.map((subject) => {
                  const isActive = selectedSubjects.includes(subject);
                  return (
                    <button
                      key={subject}
                      type="button"
                      onClick={() => handleToggleSubject(subject)}
                      className={`px-3 py-1 rounded-full text-xs border transition-colors ${
                        isActive
                          ? 'bg-white text-black border-white'
                          : 'border-[#333333] text-gray-300 hover:bg-[#1a1a1a]'
                      }`}
                    >
                      {subject}
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <h3 className="text-xs font-semibold text-gray-300 uppercase tracking-wide mb-3">
                Member Count
              </h3>
              <div className="space-y-2 text-xs text-gray-300">
                {MEMBER_COUNT_FILTERS.map((opt) => (
                  <label key={opt.value} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="memberFilter"
                      value={opt.value}
                      checked={memberFilter === opt.value}
                      onChange={(e) => {
                        setMemberFilter(e.target.value);
                        setPage(1);
                      }}
                      className="w-3 h-3 bg-[#111111] border border-[#333333] text-white focus:ring-white"
                    />
                    <span>{opt.label}</span>
                  </label>
                ))}
                <button
                  type="button"
                  onClick={() => setMemberFilter('')}
                  className="mt-1 text-[11px] text-gray-500 hover:text-gray-300 underline underline-offset-2"
                >
                  Clear member filter
                </button>
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
                  <option value="most-members">Most Members</option>
                  <option value="alpha">Alphabetical (A-Z)</option>
                  <option value="oldest">Oldest First</option>
                </select>
              </div>
            </div>

            {/* Content */}
            {isLoading ? (
              <LoadingSpinner fullPage message="Loading study groups..." />
            ) : isError ? (
              <EmptyState
                icon="⚠️"
                title="Unable to load study groups"
                message="There was an error fetching study groups. Please try again in a moment."
                actionText="Retry"
                onAction={() => queryClient.invalidateQueries({ queryKey })}
              />
            ) : groups.length === 0 ? (
              <EmptyState
                icon="👥"
                title="No study groups found"
                message="Try adjusting your search or filters, or create a new study group to get started."
                actionText="Create a Group"
                onAction={() => setIsCreateOpen(true)}
              />
            ) : (
              <>
                <p className="text-xs text-gray-400 mb-3">
                  Showing {groups.length} of {total} groups
                </p>

                {viewMode === 'grid' ? (
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {groups.map((group) => (
                      <StudyGroupCard
                        key={group.id}
                        group={group}
                        viewMode="grid"
                        onEdit={setEditingGroup}
                        onDelete={handleDeleteGroup}
                        onJoin={handleJoin}
                        isOwner={group.isOwner}
                        isMember={group.isMember}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="rounded-xl border border-[#1a1a1a] bg-[#111111] overflow-hidden">
                    <div className="hidden md:grid grid-cols-12 gap-3 px-4 py-2 border-b border-[#1a1a1a] text-[11px] text-gray-500">
                      <div className="col-span-2">Subject</div>
                      <div className="col-span-3">Group Name</div>
                      <div className="col-span-4">Description</div>
                      <div className="col-span-1">Members</div>
                      <div className="col-span-2 text-right">Actions</div>
                    </div>
                    {groups.map((group) => (
                      <StudyGroupCard
                        key={group.id}
                        group={group}
                        viewMode="list"
                        onEdit={setEditingGroup}
                        onDelete={handleDeleteGroup}
                        onJoin={handleJoin}
                        isOwner={group.isOwner}
                        isMember={group.isMember}
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

      <CreateGroupModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onSubmit={handleCreateGroup}
        isLoading={createMutation.isPending}
      />

      <EditGroupModal
        isOpen={Boolean(editingGroup)}
        onClose={() => setEditingGroup(null)}
        group={editingGroup}
        onSubmit={handleEditGroup}
        onDelete={handleDeleteGroup}
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

export default StudyGroups;


