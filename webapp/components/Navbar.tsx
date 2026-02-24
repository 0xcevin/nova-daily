'use client';

import { ConnectButton } from '@mysten/dapp-kit';
import { Radio } from 'lucide-react';
import { NovaIdentity } from '@/lib/config';

interface NavbarProps {
  identity: NovaIdentity | null;
  currentAccount: { address: string } | null;
}

export function Navbar({ identity, currentAccount }: NavbarProps) {
  const isAdmin = identity && currentAccount?.address === identity.admin;

  return (
    <nav className="glass-nav fixed top-0 left-0 right-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-nova-cta to-yellow-500 flex items-center justify-center">
              <Radio className="w-5 h-5 text-white" />
            </div>
            <span className="font-display font-bold text-xl tracking-tight">
              Nova Daily
            </span>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 glass-card text-xs">
              <span className="w-2 h-2 rounded-full bg-green-500"></span>
              <span className="text-green-400">Testnet</span>
            </div>

            {isAdmin && (
              <span className="px-3 py-1 bg-purple-600/50 border border-purple-500/50 rounded-full text-xs font-medium text-purple-200">
                Admin
              </span>
            )}

            <ConnectButton
              connectText="连接钱包"
              connectedText="已连接"
              className="!bg-gradient-to-r !from-blue-600 !to-purple-600 !text-white !px-4 !py-2 !rounded-full !font-medium !text-sm !border-0 !hover:opacity-90"
            />
          </div>
        </div>
      </div>
    </nav>
  );
}