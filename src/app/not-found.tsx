"use client";

import Link from "next/link";
import { useTranslation } from "@/contexts/TranslationContext";

export default function NotFound() {
  const { t } = useTranslation();
  
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background text-foreground">
      <div className="w-full max-w-md bg-warm-50 dark:bg-warm-900 rounded-lg shadow-lg p-8 text-center">
        <h1 className="text-5xl font-bold mb-4">404</h1>
        <p className="text-lg text-muted-foreground mb-6">{t.common.pageNotFound || 'Страница не найдена'}</p>
        <Link
          href="/"
          className="inline-block bg-accent text-white px-6 py-3 rounded-lg font-medium hover:bg-accent/90 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2"
        >
          {t.nav.home}
        </Link>
      </div>
    </div>
  );
}
