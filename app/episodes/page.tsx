import dynamic from 'next/dynamic';
import { Suspense } from 'react';

const EpisodesPageClient = dynamic(() => import('./EpisodesPage'), {
  ssr: false,
  loading: () => (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="text-white text-lg">Loading...</div>
    </div>
  ),
});

export default function EpisodesPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-lg">Loading...</div>
      </div>
    }>
      <EpisodesPageClient />
    </Suspense>
  );
}
