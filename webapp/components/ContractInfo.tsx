import { Package, Database, User } from 'lucide-react';
import { CONFIG } from '@/lib/config';

export function ContractInfo() {
  const contracts = [
    {
      name: 'Package',
      icon: Package,
      color: 'blue',
      address: CONFIG.packageId,
    },
    {
      name: 'Registry',
      icon: Database,
      color: 'purple',
      address: CONFIG.registryId,
    },
    {
      name: 'Identity',
      icon: User,
      color: 'green',
      address: CONFIG.identityId,
    },
  ];

  const getColorClasses = (color: string) => {
    const colors: Record<string, { bg: string; icon: string }> = {
      blue: { bg: 'bg-blue-500/20', icon: 'text-blue-400' },
      purple: { bg: 'bg-purple-500/20', icon: 'text-purple-400' },
      green: { bg: 'bg-green-500/20', icon: 'text-green-400' },
    };
    return colors[color] || colors.blue;
  };

  return (
    <section className="py-16 bg-gradient-to-b from-transparent to-nova-primary/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="glass-card rounded-2xl p-6 sm:p-8">
          <h3 className="font-display text-xl font-bold text-nova-text mb-4">
            智能合约
          </h3>
          <p className="text-nova-muted text-sm mb-6">
            以下对象部署在 Sui Testnet，可通过 SuiScan 查看
          </p>

          <div className="space-y-4">
            {contracts.map((contract) => {
              const colors = getColorClasses(contract.color);
              const shortAddress = `${contract.address.slice(0, 6)}...${contract.address.slice(-4)}`;
              
              return (
                <div
                  key={contract.name}
                  className="flex flex-col sm:flex-row sm:items-center gap-2 p-4 glass-card rounded-xl"
                >
                  <div className="flex items-center gap-3 sm:w-48">
                    <div className={`w-10 h-10 rounded-lg ${colors.bg} flex items-center justify-center`}>
                      <contract.icon className={`w-5 h-5 ${colors.icon}`} />
                    </div>
                    <span className="font-medium">{contract.name}</span>
                  </div>
                  <a
                    href={`https://suiscan.xyz/testnet/object/${contract.address}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-nova-cta hover:underline font-mono text-sm truncate"
                    title={contract.address}
                  >
                    {shortAddress}
                  </a>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}