'use client';

import { useState } from 'react';
import { useCurrentAccount, useSignAndExecuteTransaction } from '@mysten/dapp-kit-react';
import { Transaction } from '@mysten/sui/transactions';
import { Plus, Loader2 } from 'lucide-react';
import { CONFIG } from '@/lib/config';
import { dAppKit } from '@/lib/dapp-kit';

interface PublishButtonProps {
  onSuccess?: () => void;
}

export function PublishButton({ onSuccess }: PublishButtonProps) {
  const currentAccount = useCurrentAccount();
  const [isPublishing, setIsPublishing] = useState(false);
  const [showForm, setShowForm] = useState(false);
  
  const [formData, setFormData] = useState({
    date: '2026-02-25',
    title: 'Nova Daily #2',
    summary: 'Test episode for Walrus storage',
    blobId: 'U0ue7_YssVF0sN6mipZW7wSz8nuh2x2bZgz--ldE3gE',
    tags: 'Walrus,Test,Audio',
    duration: '14',
  });

  async function handlePublish() {
    if (!currentAccount) {
      alert('Please connect your wallet first');
      return;
    }

    setIsPublishing(true);

    try {
      const tx = new Transaction();
      
      const tags = formData.tags.split(',').map(t => t.trim()).filter(Boolean);
      
      tx.moveCall({
        target: `${CONFIG.packageId}::nova_daily::publish_episode`,
        arguments: [
          tx.object(CONFIG.registryId),
          tx.object(CONFIG.identityId),
          tx.pure.string(formData.date),
          tx.pure.string(formData.title),
          tx.pure.string(formData.summary),
          tx.pure.string(formData.blobId),
          tx.pure.vector('string', tags),
          tx.pure.u64(parseInt(formData.duration)),
        ],
      });

      const result = await dAppKit.signAndExecuteTransaction({
        transaction: tx,
      });

      if (result && 'digest' in result) {
        alert(`Episode published! Transaction: ${result.digest}`);
        setShowForm(false);
        onSuccess?.();
      }
    } catch (error) {
      console.error('Failed to publish:', error);
      alert('Failed to publish episode. Check console for details.');
    } finally {
      setIsPublishing(false);
    }
  }

  if (!currentAccount) {
    return null;
  }

  return (
    <>
      <button
        onClick={() => setShowForm(true)}
        className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-full text-sm font-medium transition-colors"
      >
        <Plus className="w-4 h-4" />
        发布节目
      </button>

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="glass-card rounded-2xl p-6 w-full max-w-lg max-h-[90vh] overflow-auto">
            <h3 className="font-display text-xl font-bold mb-4">发布新节目</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-nova-muted mb-1">日期</label>
                <input
                  type="text"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-nova-text focus:outline-none focus:border-nova-cta"
                />
              </div>
              
              <div>
                <label className="block text-sm text-nova-muted mb-1">标题</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-nova-text focus:outline-none focus:border-nova-cta"
                />
              </div>
              
              <div>
                <label className="block text-sm text-nova-muted mb-1">摘要</label>
                <textarea
                  value={formData.summary}
                  onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-nova-text focus:outline-none focus:border-nova-cta"
                />
              </div>
              
              <div>
                <label className="block text-sm text-nova-muted mb-1">Walrus Blob ID</label>
                <input
                  type="text"
                  value={formData.blobId}
                  onChange={(e) => setFormData({ ...formData, blobId: e.target.value })}
                  className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-nova-text font-mono text-sm focus:outline-none focus:border-nova-cta"
                />
              </div>
              
              <div>
                <label className="block text-sm text-nova-muted mb-1">标签 (逗号分隔)</label>
                <input
                  type="text"
                  value={formData.tags}
                  onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                  className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-nova-text focus:outline-none focus:border-nova-cta"
                />
              </div>
              
              <div>
                <label className="block text-sm text-nova-muted mb-1">时长 (秒)</label>
                <input
                  type="number"
                  value={formData.duration}
                  onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                  className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-nova-text focus:outline-none focus:border-nova-cta"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowForm(false)}
                className="flex-1 px-4 py-2 glass-card hover:bg-white/10 rounded-lg font-medium transition-colors"
              >
                取消
              </button>
              <button
                onClick={handlePublish}
                disabled={isPublishing}
                className="flex-1 px-4 py-2 bg-nova-cta hover:bg-orange-600 disabled:opacity-50 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
              >
                {isPublishing ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    发布中...
                  </>
                ) : (
                  '发布'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}