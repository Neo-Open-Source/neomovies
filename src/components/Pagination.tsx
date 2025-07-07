'use client';

import React from 'react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const PageButton = ({ onClick, disabled, active, children }: {
    onClick: () => void;
    disabled?: boolean;
    active?: boolean;
    children: React.ReactNode;
}) => {
    const baseClasses = 'px-3 py-1 rounded-md text-sm font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed';
    const activeClasses = 'bg-accent text-white';
    const inactiveClasses = 'bg-card hover:bg-card/80 text-foreground';

    return (
        <button
            onClick={onClick}
            disabled={disabled}
            className={`${baseClasses} ${active ? activeClasses : inactiveClasses}`}
        >
            {children}
        </button>
    );
};

export default function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  const maxVisiblePages = 5;
  const halfVisible = Math.floor(maxVisiblePages / 2);

  const getPageNumbers = () => {
    let start = Math.max(1, currentPage - halfVisible);
    let end = Math.min(totalPages, start + maxVisiblePages - 1);

    if (end - start + 1 < maxVisiblePages) {
      start = Math.max(1, end - maxVisiblePages + 1);
    }

    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  };

  const handlePageClick = (page: number) => {
    if (page !== currentPage && page > 0 && page <= totalPages) {
      onPageChange(page);
    }
  };

  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-center gap-2 my-8 text-foreground">
      <PageButton
        onClick={() => handlePageClick(1)}
        disabled={currentPage === 1}
      >
        «
      </PageButton>
      <PageButton
        onClick={() => handlePageClick(currentPage - 1)}
        disabled={currentPage === 1}
      >
        ‹
      </PageButton>

      {getPageNumbers().map(page => (
        <PageButton
          key={page}
          active={page === currentPage}
          onClick={() => handlePageClick(page)}
        >
          {page}
        </PageButton>
      ))}

      <PageButton
        onClick={() => handlePageClick(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        ›
      </PageButton>
      <PageButton
        onClick={() => handlePageClick(totalPages)}
        disabled={currentPage === totalPages}
      >
        »
      </PageButton>
    </div>
  );
}
