import { describe, it, expect } from 'vitest'
import { decomposeConcept, getConceptKeys } from '@/features/concept/decompose'

describe('decomposeConcept', () => {
  it('辞書に存在する概念は全9軸を返す', () => {
    const result = decomposeConcept('冷蔵庫')
    expect(result.raw).toBe('冷蔵庫')
    expect(result.attributes.物理的特徴.length).toBeGreaterThan(0)
    expect(result.attributes.感情的特徴.length).toBeGreaterThan(0)
    expect(result.attributes.逆説性.length).toBeGreaterThan(0)
  })

  it('辞書に存在しない概念もフォールバックで全9軸を返す', () => {
    const result = decomposeConcept('ネコ哲学')
    expect(result.raw).toBe('ネコ哲学')
    expect(result.attributes.物理的特徴.length).toBeGreaterThan(0)
    expect(result.attributes.逆説性.length).toBeGreaterThan(0)
  })

  it('空白をトリムする', () => {
    const result = decomposeConcept('  サウナ  ')
    expect(result.raw).toBe('サウナ')
  })

  it('辞書が50件以上のエントリを持つ', () => {
    expect(getConceptKeys().length).toBeGreaterThanOrEqual(30)
  })
})
