'use client';

import { useEffect, useState, useCallback } from 'react';
import { useCurrentAccount } from '@mysten/dapp-kit-react';
import { SuiClient, getFullnodeUrl } from '@mysten/sui/client';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { AudioPlayer } from '@/components/AudioPlayer';
import { EpisodeCard } from '@/components/EpisodeCard';
import { CONFIG, Episode, NovaIdentity } from '@/lib/config';
import { RefreshCw, AlertCircle, Mic, ChevronLeft, ChevronRight } from 'lucide-react';

const suiClient = new SuiClient({ url: getFullnodeUrl('testnet') });
const PAGE_SIZE = 12;

export default function EpisodesPage() {
  const currentAccount = useCurrentAccount();
  
  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [identity, setIdentity] = useState<NovaIdentity | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentEpisode, setCurrentEpisode] = useState<Episode | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalEpisodes, setTotalEpisodes] = useState(0);

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      await Promise.all([loadEpisodes(), loadIdentity()]);
    } catch (e) {
      setError('Failed to load data from blockchain');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  async function loadEpisodes() {
    const registry = await suiClient.getObject({
      id: CONFIG.registryId,
      options: { showContent: true },
    });

    if (!registry.data) {
      throw new Error('Registry not found');
    }

    const content = registry.data.content as any;
    const total = Number(content.fields.total_episodes);
    setTotalEpisodes(total);
    
    const idLookupContents = content.fields.id_lookup.fields.contents;
    const loadedEpisodes: Episode[] = [];
    
    // Load all episodes (newest first)
    for (let i = idLookupContents.length - 1; i >= 0; i--) {
      const entry = idLookupContents[i];
      const episodeId = entry.value;
      
      try {
        const episodeObj = await suiClient.getObject({
          id: episodeId,
          options: { showContent: true },
        });
        
        if (episodeObj.data) {
          const fields = (episodeObj.data.content as any).fields;
          
          let tags: string[] = [];
          try {
            const tagContents = fields.tags.fields.contents;
            tags = tagContents.map((t: any) => t.fields?.key || t);
          } catch (e) {
            tags = [];
          }
          
          loadedEpisodes.push({
            id: episodeObj.data.objectId,
            episodeId: Number(fields.episode_id),
            date: fields.date,
            title: fields.title,
            summary: fields.summary,
            blobId: fields.blob_id,
            tags,
            durationSecs: Number(fields.duration_secs),
            walrusUrl: CONFIG.walrusBaseUrl + fields.blob_id,
          });
        }
      } catch (e) {
        console.warn('Failed to load episode:', e);
      }
    }
    
    setEpisodes(loadedEpisodes);
  }

  async function loadIdentity() {
    const identity = await suiClient.getObject({
      id: CONFIG.identityId,
      options: { showContent: true },
    });
    
    if (identity.data) {
      const fields = (identity.data.content as any).fields;
      setIdentity({
        name: fields.name,
        bio: fields.bio,
        avatarBlobId: fields.avatar_blob_id,
        admin: fields.admin,
      });
    }
  }

  function playEpisode(episode: Episode) {
    setCurrentEpisode(episode);
    setIsPlaying(true);
  }

  // Pagination
  const totalPages = Math.ceil(episodes.length / PAGE_SIZE);
  const paginatedEpisodes = episodes.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  return (
    <div className="min-h-screen">
      <Navbar identity={identity} />
      
      <main className="pt-24 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-12 gap-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-nova-primary/50 flex items-center justify-center">
                <Mic className="w-7 h-7 text-nova-cta" />
              </div>
              <div>
                <h1 className="font-display text-3xl sm:text-4xl font-bold text-nova-text">
                  全部节目
                </h1>
                <p className="text-nova-muted mt-1">
                  共 {totalEpisodes} 期播客 · 存储于 Sui 区块链
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <a
                href="/"
                className="flex items-center gap-2 px-4 py-2 glass-card hover:bg-white/10 text-nova-text rounded-full text-sm font-medium transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
                返回首页
              </a>
              <button
                onClick={loadData}
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
            <div className="text-center py-20">
              <div className="inline-flex items-center gap-3 px-6 py-3 glass-card rounded-full">
                <RefreshCw className="w-5 h-5 animate-spin text-nova-cta" />
                <span className="text-nova-muted">正在从 Sui 区块链读取数据...</span>
              </div>
            </div>
          )}

          {/* Error State */}
          {error && !loading && (
            <div className="text-center py-20">
              <div className="inline-block p-6 glass-card rounded-2xl">
                <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
                <h3 className="font-semibold text-lg mb-2">获取数据失败</h3>
                <p className="text-nova-muted text-sm mb-4">{error}</p>
                <button
                  onClick={loadData}
                  className="px-4 py-2 bg-nova-cta hover:bg-orange-600 text-white rounded-full text-sm"
                >
                  重试
                </button>
              </div>
            </div>
          )}

          {/* Episodes Grid */}
          {!loading && !error && episodes.length > 0 && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {paginatedEpisodes.map((episode) => (
                  <EpisodeCard
                    key={episode.id}
                    episode={episode}
                    onPlay={() => playEpisode(episode)}
                  />
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-12">
                  <button
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="w-10 h-10 rounded-full glass-card hover:bg-white/10 flex items-center justify-center transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`w-10 h-10 rounded-full font-medium transition-colors ${
                        currentPage === page
                          ? 'bg-nova-cta text-white'
                          : 'glass-card hover:bg-white/10 text-nova-text'
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                  
                  <button
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    className="w-10 h-10 rounded-full glass-card hover:bg-white/10 flex items-center justify-center transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              )}
            </>
          )}

          {/* Empty State */}
          {!loading && !error && episodes.length === 0 && (
            <div className="text-center py-20">
              <div className="inline-block p-8 glass-card rounded-2xl">
                <Mic className="w-16 h-16 text-nova-muted mx-auto mb-4" />
                <h3 className="font-semibold text-xl mb-2">暂无节目</h3>
                <p className="text-nova-muted">还没有发布任何播客内容</p>
              </div>
            </div>
          )}
        </div>
      </main>
      
      <Footer />
      
      <AudioPlayer
        episode={currentEpisode}
        isPlaying={isPlaying}
        onClose={() => setIsPlaying(false)}
        onToggle={() => setIsPlaying(!isPlaying)}
      />
    </div>
  );
}
