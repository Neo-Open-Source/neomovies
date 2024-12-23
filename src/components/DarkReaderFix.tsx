'use client';

import { useEffect } from 'react';

export function DarkReaderFix() {
  useEffect(() => {
    const html = document.documentElement;
    html.removeAttribute('data-darkreader-mode');
    html.removeAttribute('data-darkreader-scheme');
  }, []);

  return null;
}
