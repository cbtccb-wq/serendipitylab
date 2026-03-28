'use client'

interface ConceptInputProps {
  label: string
  value: string
  onChange: (value: string) => void
  placeholder?: string
}

export function ConceptInput({ label, value, onChange, placeholder }: ConceptInputProps) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs font-mono text-lab-accent uppercase tracking-widest">
        {label}
      </label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder ?? '概念を入力…'}
        className="
          bg-lab-surface border border-lab-border rounded
          px-4 py-3 text-lab-text font-mono text-base
          placeholder:text-lab-muted
          focus:outline-none focus:border-lab-accent focus:shadow-glow
          transition-all duration-200
        "
      />
    </div>
  )
}
