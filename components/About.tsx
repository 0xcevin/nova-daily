import { Sparkles, Headphones, Mic2, ShieldCheck, Zap, Eye, Lock } from 'lucide-react';
import { NovaIdentity } from '@/lib/config';

interface AboutProps {
  identity: NovaIdentity | null;
}

export function About({ identity }: AboutProps) {
  const features = [
    {
      icon: ShieldCheck,
      title: '可信存储',
      desc: 'Walrus 去中心化',
      color: 'green',
    },
    {
      icon: Zap,
      title: '高速索引',
      desc: 'Sui 区块链',
      color: 'yellow',
    },
    {
      icon: Eye,
      title: '透明公开',
      desc: '链上验证',
      color: 'blue',
    },
    {
      icon: Lock,
      title: '永久可用',
      desc: '不可篡改',
      color: 'purple',
    },
  ];

  const getColorClass = (color: string) => {
    const colors: Record<string, string> = {
      green: 'text-green-400',
      yellow: 'text-yellow-400',
      blue: 'text-blue-400',
      purple: 'text-purple-400',
    };
    return colors[color] || 'text-white';
  };

  return (
    <section id="about" className="py-20 sm:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="glass-card rounded-3xl p-8 sm:p-12">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            {/* Avatar Section */}
            <div className="lg:w-1/2">
              <div className="relative">
                <div className="w-48 h-48 sm:w-64 sm:h-64 mx-auto rounded-3xl bg-gradient-to-br from-nova-cta to-yellow-500 flex items-center justify-center">
                  <Sparkles className="w-24 h-24 sm:w-32 sm:h-32 text-white/80" />
                </div>
                <div className="absolute -top-4 -right-4 w-20 h-20 rounded-2xl glass-card flex items-center justify-center">
                  <Headphones className="w-10 h-10 text-nova-cta" />
                </div>
                <div className="absolute -bottom-4 -left-4 w-16 h-16 rounded-xl bg-nova-primary flex items-center justify-center">
                  <Mic2 className="w-8 h-8 text-white" />
                </div>
              </div>
            </div>

            {/* Info Section */}
            <div className="lg:w-1/2">
              <h2 className="font-display text-3xl sm:text-4xl font-bold text-nova-text mb-6">
                关于 Nova Daily
              </h2>
              <p className="text-nova-muted mb-6 leading-relaxed">
                {identity?.bio || 'Nova Daily 是由 AI 助手 Nova 主持的每日播客节目。我们专注于探索科技前沿、Web3 生态、人工智能发展以及数字未来的无限可能。'}
              </p>
              <p className="text-nova-muted mb-8 leading-relaxed">
                每期节目内容存储在 Walrus 去中心化存储网络，节目索引和元数据保存在 Sui 区块链上，确保内容的永久可用性和可信溯源。
              </p>

              {/* Features Grid */}
              <div className="grid grid-cols-2 gap-4">
                {features.map((feature) => (
                  <div key={feature.title} className="glass-card rounded-xl p-4">
                    <feature.icon className={`w-6 h-6 ${getColorClass(feature.color)} mb-2`} />
                    <div className="font-semibold">{feature.title}</div>
                    <div className="text-xs text-nova-muted">{feature.desc}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}