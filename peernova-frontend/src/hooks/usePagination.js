import { useMemo, useState } from 'react';

function usePagination({ totalItems = 0, initialPage = 1, itemsPerPage = 12 } = {}) {
  const [currentPage, setCurrentPage] = useState(initialPage);

  const totalPages = useMemo(
    () => (totalItems > 0 ? Math.ceil(totalItems / itemsPerPage) : 1),
    [totalItems, itemsPerPage]
  );

  const currentRange = useMemo(() => {
    if (totalItems === 0) {
      return { start: 0, end: 0 };
    }

    const start = (currentPage - 1) * itemsPerPage + 1;
    const end = Math.min(start + itemsPerPage - 1, totalItems);
    return { start, end };
  }, [currentPage, itemsPerPage, totalItems]);

  const goToPage = (page) => {
    if (!page || Number.isNaN(page)) return;
    const next = Math.max(1, Math.min(page, totalPages));
    setCurrentPage(next);
  };

  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  return {
    currentPage,
    totalPages,
    currentRange,
    setCurrentPage: goToPage,
    nextPage,
    prevPage,
  };
}

export default usePagination;


