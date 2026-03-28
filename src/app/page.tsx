'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ConceptInput } from '@/components/ConceptInput'
import { ModeSelector } from '@/components/ModeSelector'
import { ResultsPanel } from '@/components/ResultsPanel'
import type { GenerateResponse, InventionIdea, Mode } from '@/types'

export default function HomePage() {
  const [conceptA, setConceptA] = useState('')
  const [conceptB, setConceptB] = useState('')
  const [conceptC, setConceptC] = useState('')
  const [showThird, setShowThird] = useState(false)
  const [mode, setMode] = useState<Mode>('真面目発明')
  const [inventions, setInventions] = useState<InventionIdea[] | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [generating, setGenerating] = useState(false)

  async function handleGenerate(random = false) {
    setIsLoading(true)
    setGenerating(true)
    setError(null)

    try {
      const concepts = random
        ? []
        : showThird
        ? [conceptA, conceptB, conceptC].filter(Boolean)
        : [conceptA, conceptB].filter(Boolean)

      if (!random && concepts.length < 2) {
        setError('概念を2つ以上入力してください')
        return
      }

      const res = await fetch('/api/inventions/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(random ? { random: true, mode, concepts: [] } : { concepts, mode }),
      })

      if (!res.ok) {
        const data = await res.json()
        setError(data.error ?? '生成に失敗しました')
        return
      }

      const data: GenerateResponse = await res.json()
      setInventions(data.inventions)

      // Save to history (fire-and-forget)
      fetch('/api/history', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ concepts, mode, inventions: data.inventions }),
      }).catch(() => {})
    } catch {
      setError('通信エラーが発生しました')
    } finally {
      setIsLoading(false)
      setTimeout(() => setGenerating(false), 600)
    }
  }

  return (
    <main className="min-h-screen bg-lab-bg text-lab-text">
      {/* Dot grid background */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(circle, rgba(0,255,170,0.06) 1px, transparent 1px)',
          backgroundSize: '28px 28px',
        }}
      />

      <div className="relative z-10 max-w-5xl mx-auto px-4 py-10 flex flex-col gap-8">
        {/* Header */}
        <header className="flex flex-col items-center gap-2">
          <h1 className="text-4xl font-bold font-mono text-lab-accent tracking-tight">
            SerendipityLab
          </h1>
          <p className="text-lab-muted font-mono text-sm tracking-widest">
            — 概念衝突型発明ジェネレーター —
          </p>
          {/* Nav */}
          <nav className="flex gap-4 mt-1">
            <Link href="/history" className="text-xs font-mono text-lab-muted hover:text-lab-accent transition-colors">
              📜 履歴
            </Link>
            <Link href="/favorites" className="text-xs font-mono text-lab-muted hover:text-amber-400 transition-colors">
              ★ お気に入り
            </Link>
            <Link href="/concepts" className="text-xs font-mono text-lab-muted hover:text-lab-accent transition-colors">
              ＋ 概念追加
            </Link>
          </nav>
        </header>

        {/* Input area */}
        <section className={`
          bg-lab-surface/60 border rounded-xl p-6 flex flex-col gap-5
          transition-all duration-300
          ${generating ? 'border-lab-accent/60 shadow-[0_0_20px_rgba(0,255,170,0.1)]' : 'border-lab-border'}
        `}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <ConceptInput
              label="概念 A"
              value={conceptA}
              onChange={setConceptA}
              placeholder="例: サウナ"
            />
            <ConceptInput
              label="概念 B"
              value={conceptB}
              onChange={setConceptB}
              placeholder="例: 株式"
            />
          </div>

          {showThird && (
            <ConceptInput
              label="概念 C (任意)"
              value={conceptC}
              onChange={setConceptC}
              placeholder="例: 記憶"
            />
          )}

          <button
            onClick={() => setShowThird((v) => !v)}
            className="text-xs font-mono text-lab-muted hover:text-lab-accent transition-colors w-fit"
          >
            {showThird ? '− 3つ目の概念を削除' : '+ 3つ目の概念を追加'}
          </button>

          <ModeSelector value={mode} onChange={setMode} />

          {error && (
            <p className="text-red-400 text-sm font-mono bg-red-950/30 border border-red-900/50 rounded px-3 py-2">
              {error}
            </p>
          )}

          <div className="flex gap-3">
            <button
              onClick={() => handleGenerate(false)}
              disabled={isLoading}
              className="
                flex-1 py-3 rounded font-mono font-bold text-sm
                bg-lab-accent text-lab-bg
                hover:brightness-110 active:brightness-90
                disabled:opacity-50 disabled:cursor-not-allowed
                transition-all duration-150
              "
            >
              {isLoading ? '実験中…' : '⚗ 発明する'}
            </button>
            <button
              onClick={() => handleGenerate(true)}
              disabled={isLoading}
              className="
                px-5 py-3 rounded font-mono text-sm
                border border-lab-border text-lab-muted
                hover:border-lab-accent hover:text-lab-accent
                disabled:opacity-50 disabled:cursor-not-allowed
                transition-all duration-150
              "
            >
              🎲 ランダム
            </button>
          </div>
        </section>

        {/* Results */}
        <section>
          <ResultsPanel inventions={inventions} isLoading={isLoading} />
        </section>
      </div>
    </main>
  )
}
