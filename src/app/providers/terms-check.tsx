'use client';

import { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';

export function TermsChecker() {
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const accepted = localStorage.getItem('acceptedTerms');
    if (accepted !== 'true' && pathname !== '/terms') {
      router.replace('/terms');
    }
  }, [pathname, router]);

  return null;
}

