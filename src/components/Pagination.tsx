'use client';

import React from 'react';
import styled from 'styled-components';

const PaginationContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.5rem;
  margin: 2rem 0;
`;

const PageButton = styled.button<{ $active?: boolean }>`
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 0.5rem;
  background: ${props => props.$active ? props.theme.colors.primary : 'rgba(255, 255, 255, 0.1)'};
  color: white;
  cursor: pointer;
  transition: background 0.2s;

  &:hover {
    background: ${props => props.$active ? props.theme.colors.primary : 'rgba(255, 255, 255, 0.2)'};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const PageInfo = styled.span`
  color: white;
  padding: 0 1rem;
`;

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

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
    if (page !== currentPage) {
      onPageChange(page);
    }
  };

  if (totalPages <= 1) return null;

  return (
    <PaginationContainer>
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
          $active={page === currentPage}
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
    </PaginationContainer>
  );
}
