function Pagination({ currentPage, totalPages, onPageChange, totalResults, itemsPerPage }) {
  if (!totalResults || totalResults <= 0) return null;

  const createPageArray = () => {
    const pages = [];
    const maxButtons = 5;

    if (totalPages <= maxButtons) {
      for (let i = 1; i <= totalPages; i += 1) {
        pages.push(i);
      }
      return pages;
    }

    let start = Math.max(1, currentPage - 2);
    let end = Math.min(totalPages, start + maxButtons - 1);

    if (end - start < maxButtons - 1) {
      start = Math.max(1, end - maxButtons + 1);
    }

    for (let i = start; i <= end; i += 1) {
      pages.push(i);
    }

    return pages;
  };

  const pages = createPageArray();
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(startItem + itemsPerPage - 1, totalResults);

  return (
    <div className="mt-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4 text-sm">
      <p className="text-gray-400">
        Showing <span className="text-white">{startItem}</span>-
        <span className="text-white">{endItem}</span> of{' '}
        <span className="text-white">{totalResults}</span> results
      </p>

      <div className="flex items-center gap-1 justify-end">
        <button
          type="button"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-3 py-1 rounded-lg border border-[#333333] text-gray-300 hover:bg-[#1a1a1a] disabled:opacity-40 disabled:cursor-not-allowed text-xs"
        >
          Previous
        </button>

        {pages[0] > 1 && (
          <>
            <button
              type="button"
              onClick={() => onPageChange(1)}
              className={`px-3 py-1 rounded-lg text-xs border ${
                currentPage === 1
                  ? 'bg-white text-black border-white'
                  : 'border-[#333333] text-gray-300 hover:bg-[#1a1a1a]'
              }`}
            >
              1
            </button>
            {pages[0] > 2 && <span className="px-1 text-gray-500 text-xs">...</span>}
          </>
        )}

        {pages.map((page) => (
          <button
            key={page}
            type="button"
            onClick={() => onPageChange(page)}
            className={`px-3 py-1 rounded-lg text-xs border ${
              page === currentPage
                ? 'bg-white text-black border-white'
                : 'border-[#333333] text-gray-300 hover:bg-[#1a1a1a]'
            }`}
          >
            {page}
          </button>
        ))}

        {pages[pages.length - 1] < totalPages && (
          <>
            {pages[pages.length - 1] < totalPages - 1 && (
              <span className="px-1 text-gray-500 text-xs">...</span>
            )}
            <button
              type="button"
              onClick={() => onPageChange(totalPages)}
              className={`px-3 py-1 rounded-lg text-xs border ${
                currentPage === totalPages
                  ? 'bg-white text-black border-white'
                  : 'border-[#333333] text-gray-300 hover:bg-[#1a1a1a]'
              }`}
            >
              {totalPages}
            </button>
          </>
        )}

        <button
          type="button"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="ml-1 px-3 py-1 rounded-lg border border-[#333333] text-gray-300 hover:bg-[#1a1a1a] disabled:opacity-40 disabled:cursor-not-allowed text-xs"
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default Pagination;


