import { describe, it, expect } from 'vitest'
import { generateInventions, generateRandom } from '@/features/invention/generate'

describe('generateInventions', () => {
  it('2概念から3件の発明を生成する', () => {
    const result = generateInventions({ concepts: ['冷蔵庫', '感情'], mode: '真面目発明' })
    expect(result.inventions).toHaveLength(3)
  })

  it('3概念でも3件生成される', () => {
    const result = generateInventions({ concepts: ['サウナ', '株式', '記憶'], mode: '変な発明' })
    expect(result.inventions).toHaveLength(3)
  })

  it('各発明に必須フィールドがある', () => {
    const result = generateInventions({ concepts: ['冷蔵庫', '愛'], mode: '創作ドリブン' })
    for (const inv of result.inventions) {
      expect(inv.id).toBeTruthy()
      expect(inv.title).toBeTruthy()
      expect(inv.catchcopy).toBeTruthy()
      expect(inv.description).toBeTruthy()
      expect(inv.problemSolved).toBeTruthy()
      expect(inv.targetUsers).toBeTruthy()
      expect(inv.sourceConcepts.length).toBeGreaterThanOrEqual(2)
      expect(inv.scores.novelty).toBeGreaterThanOrEqual(1)
      expect(inv.scores.weirdness).toBeGreaterThanOrEqual(1)
    }
  })

  it('各発明は異なるパターンを使う', () => {
    const result = generateInventions({ concepts: ['冷蔵庫', '感情'], mode: '真面目発明' })
    const patterns = result.inventions.map((i) => i.pattern)
    const unique = new Set(patterns)
    expect(unique.size).toBe(3)
  })
})

describe('generateRandom', () => {
  it('ランダム生成でも3件返る', () => {
    const result = generateRandom()
    expect(result.inventions).toHaveLength(3)
  })
})
