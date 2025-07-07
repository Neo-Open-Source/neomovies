'use client';

import { Suspense } from 'react';
import SearchClient from './SearchClient';

function LoadingSpinner() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background text-foreground">
      <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-accent"></div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <SearchClient />
    </Suspense>
  );
} 