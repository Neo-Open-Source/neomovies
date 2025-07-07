"use client";

import dynamic from 'next/dynamic';

const VerificationClient = dynamic(() => import('./VerificationClient'), {
  ssr: false
});

export default function VerifyPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background text-foreground">
      <VerificationClient />
    </div>
  );
}
