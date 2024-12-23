'use client';

import { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { useRouter } from 'next/navigation';
import { Movie, TVShow } from '@/lib/api';
import SearchResults from './SearchResults';

const Overlay = styled.div<{ $isOpen: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: ${props => props.$isOpen ? 'flex' : 'none'};
  justify-content: center;
  align-items: flex-start;
  padding-top: 100px;
  z-index: 1000;
  backdrop-filter: blur(5px);
`;

const Modal = styled.div`
  width: 100%;
  max-width: 600px;
  background: rgba(30, 30, 30, 0.95);
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.5);
  position: relative;
`;

const SearchHeader = styled.div`
  display: flex;
  align-items: center;
  padding: 1rem;
  gap: 1rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
`;

const SearchInput = styled.input`
  flex: 1;
  background: none;
  border: none;
  color: white;
  font-size: 1rem;
  outline: none;
  
  &::placeholder {
    color: rgba(255, 255, 255, 0.5);
  }
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: rgba(255, 255, 255, 0.6);
  cursor: pointer;
  padding: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: color 0.2s;

  &:hover {
    color: white;
  }
`;

const SearchIcon = styled.div`
  color: rgba(255, 255, 255, 0.6);
  display: flex;
  align-items: center;
`;

const LoadingSpinner = styled.div`
  display: inline-block;
  width: 1rem;
  height: 1rem;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top-color: white;
  animation: spin 1s linear infinite;

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;

interface SearchModalProps {
  onClose: () => void;
}

export default function SearchModal({ onClose }: SearchModalProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<(Movie | TVShow)[]>([]);
  const [loading, setLoading] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    inputRef.current?.focus();

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]);

  useEffect(() => {
    const searchTimeout = setTimeout(async () => {
      if (query.length < 2) {
        setResults([]);
        return;
      }

      setLoading(true);
      try {
        const response = await fetch(`/api/movies/search?query=${encodeURIComponent(query)}`);
        const data = await response.json();
        setResults(data.results || []);
      } catch (error) {
        console.error('Error searching:', error);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(searchTimeout);
  }, [query]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
    }
  };

  return (
    <Overlay $isOpen={true} onKeyDown={handleKeyDown}>
      <Modal ref={modalRef}>
        <SearchHeader>
          <SearchIcon>
            <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </SearchIcon>
          <SearchInput
            ref={inputRef}
            type="text"
            placeholder="Поиск фильмов и сериалов..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          {loading ? (
            <LoadingSpinner />
          ) : (
            <CloseButton onClick={onClose}>
              <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </CloseButton>
          )}
        </SearchHeader>
        {results.length > 0 && <SearchResults results={results} onItemClick={onClose} />}
      </Modal>
    </Overlay>
  );
}
