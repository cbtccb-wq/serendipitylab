import type { Concept, FusionPatternId, InventionScores, Mode } from '@/types'

const PATTERN_WEIRDNESS_BASE: Record<FusionPatternId, number> = {
  機能移植: 2,
  状態連動: 2,
  目的転流: 2,
  物理化: 4,
  本人化: 4,
  取引化: 3,
  制約追加: 3,
  反転: 4,
}

const MODE_WEIRDNESS_MOD: Record<Mode, number> = {
  '真面目発明': -1,
  '変な発明': +1,
  '創作ドリブン': 0,
  'カリスモード': +1,
}

function clamp(val: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, val))
}

function countSharedAttributes(a: Concept, b: Concept): number {
  const aAll = Object.values(a.attributes).flat()
  const bAll = new Set(Object.values(b.attributes).flat())
  return aAll.filter((v) => bAll.has(v)).length
}

export function scoreInvention(
  conceptA: Concept,
  conceptB: Concept,
  pattern: FusionPatternId,
  mode: Mode,
  problemSolved: string,
): InventionScores {
  // novelty: inverse of shared attributes
  const shared = countSharedAttributes(conceptA, conceptB)
  let novelty: number
  if (shared <= 1) novelty = 5
  else if (shared <= 3) novelty = 4
  else if (shared <= 5) novelty = 3
  else if (shared <= 7) novelty = 2
  else novelty = 1

  // weirdness: pattern base + mode modifier
  const weirdness = clamp(
    PATTERN_WEIRDNESS_BASE[pattern] + MODE_WEIRDNESS_MOD[mode],
    1,
    5,
  )

  // feasibility: inverse of weirdness + mode bonus
  const feasibilityBonus = mode === '真面目発明' ? 1 : 0
  const feasibility = clamp(6 - weirdness + feasibilityBonus, 1, 5)

  // usefulness: based on problemSolved length as proxy for specificity
  const len = problemSolved.length
  let usefulness: number
  if (len < 10) usefulness = 1
  else if (len < 20) usefulness = 2
  else if (len < 40) usefulness = 3
  else if (len < 70) usefulness = 4
  else usefulness = 5

  return { novelty, feasibility, weirdness, usefulness }
}
