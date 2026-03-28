'use client'

import type { InventionIdea } from '@/types'

interface ScoreBarProps {
  label: string
  value: number
  color: string
}

function ScoreBar({ label, value, color }: ScoreBarProps) {
  return (
    <div className="flex items-center gap-2">
      <span className="w-16 text-xs font-mono text-lab-muted">{label}</span>
      <div className="flex-1 h-1.5 bg-lab-border rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-500 ${color}`}
          style={{ width: `${(value / 5) * 100}%` }}
        />
      </div>
      <span className="w-4 text-xs font-mono text-lab-muted text-right">{value}</span>
    </div>
  )
}

const PATTERN_LABEL: Record<string, string> = {
  機能移植: '🔧 機能移植',
  状態連動: '⚡ 状態連動',
  目的転流: '🎯 目的転流',
  物理化: '🧪 物理化',
  本人化: '🐾 本人化',
  取引化: '💱 取引化',
  制約追加: '🔒 制約追加',
  反転: '🔄 反転',
}

interface InventionCardProps {
  idea: InventionIdea
  index: number
}

export function InventionCard({ idea, index }: InventionCardProps) {
  return (
    <div className="
      rounded-lg border border-lab-border bg-lab-surface
      p-5 flex flex-col gap-4
      hover:border-lab-accent/40 transition-colors duration-200
    ">
      {/* Header */}
      <div className="flex items-start justify-between gap-2">
        <div>
          <div className="text-xs font-mono text-lab-muted mb-1">
            #{String(index + 1).padStart(2, '0')} {PATTERN_LABEL[idea.pattern] ?? idea.pattern}
          </div>
          <h3 className="text-lg font-bold font-mono text-lab-text leading-snug">
            {idea.title}
          </h3>
          <p className="text-sm text-lab-accent/80 italic mt-0.5">「{idea.catchcopy}」</p>
        </div>
      </div>

      {/* Source concepts */}
      <div className="flex gap-2 flex-wrap">
        {idea.sourceConcepts.map((c) => (
          <span
            key={c}
            className="px-2 py-0.5 rounded-full border border-lab-border text-xs font-mono text-lab-muted"
          >
            {c}
          </span>
        ))}
      </div>

      {/* Description */}
      <p className="text-sm text-lab-text/80 leading-relaxed">{idea.description}</p>

      {/* Problem & Target */}
      <div className="grid grid-cols-1 gap-2 text-xs">
        <div>
          <span className="text-lab-accent/60 font-mono">解決する課題 / </span>
          <span className="text-lab-text/70">{idea.problemSolved}</span>
        </div>
        <div>
          <span className="text-lab-accent/60 font-mono">想定ユーザー / </span>
          <span className="text-lab-text/70">{idea.targetUsers}</span>
        </div>
      </div>

      {/* Scores */}
      <div className="flex flex-col gap-1.5 pt-2 border-t border-lab-border">
        <ScoreBar label="novelty" value={idea.scores.novelty} color="bg-cyan-400" />
        <ScoreBar label="weird" value={idea.scores.weirdness} color="bg-purple-400" />
        <ScoreBar label="feasible" value={idea.scores.feasibility} color="bg-emerald-400" />
        <ScoreBar label="useful" value={idea.scores.usefulness} color="bg-amber-400" />
      </div>
    </div>
  )
}
