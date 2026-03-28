'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { InventionCard } from '@/components/InventionCard'
import type { HistoryEntry } from '@/lib/storage'

export default function HistoryPage() {
  const [history, setHistory] = useState<HistoryEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [expanded, setExpanded] = useState<string | null>(null)

  useEffect(() => {
    fetch('/api/history')
      .then((r) => r.json())
      .then((data) => setHistory(data))
      .finally(() => setLoading(false))
  }, [])

  async function handleClear() {
    if (!confirm('履歴を全件削除しますか？')) return
    await fetch('/api/history', { method: 'DELETE' })
    setHistory([])
  }

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
        <div className="flex items-center justify-between">
          <div>
            <Link href="/" className="text-xs font-mono text-lab-muted hover:text-lab-accent">
              ← トップへ
            </Link>
            <h1 className="text-2xl font-bold font-mono text-lab-text mt-2">生成履歴</h1>
          </div>
          {history.length > 0 && (
            <button
              onClick={handleClear}
              className="text-xs font-mono text-red-400/60 hover:text-red-400 border border-red-900/30 hover:border-red-400/50 rounded px-3 py-1.5 transition-all"
            >
              全件削除
            </button>
          )}
        </div>

        {loading && (
          <div className="text-lab-muted font-mono text-sm text-center py-20">読み込み中…</div>
        )}

        {!loading && history.length === 0 && (
          <div className="text-center py-20">
            <div className="text-4xl opacity-30 mb-3">📜</div>
            <p className="text-lab-muted font-mono text-sm">まだ履歴がありません</p>
          </div>
        )}

        <div className="flex flex-col gap-4">
          {history.map((entry) => (
            <div key={entry.id} className="border border-lab-border rounded-lg bg-lab-surface/60">
              {/* Entry header */}
              <button
                onClick={() => setExpanded(expanded === entry.id ? null : entry.id)}
                className="w-full text-left px-4 py-3 flex items-center justify-between gap-4"
              >
                <div className="flex flex-col gap-0.5">
                  <div className="flex gap-2 flex-wrap">
                    {entry.concepts.map((c) => (
                      <span key={c} className="px-2 py-0.5 rounded-full border border-lab-border text-xs font-mono text-lab-muted">
                        {c}
                      </span>
                    ))}
                    <span className="px-2 py-0.5 rounded text-xs font-mono text-purple-400/70 border border-purple-900/30">
                      {entry.mode}
                    </span>
                  </div>
                  <span className="text-xs text-lab-muted/60">
                    {new Date(entry.createdAt).toLocaleString('ja-JP')} · {entry.inventions.length}件
                  </span>
                </div>
                <span className="text-lab-muted text-sm">{expanded === entry.id ? '▲' : '▼'}</span>
              </button>

              {/* Expanded inventions */}
              {expanded === entry.id && (
                <div className="border-t border-lab-border p-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                  {entry.inventions.map((inv, i) => (
                    <InventionCard key={inv.id} idea={inv} index={i} />
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}
