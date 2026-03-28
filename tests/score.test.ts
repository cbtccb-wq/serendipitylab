import { describe, it, expect } from 'vitest'
import { scoreInvention } from '@/features/scoring/score'
import { decomposeConcept } from '@/features/concept/decompose'

describe('scoreInvention', () => {
  const a = decomposeConcept('冷蔵庫')
  const b = decomposeConcept('感情')

  it('全スコアが1〜5の範囲内', () => {
    const scores = scoreInvention(a, b, '反転', 'カリスモード', '感情の制御が難しい問題を逆転させる装置')
    expect(scores.novelty).toBeGreaterThanOrEqual(1)
    expect(scores.novelty).toBeLessThanOrEqual(5)
    expect(scores.weirdness).toBeGreaterThanOrEqual(1)
    expect(scores.weirdness).toBeLessThanOrEqual(5)
    expect(scores.feasibility).toBeGreaterThanOrEqual(1)
    expect(scores.feasibility).toBeLessThanOrEqual(5)
    expect(scores.usefulness).toBeGreaterThanOrEqual(1)
    expect(scores.usefulness).toBeLessThanOrEqual(5)
  })

  it('反転+カリスモードはweirdness >= 4', () => {
    const scores = scoreInvention(a, b, '反転', 'カリスモード', 'test')
    expect(scores.weirdness).toBeGreaterThanOrEqual(4)
  })

  it('weirdnessが高いほどfeasibilityは低い傾向', () => {
    const weird = scoreInvention(a, b, '反転', 'カリスモード', 'test')
    const normal = scoreInvention(a, b, '機能移植', '真面目発明', 'test')
    expect(weird.weirdness).toBeGreaterThanOrEqual(normal.weirdness)
    expect(weird.feasibility).toBeLessThanOrEqual(normal.feasibility)
  })

  it('problemSolvedが長いほどusefulnessが高い', () => {
    const short = scoreInvention(a, b, '機能移植', '真面目発明', '短い')
    const long = scoreInvention(a, b, '機能移植', '真面目発明', '冷蔵庫の保存機能を感情に適用することで感情的な記憶を長期間保持できる問題を解決する')
    expect(long.usefulness).toBeGreaterThanOrEqual(short.usefulness)
  })
})
