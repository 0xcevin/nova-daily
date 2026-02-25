'use client';

import { Play, List, Activity } from 'lucide-react';

interface HeroProps {
  episodeCount: number;
  onPlayLatest: () => void;
}

export function Hero({ episodeCount, onPlayLatest }: HeroProps) {
  return (
    <section className="relative min-h-screen flex items-center justify-center pt-16 overflow-hidden">
      {/* Background glow */}
      <div className="absolute w-[600px] h-[600px] bg-nova-cta/15 rounded-full blur-3xl top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
      
      {/* Gradient orbs */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-nova-primary/30 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-nova-secondary/20 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Audio wave badge */}
        <div className="flex justify-center mb-8">
          <div className="glass-card px-6 py-4 flex items-center gap-4">
            <div className="flex items-center gap-1 h-6">
              {[2, 4, 6, 3, 5].map((h, i) => (
                <span
                  key={i}
                  className="w-1 bg-gradient-to-t from-nova-cta to-yellow-400 rounded-sm"
                  style={{
                    height: `${h * 4}px`,
                    animation: `wave 1.2s ease-in-out infinite`,
                    animationDelay: `${i * 0.1}s`,
                  }}
                />
              ))}
            </div>
            <span className="text-nova-cta font-medium text-sm">Sui dApp</span>
          </div>
        </div>

        {/* Title */}
        <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
          <span className="gradient-text">去中心化</span>
          <br />
          <span className="text-nova-text">每日播客</span>
        </h1>

        {/* Description */}
        <p className="text-nova-muted text-lg sm:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
          基于 <span className="text-nova-cta">Sui</span> 区块链的播客 dApp
          <br />
          内容存储在 Walrus，永久可用、可信溯源
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
          <button
            onClick={onPlayLatest}
            className="flex items-center gap-3 px-8 py-4 bg-nova-cta hover:bg-orange-600 text-white rounded-full font-semibold text-lg transition-all duration-200 hover:scale-105 hover:shadow-lg hover:shadow-orange-500/25 w-full sm:w-auto justify-center"
          >
            <Play className="w-5 h-5 fill-current" />
            收听最新
          </button>
          <a
            href="#episodes"
            className="flex items-center gap-3 px-8 py-4 glass-card hover:bg-white/10 text-nova-text rounded-full font-semibold text-lg transition-all duration-200 w-full sm:w-auto justify-center"
          >
            <List className="w-5 h-5" />
            浏览节目
          </a>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-2xl mx-auto">
          <div className="glass-card p-4">
            <div className="font-display text-2xl sm:text-3xl font-bold text-nova-text">
              {episodeCount > 0 ? episodeCount : '-'}
            </div>
            <div className="text-nova-muted text-xs mt-1">期节目</div>
          </div>
          <div className="glass-card p-4">
            <div className="font-display text-2xl sm:text-3xl font-bold text-nova-text">
              Testnet
            </div>
            <div className="text-nova-muted text-xs mt-1">网络</div>
          </div>
          <div className="glass-card p-4">
            <div className="font-display text-2xl sm:text-3xl font-bold text-nova-text">
              Walrus
            </div>
            <div className="text-nova-muted text-xs mt-1">存储</div>
          </div>
          <div className="glass-card p-4">
            <div className="font-display text-2xl sm:text-3xl font-bold text-nova-text flex items-center justify-center gap-2">
              <Activity className="w-6 h-6 text-green-400" />
            </div>
            <div className="text-nova-muted text-xs mt-1">实时</div>
          </div>
        </div>
      </div>
    </section>
  );
}