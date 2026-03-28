'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

interface ConceptsData {
  builtin: string[]
  user: string[]
  all: string[]
}

export default function ConceptsPage() {
  const [data, setData] = useState<ConceptsData | null>(null)
  const [input, setInput] = useState('')
  const [adding, setAdding] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const [filter, setFilter] = useState('')

  function load() {
    fetch('/api/concepts').then((r) => r.json()).then(setData)
  }

  useEffect(() => { load() }, [])

  async function handleAdd() {
    const name = input.trim()
    if (!name) return
    setAdding(true)
    setMessage(null)
    try {
      const res = await fetch('/api/concepts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name }),
      })
      if (res.ok) {
        setMessage(`「${name}」を追加しました`)
        setInput('')
        load()
      } else {
        const d = await res.json()
        setMessage(d.error ?? 'エラーが発生しました')
      }
    } finally {
      setAdding(false)
    }
  }

  const filtered = (data?.all ?? []).filter((c) =>
    c.toLowerCase().includes(filter.toLowerCase())
  )

  return (
    <main className="min-h-screen bg-lab-bg text-lab-text">
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(circle, rgba(0,255,170,0.06) 1px, transparent 1px)',
          backgroundSize: '28px 28px',
        }}
      />
      <div className="relative z-10 max-w-3xl mx-auto px-4 py-10 flex flex-col gap-6">
        <div>
          <Link href="/" className="text-xs font-mono text-lab-muted hover:text-lab-accent">
            ← トップへ
          </Link>
          <h1 className="text-2xl font-bold font-mono text-lab-text mt-2">概念辞書</h1>
          <p className="text-xs text-lab-muted/60 mt-1">
            組み込み: {data?.builtin.length ?? 0}件 ／ ユーザー追加: {data?.user.length ?? 0}件
          </p>
        </div>

        {/* Add form */}
        <div className="bg-lab-surface/60 border border-lab-border rounded-xl p-5 flex flex-col gap-3">
          <span className="text-xs font-mono text-lab-accent uppercase tracking-widest">概念を追加</span>
          <div className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
              placeholder="新しい概念（例: 量子、焚き火、裁判所…）"
              className="
                flex-1 bg-lab-surface border border-lab-border rounded
                px-4 py-2 text-lab-text font-mono text-sm
                placeholder:text-lab-muted
                focus:outline-none focus:border-lab-accent
              "
            />
            <button
              onClick={handleAdd}
              disabled={adding || !input.trim()}
              className="
                px-4 py-2 rounded font-mono text-sm
                bg-lab-accent text-lab-bg font-bold
                hover:brightness-110 disabled:opacity-40
                transition-all duration-150
              "
            >
              追加
            </button>
          </div>
          <p className="text-xs text-lab-muted/60">
            追加した概念はヒューリスティック分解で使用されます（辞書登録なし）
          </p>
          {message && (
            <p className="text-xs font-mono text-lab-accent">{message}</p>
          )}
        </div>

        {/* Search & list */}
        <div className="flex flex-col gap-3">
          <input
            type="text"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            placeholder="概念を検索…"
            className="
              bg-lab-surface border border-lab-border rounded
              px-4 py-2 text-lab-text font-mono text-sm
              placeholder:text-lab-muted focus:outline-none focus:border-lab-accent
            "
          />

          <div className="flex flex-wrap gap-2">
            {filtered.map((c) => {
              const isUser = data?.user.includes(c)
              return (
                <span
                  key={c}
                  className={`
                    px-3 py-1 rounded-full border text-xs font-mono
                    ${isUser
                      ? 'border-lab-accent/40 text-lab-accent/80 bg-lab-accent/5'
                      : 'border-lab-border text-lab-muted'
                    }
                  `}
                >
                  {c}
                  {isUser && <span className="ml-1 text-lab-accent/50">+</span>}
                </span>
              )
            })}
          </div>

          {filtered.length === 0 && (
            <p className="text-lab-muted/50 text-xs font-mono">該当なし</p>
          )}
        </div>
      </div>
    </main>
  )
}
