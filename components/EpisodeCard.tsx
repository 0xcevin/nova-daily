'use client';

import { Play, ExternalLink } from 'lucide-react';
import { Episode } from '@/lib/config';

interface EpisodeCardProps {
  episode: Episode;
  onPlay: () => void;
  featured?: boolean;
}

export function EpisodeCard({ episode, onPlay, featured = false }: EpisodeCardProps) {
  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (featured) {
    return (
      <div className="glass-card rounded-2xl p-5 hover:-translate-y-1 hover:shadow-xl hover:shadow-orange-500/10 transition-all duration-300">
        <div className="flex items-start justify-between mb-4">
          <span className="px-2 py-1 bg-nova-cta/20 text-nova-cta text-xs font-semibold rounded-full">
            EP.{episode.episodeId + 1}
          </span>
          <span className="text-nova-muted text-xs">{formatDuration(episode.durationSecs)}</span>
        </div>
        <h4 className="font-display text-lg font-bold text-nova-text mb-2 line-clamp-2">
          {episode.title}
        </h4>
        <p className="text-nova-muted text-sm mb-4 line-clamp-2">
          {episode.summary}
        </p>
        <div className="flex items-center justify-between">
          <span className="text-nova-muted text-xs">{episode.date}</span>
          <div className="flex items-center gap-2">
            <a
              href={`https://suiscan.xyz/testnet/object/${episode.id}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-8 h-8 rounded-full glass-card hover:bg-white/10 flex items-center justify-center transition-colors"
              title="查看链上对象"
            >
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
            <button
              onClick={onPlay}
              className="w-8 h-8 rounded-full bg-nova-cta hover:bg-orange-600 text-white flex items-center justify-center transition-colors"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="glass-card rounded-2xl p-5 hover:-translate-y-1 hover:shadow-xl hover:shadow-orange-500/10 transition-all duration-300 group">
      <div className="flex items-start justify-between mb-4">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-nova-primary to-nova-secondary flex items-center justify-center">
          <span className="text-white font-bold text-sm">EP.{episode.episodeId + 1}</span>
        </div>
        <button
          onClick={onPlay}
          className="w-10 h-10 rounded-full glass-card group-hover:bg-nova-cta group-hover:text-white flex items-center justify-center transition-all duration-200"
        >
          <Play className="w-4 h-4 fill-current" />
        </button>
      </div>
      
      <h4 className="font-display text-lg font-bold text-nova-text mb-2 line-clamp-2">
        {episode.title}
      </h4>
      
      <p className="text-nova-muted text-sm mb-4 line-clamp-2">
        {episode.summary}
      </p>
      
      <div className="flex flex-wrap items-center gap-2 mb-3">
        {episode.tags.slice(0, 3).map((tag) => (
          <span key={tag} className="px-2 py-0.5 bg-white/5 rounded-full text-xs text-nova-muted">
            {tag}
          </span>
        ))}
      </div>
      
      <div className="flex items-center justify-between pt-3 border-t border-white/5">
        <span className="text-nova-muted text-xs">{episode.date}</span>
        <div className="flex items-center gap-3">
          <span className="text-nova-muted text-xs">{formatDuration(episode.durationSecs)}</span>
          <a
            href={`https://suiscan.xyz/testnet/object/${episode.id}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-nova-muted hover:text-nova-cta transition-colors"
            title="SuiScan"
          >
            链上
          </a>
          <a
            href={episode.walrusUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-nova-muted hover:text-nova-cta transition-colors"
            title="Walrus"
          >
            Walrus
          </a>
        </div>
      </div>
    </div>
  );
}
