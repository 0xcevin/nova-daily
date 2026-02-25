'use client';

import { RefreshCw, Play, ExternalLink, Mic, AlertCircle } from 'lucide-react';
import { Episode } from '@/lib/config';
import { PublishButton } from './PublishButton';

interface EpisodeListProps {
  episodes: Episode[];
  loading: boolean;
  error: string | null;
  onRefresh: () => void;
  onPlay: (episode: Episode) => void;
}

export function EpisodeList({ episodes, loading, error, onRefresh, onPlay }: EpisodeListProps) {
  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <section id="episodes" className="py-20 sm:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-12 gap-4">
          <div>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-nova-text mb-2">
              链上节目
            </h2>
            <p className="text-nova-muted">从 Sui 区块链实时读取的播客内容</p>
          </div>
          <div className="flex items-center gap-2">
            <PublishButton onSuccess={onRefresh} />
            <button
              onClick={onRefresh}
              disabled={loading}
              className="flex items-center gap-2 px-4 py-2 glass-card hover:bg-white/10 text-nova-text rounded-full text-sm font-medium transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              刷新
            </button>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <div className="inline-flex items-center gap-3 px-6 py-3 glass-card rounded-full">
              <RefreshCw className="w-5 h-5 animate-spin text-nova-cta" />
              <span className="text-nova-muted">正在从 Sui 区块链读取数据...</span>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="text-center py-12">
            <div className="inline-block p-6 glass-card rounded-2xl">
              <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
              <h3 className="font-semibold text-lg mb-2">获取数据失败</h3>
              <p className="text-nova-muted text-sm mb-4">{error}</p>
              <button
                onClick={onRefresh}
                className="px-4 py-2 bg-nova-cta hover:bg-orange-600 text-white rounded-full text-sm"
              >
                重试
              </button>
            </div>
          </div>
        )}

        {/* Featured Episode */}
        {!loading && !error && episodes.length > 0 && (
          <>
            <div className="glass-card rounded-3xl p-6 sm:p-8 mb-8">
              <div className="flex flex-col lg:flex-row gap-8">
                <div className="lg:w-1/3">
                  <div className="relative aspect-square rounded-2xl overflow-hidden bg-gradient-to-br from-nova-primary to-nova-secondary">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Mic className="w-20 h-20 text-white/30" />
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <div className="absolute bottom-4 left-4 right-4">
                      <span className="inline-block px-3 py-1 bg-nova-cta text-white text-xs font-semibold rounded-full mb-2">
                        最新
                      </span>
                      <div className="text-white/80 text-sm font-mono">
                        EP.{episodes[0].episodeId + 1}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="lg:w-2/3 flex flex-col justify-center">
                  <div className="flex items-center gap-3 mb-4 flex-wrap">
                    <span className="text-nova-cta text-sm font-medium">{episodes[0].date}</span>
                    <span className="w-1 h-1 rounded-full bg-nova-muted" />
                    <span className="text-nova-muted text-sm">{formatDuration(episodes[0].durationSecs)}</span>
                    <span className="w-1 h-1 rounded-full bg-nova-muted" />
                    <a
                      href={`https://suiscan.xyz/testnet/object/${episodes[0].id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-nova-muted hover:text-nova-cta font-mono"
                    >
                      查看对象
                    </a>
                  </div>
                  <h3 className="font-display text-2xl sm:text-3xl font-bold text-nova-text mb-4">
                    {episodes[0].title}
                  </h3>
                  <p className="text-nova-muted mb-6 leading-relaxed">
                    {episodes[0].summary}
                  </p>
                  <div className="flex flex-wrap items-center gap-2 mb-6">
                    {episodes[0].tags.map((tag) => (
                      <span key={tag} className="px-3 py-1 glass-card rounded-full text-xs text-nova-muted">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => onPlay(episodes[0])}
                      className="flex items-center gap-2 px-6 py-3 bg-nova-cta hover:bg-orange-600 text-white rounded-full font-semibold transition-all duration-200 hover:scale-105"
                    >
                      <Play className="w-5 h-5 fill-current" />
                      播放
                    </button>
                    <a
                      href={episodes[0].walrusUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-6 py-3 glass-card hover:bg-white/10 text-nova-text rounded-full font-semibold transition-all duration-200"
                    >
                      <ExternalLink className="w-5 h-5" />
                      Walrus
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Episode Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {episodes.slice(1).map((episode) => (
                <div key={episode.id} className="glass-card rounded-2xl p-5 hover:-translate-y-1 hover:shadow-xl hover:shadow-orange-500/10 transition-all duration-300">
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 rounded-xl bg-nova-primary/50 flex items-center justify-center">
                      <Mic className="w-6 h-6 text-nova-cta" />
                    </div>
                    <span className="text-nova-muted text-sm">EP.{episode.episodeId + 1}</span>
                  </div>
                  <h4 className="font-display text-lg font-bold text-nova-text mb-2 line-clamp-2">
                    {episode.title}
                  </h4>
                  <p className="text-nova-muted text-sm mb-4 line-clamp-2">
                    {episode.summary}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-nova-muted text-xs">{formatDuration(episode.durationSecs)}</span>
                    <button
                      onClick={() => onPlay(episode)}
                      className="w-10 h-10 rounded-full glass-card hover:bg-nova-cta hover:text-white flex items-center justify-center transition-all duration-200"
                    >
                      <Play className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
}