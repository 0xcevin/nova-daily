'use client';

import { Play, Pause, SkipBack, SkipForward, ExternalLink, X } from 'lucide-react';
import { Episode } from '@/lib/config';

interface AudioPlayerProps {
  episode: Episode | null;
  isPlaying: boolean;
  onClose: () => void;
  onToggle: () => void;
}

export function AudioPlayer({ episode, isPlaying, onClose, onToggle }: AudioPlayerProps) {
  if (!episode) return null;

  return (
    <div
      className={`fixed bottom-0 left-0 right-0 glass-nav border-t border-white/10 z-30 transition-transform duration-300 ${
        isPlaying ? 'translate-y-0' : 'translate-y-full'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex items-center justify-between gap-4">
          {/* Track Info */}
          <div className="flex items-center gap-4 min-w-0">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-nova-primary to-nova-secondary flex items-center justify-center shrink-0">
              <span className="text-white/60 text-xs font-bold">
                EP.{episode.episodeId + 1}
              </span>
            </div>
            <div className="min-w-0">
              <div className="font-medium text-nova-text text-sm truncate">
                {episode.title}
              </div>
              <div className="text-nova-muted text-xs">
                EP.{episode.episodeId + 1} • {episode.date}
              </div>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => {}}
              className="text-nova-muted hover:text-nova-text transition-colors"
            >
              <SkipBack className="w-5 h-5" />
            </button>
            <button
              onClick={onToggle}
              className="w-10 h-10 rounded-full bg-nova-cta hover:bg-orange-600 flex items-center justify-center text-white transition-all duration-200 hover:scale-105"
            >
              {isPlaying ? (
                <Pause className="w-5 h-5 fill-current" />
              ) : (
                <Play className="w-5 h-5 fill-current" />
              )}
            </button>
            <button
              onClick={() => {}}
              className="text-nova-muted hover:text-nova-text transition-colors"
            >
              <SkipForward className="w-5 h-5" />
            </button>
          </div>

          {/* Progress & Actions */}
          <div className="hidden sm:flex items-center gap-3 flex-1 max-w-xs">
            <span className="text-nova-muted text-xs">0:00</span>
            <div className="flex-1 h-1 bg-white/10 rounded-full overflow-hidden">
              <div className="h-full bg-nova-cta rounded-full" style={{ width: '0%' }} />
            </div>
            <span className="text-nova-muted text-xs">
              {Math.floor(episode.durationSecs / 60)}:
              {(episode.durationSecs % 60).toString().padStart(2, '0')}
            </span>
          </div>

          {/* External & Close */}
          <div className="flex items-center gap-2 shrink-0">
            <a
              href={episode.walrusUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-nova-muted hover:text-nova-cta transition-colors"
            >
              <ExternalLink className="w-5 h-5" />
            </a>
            <button
              onClick={onClose}
              className="text-nova-muted hover:text-nova-text transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}