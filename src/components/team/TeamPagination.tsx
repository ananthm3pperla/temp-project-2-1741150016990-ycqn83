import React from 'react';

interface TeamPaginationProps {
  currentPage: number;
  totalPages: number;
  totalMembers: number;
  pageSize: number;
  onPageChange: (page: number) => void;
}

export default function TeamPagination({
  currentPage,
  totalPages,
  totalMembers,
  pageSize,
  onPageChange,
}: TeamPaginationProps) {
  return (
    <div className="bg-card rounded-lg shadow-md p-4 flex items-center justify-between">
      <div className="text-sm text-muted">
        Showing {((currentPage - 1) * pageSize) + 1} to {Math.min(currentPage * pageSize, totalMembers)} of {totalMembers}
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="p-2 rounded-md border border-default hover:bg-card-hover disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          aria-label="Previous page"
        >
          Previous
        </button>
        <span className="text-sm text-muted">
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="p-2 rounded-md border border-default hover:bg-card-hover disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          aria-label="Next page"
        >
          Next
        </button>
      </div>
    </div>
  );
}