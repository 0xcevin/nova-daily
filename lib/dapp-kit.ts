import { createDAppKit } from '@mysten/dapp-kit-react';
import { SuiClient } from '@mysten/sui/client';

const RPC_URLS: Record<string, string> = {
  testnet: 'https://fullnode.testnet.sui.io:443',
  mainnet: 'https://fullnode.mainnet.sui.io:443',
};

export const dAppKit = createDAppKit({
  networks: ['testnet', 'mainnet'],
  defaultNetwork: 'testnet',
  createClient: (network) =>
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    new SuiClient({ url: RPC_URLS[network] }) as any,
  autoConnect: true,
});

declare module '@mysten/dapp-kit-react' {
  interface Register {
    dAppKit: typeof dAppKit;
  }
}