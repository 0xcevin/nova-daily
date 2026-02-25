import { Transaction } from '@mysten/sui/transactions';
import { SuiClient } from '@mysten/sui/client';
import { Ed25519Keypair } from '@mysten/sui/keypairs/ed25519';

const CONFIG = {
  packageId: '0x64c8a15b8b135522d8af8e658817ced5a447a35f59ffa7784daac5ac27f7f8c9',
  registryId: '0xbde6dae4a2ad1d51e01733ac8fa248bbe4350825d9237ecbf85919a9fb47c4ff',
  identityId: '0xa2b87b13dba09113f7e6c1a964f45a4ca1d9e3af5bcc2d4f7704cdde08450677',
};

async function publishEpisode() {
  // Note: This requires a private key. For demonstration only.
  // In production, use wallet signing.
  
  const client = new SuiClient({ url: 'https://fullnode.testnet.sui.io' });
  
  const tx = new Transaction();
  
  tx.moveCall({
    target: `${CONFIG.packageId}::nova_daily::publish_episode`,
    arguments: [
      tx.object(CONFIG.registryId),
      tx.object(CONFIG.identityId),
      tx.pure.string('2026-02-25'),
      tx.pure.string('Nova Daily #2'),
      tx.pure.string('Test episode for Walrus storage'),
      tx.pure.string('U0ue7_YssVF0sN6mipZW7wSz8nuh2x2bZgz--ldE3gE'),
      tx.pure.vector('string', ['Walrus', 'Test']),
      tx.pure.u64(14),
    ],
  });
  
  console.log('Transaction built successfully');
  console.log('Note: This script needs a signer to execute');
}

publishEpisode().catch(console.error);