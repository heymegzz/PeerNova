import Button from '../common/Button';

function StudyGroupCard({
  group,
  viewMode = 'grid',
  onEdit,
  onDelete,
  onJoin,
  isOwner,
  isMember,
}) {
  const handleJoinLeave = () => {
    onJoin?.(group);
  };

  const handleEdit = () => {
    onEdit?.(group);
  };

  const handleDelete = () => {
    onDelete?.(group);
  };

  if (viewMode === 'list') {
    return (
      <div className="grid grid-cols-12 items-center gap-3 px-4 py-3 border-b border-[#1a1a1a] text-sm">
        <div className="col-span-12 md:col-span-2 flex items-center gap-2">
          <span className="inline-flex items-center rounded-full bg-[#1a1a1a] px-3 py-1 text-xs text-gray-300">
            {group.subject}
          </span>
        </div>
        <div className="col-span-12 md:col-span-3 text-white font-medium truncate">
          {group.name}
        </div>
        <div className="col-span-12 md:col-span-4 text-gray-400 text-xs truncate">
          {group.description}
        </div>
        <div className="col-span-6 md:col-span-1 text-gray-300 text-xs">
          👥 {group.memberCount ?? 0}
        </div>
        <div className="col-span-6 md:col-span-2 flex items-center justify-end gap-2">
          <Button variant="ghost" size="sm" onClick={handleJoinLeave}>
            {isMember ? 'Leave' : 'Join'}
          </Button>
          {isOwner && (
            <>
              <Button variant="ghost" size="sm" onClick={handleEdit}>
                Edit
              </Button>
              <Button variant="ghost" size="sm" onClick={handleDelete}>
                Delete
              </Button>
            </>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col justify-between rounded-xl border border-[#1a1a1a] bg-[#111111] p-4 hover:border-[#333333] transition-colors duration-300">
      <div className="flex items-start justify-between gap-3 mb-3">
        <span className="inline-flex items-center rounded-full bg-[#1a1a1a] px-3 py-1 text-xs text-gray-300">
          {group.subject}
        </span>
        <span className="text-xs text-gray-400">
          👥 {group.memberCount ?? 0}
        </span>
      </div>
      <div className="mb-3">
        <h3 className="text-white font-semibold text-sm mb-1 line-clamp-1">{group.name}</h3>
        <p className="text-gray-400 text-xs line-clamp-3">{group.description}</p>
      </div>
      <div className="flex items-center justify-between text-[11px] text-gray-500 mb-3">
        <span>Created {group.createdAtLabel || 'recently'}</span>
        <span>By {group.createdBy || 'Unknown'}</span>
      </div>
      <div className="flex flex-wrap gap-2 justify-between">
        <div className="flex gap-2">
          <Button variant="secondary" size="sm">
            View
          </Button>
          <Button variant="ghost" size="sm" onClick={handleJoinLeave}>
            {isMember ? 'Leave' : 'Join'}
          </Button>
        </div>
        {isOwner && (
          <div className="flex gap-2">
            <Button variant="ghost" size="sm" onClick={handleEdit}>
              Edit
            </Button>
            <Button variant="ghost" size="sm" onClick={handleDelete}>
              Delete
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

export default StudyGroupCard;


