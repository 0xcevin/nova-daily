'use client';

import dynamic from 'next/dynamic';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';

// Dynamically import DAppKitProvider to avoid SSR issues
const DAppKitProviderWrapper = dynamic(
  () => import('./DAppKitProviderWrapper'),
  { ssr: false }
);

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <DAppKitProviderWrapper>
        {children}
      </DAppKitProviderWrapper>
    </QueryClientProvider>
  );
}