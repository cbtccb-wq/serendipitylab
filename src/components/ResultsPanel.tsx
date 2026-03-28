'use client'

import type { InventionIdea } from '@/types'
import { InventionCard } from './InventionCard'

interface ResultsPanelProps {
  inventions: InventionIdea[] | null
  isLoading: boolean
}

export function ResultsPanel({ inventions, isLoading }: ResultsPanelProps) {
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <div className="flex gap-2">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-3 h-3 rounded-full bg-lab-accent animate-bounce"
              style={{ animationDelay: `${i * 0.15}s` }}
            />
          ))}
        </div>
        <span className="text-lab-muted font-mono text-sm tracking-widest">
          概念衝突実験中…
        </span>
      </div>
    )
  }

  if (!inventions) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-3 text-center">
        <div className="text-4xl opacity-30">⚗️</div>
        <p className="text-lab-muted font-mono text-sm">
          概念を入力して発明を生成してください
        </p>
        <p className="text-lab-muted/50 text-xs">
          または「ランダム」で宇宙の意志に委ねる
        </p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {inventions.map((idea, i) => (
        <InventionCard key={idea.id} idea={idea} index={i} />
      ))}
    </div>
  )
}
