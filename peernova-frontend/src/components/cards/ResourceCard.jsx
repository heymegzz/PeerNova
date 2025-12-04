import Button from '../common/Button';

function ResourceCard({
  resource,
  viewMode = 'grid',
  onEdit,
  onDelete,
  onView,
  onDownload,
  isOwner,
}) {
  const handleView = () => {
    onView?.(resource);
  };

  const handleDownload = () => {
    onDownload?.(resource);
  };

  const handleEdit = () => {
    onEdit?.(resource);
  };

  const handleDelete = () => {
    onDelete?.(resource);
  };

  if (viewMode === 'list') {
    return (
      <div className="grid grid-cols-12 items-center gap-3 px-4 py-3 border-b border-[#1a1a1a] text-sm">
        <div className="col-span-12 md:col-span-2 text-gray-300 text-xs truncate">
          {resource.category}
        </div>
        <div className="col-span-12 md:col-span-3 text-white font-medium truncate">
          {resource.title}
        </div>
        <div className="col-span-12 md:col-span-4 text-gray-400 text-xs truncate">
          {resource.description}
        </div>
        <div className="col-span-6 md:col-span-1 text-gray-300 text-xs truncate">
          {resource.uploadedBy}
        </div>
        <div className="col-span-6 md:col-span-2 flex items-center justify-end gap-2">
          <Button variant="ghost" size="sm" onClick={handleView}>
            View
          </Button>
          <Button variant="ghost" size="sm" onClick={handleDownload}>
            Download
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
      <div className="mb-3">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-2">
            <div className="h-9 w-9 rounded-lg bg-[#1a1a1a] flex items-center justify-center text-lg">
              📄
            </div>
            <span className="text-[11px] text-gray-400 px-2 py-1 rounded-full bg-[#1a1a1a]">
              {resource.category}
            </span>
          </div>
          <span className="text-[11px] text-gray-500">
            {resource.createdAtLabel || 'Recently'}
          </span>
        </div>
        <h3 className="text-white font-semibold text-sm mb-1 line-clamp-1">
          {resource.title}
        </h3>
        <p className="text-gray-400 text-xs line-clamp-3 mb-2">
          {resource.description}
        </p>
        <p className="text-[11px] text-gray-500">
          By {resource.uploadedBy || 'Unknown'}
        </p>
      </div>

      <div className="flex flex-wrap gap-2 justify-between pt-2">
        <div className="flex gap-2">
          <Button variant="secondary" size="sm" onClick={handleView}>
            View
          </Button>
          <Button variant="ghost" size="sm" onClick={handleDownload}>
            Download
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

export default ResourceCard;


