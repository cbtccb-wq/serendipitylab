'use client'

import type { Mode } from '@/types'

interface ModeSelectorProps {
  value: Mode
  onChange: (mode: Mode) => void
}

const MODES: { mode: Mode; desc: string; color: string }[] = [
  { mode: '真面目発明', desc: '実現可能・実用寄り', color: 'border-emerald-500 text-emerald-400' },
  { mode: '変な発明', desc: '異常な組み合わせ優先', color: 'border-purple-500 text-purple-400' },
  { mode: '創作ドリブン', desc: '世界観・物語性重視', color: 'border-sky-500 text-sky-400' },
  { mode: 'カリスモード', desc: '行為優先・衝撃重視', color: 'border-amber-500 text-amber-400' },
]

export function ModeSelector({ value, onChange }: ModeSelectorProps) {
  return (
    <div className="flex flex-col gap-2">
      <span className="text-xs font-mono text-lab-accent uppercase tracking-widest">発明モード</span>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        {MODES.map(({ mode, desc, color }) => {
          const active = value === mode
          return (
            <button
              key={mode}
              onClick={() => onChange(mode)}
              className={`
                rounded border px-3 py-2 text-left transition-all duration-150
                ${active
                  ? `${color} bg-lab-surface/80`
                  : 'border-lab-border text-lab-muted hover:border-lab-muted'
                }
              `}
            >
              <div className="font-mono text-sm font-bold">{mode}</div>
              <div className="text-xs opacity-70">{desc}</div>
            </button>
          )
        })}
      </div>
    </div>
  )
}
