'use client';

import { useEffect, useState } from 'react';
import { useCurrentAccount, useSuiClient } from '@mysten/dapp-kit';
import { Navbar } from '@/components/Navbar';
import { Hero } from '@/components/Hero';
import { EpisodeList } from '@/components/EpisodeList';
import { ContractInfo } from '@/components/ContractInfo';
import { About } from '@/components/About';
import { Footer } from '@/components/Footer';
import { AudioPlayer } from '@/components/AudioPlayer';
import { CONFIG, Episode, NovaIdentity } from '@/lib/config';

export default function Home() {
  const suiClient = useSuiClient();
  const currentAccount = useCurrentAccount();
  
  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [identity, setIdentity] = useState<NovaIdentity | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentEpisode, setCurrentEpisode] = useState<Episode | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setLoading(true);
    setError(null);
    
    try {
      await Promise.all([loadEpisodes(), loadIdentity()]);
    } catch (e) {
      setError('Failed to load data from blockchain');
    } finally {
      setLoading(false);
    }
  }

  async function loadEpisodes() {
    const registry = await suiClient.getObject({
      id: CONFIG.registryId,
      options: { showContent: true },
    });

    if (!registry.data) {
      throw new Error('Registry not found');
    }

    const content = registry.data.content as any;
    const totalEpisodes = Number(content.fields.total_episodes);
    const idLookupContents = content.fields.id_lookup.fields.contents;

    const loadedEpisodes: Episode[] = [];
    
    for (let i = idLookupContents.length - 1; i >= 0 && loadedEpisodes.length < 6; i--) {
      const entry = idLookupContents[i];
      const episodeId = entry.value;
      
      try {
        const episodeObj = await suiClient.getObject({
          id: episodeId,
          options: { showContent: true },
        });
        
        if (episodeObj.data) {
          const fields = (episodeObj.data.content as any).fields;
          
          // Parse tags
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

  return (
    <div className="min-h-screen">
      <Navbar identity={identity} currentAccount={currentAccount} />
      
      <main>
        <Hero 
          episodeCount={episodes.length} 
          onPlayLatest={() => episodes.length > 0 && playEpisode(episodes[0])}
        />
        
        <EpisodeList
          episodes={episodes}
          loading={loading}
          error={error}
          onRefresh={loadData}
          onPlay={playEpisode}
        />
        
        <ContractInfo />
        
        <About identity={identity} />
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