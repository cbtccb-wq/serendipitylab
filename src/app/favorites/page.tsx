'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { InventionCard } from '@/components/InventionCard'
import type { FavoriteEntry } from '@/lib/storage'

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState<FavoriteEntry[]>([])
  const [loading, setLoading] = useState(true)

  function load() {
    fetch('/api/favorites')
      .then((r) => r.json())
      .then((data) => setFavorites(data))
      .finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  return (
    <main className="min-h-screen bg-lab-bg text-lab-text">
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(circle, rgba(0,255,170,0.06) 1px, transparent 1px)',
          backgroundSize: '28px 28px',
        }}
      />
      <div className="relative z-10 max-w-5xl mx-auto px-4 py-10 flex flex-col gap-6">
        <div>
          <Link href="/" className="text-xs font-mono text-lab-muted hover:text-lab-accent">
            ← トップへ
          </Link>
          <h1 className="text-2xl font-bold font-mono text-lab-text mt-2">
            お気に入り
            {favorites.length > 0 && (
              <span className="ml-2 text-sm text-lab-muted">({favorites.length}件)</span>
            )}
          </h1>
        </div>

        {loading && (
          <div className="text-lab-muted font-mono text-sm text-center py-20">読み込み中…</div>
        )}

        {!loading && favorites.length === 0 && (
          <div className="text-center py-20">
            <div className="text-4xl opacity-30 mb-3">★</div>
            <p className="text-lab-muted font-mono text-sm">
              お気に入りがありません
            </p>
            <p className="text-lab-muted/50 text-xs mt-1">
              発明カードの ☆ を押して保存してください
            </p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {favorites.map((fav, i) => (
            <div key={fav.id} className="flex flex-col gap-2">
              <InventionCard idea={fav.invention} index={i} initialFavorited={true} />
              <div className="text-xs text-lab-muted/50 font-mono px-1">
                保存日: {new Date(fav.savedAt).toLocaleDateString('ja-JP')}
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}
