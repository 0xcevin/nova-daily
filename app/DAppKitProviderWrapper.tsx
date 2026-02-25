'use client';

import { DAppKitProvider } from '@mysten/dapp-kit-react';
import { dAppKit } from '@/lib/dapp-kit';

interface DAppKitProviderWrapperProps {
  children: React.ReactNode;
}

export default function DAppKitProviderWrapper({ children }: DAppKitProviderWrapperProps) {
  return (
    <DAppKitProvider dAppKit={dAppKit}>
      {children}
    </DAppKitProvider>
  );
}