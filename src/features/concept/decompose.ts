import type { Concept, ConceptAttributes } from '@/types'
import conceptsData from '@/data/concepts.json'

type ConceptDictionary = Record<string, ConceptAttributes>
const dictionary = conceptsData as ConceptDictionary

function lookupConcept(raw: string): ConceptAttributes | null {
  return dictionary[raw] ?? null
}

function heuristicDecompose(raw: string): ConceptAttributes {
  // Detect loanwords (katakana-heavy → technology/object)
  const katakanaRatio = (raw.match(/[\u30A0-\u30FF]/g) ?? []).length / raw.length
  // Detect emotion kanji
  const emotionKanji = /[愛怒悲喜恐憎欲感情]/
  const hasEmotion = emotionKanji.test(raw)
  // Detect abstract nouns (hiragana-heavy without kanji)
  const isAbstract = (raw.match(/[\u3040-\u309F]/g) ?? []).length / raw.length > 0.5

  const base: ConceptAttributes = {
    物理的特徴: ['形状不明', '感知可能'],
    感情的特徴: ['中立', '好奇心'],
    用途: ['未分類の用途'],
    対象: ['不特定'],
    状態変化: ['変化あり'],
    周辺イメージ: [raw],
    制約: ['制約不明'],
    逆説性: [`${raw}は見えない側面を持つ`],
    functions_emotions: ['機能不明'],
  }

  if (katakanaRatio > 0.5) {
    base.物理的特徴 = ['デジタル', '機械的', 'インターフェース']
    base.用途 = ['自動化', 'データ処理', '効率化']
    base.感情的特徴 = ['信頼感', '依存', '期待']
    base.対象 = ['ユーザー', 'システム', 'データ']
    base.状態変化 = ['起動', '更新', '停止', 'エラー']
  } else if (hasEmotion) {
    base.物理的特徴 = ['不可視', '体感', '表情']
    base.感情的特徴 = ['強烈', '変動的', '個人差大']
    base.用途 = ['動機付け', 'コミュニケーション', '判断']
    base.対象 = ['自己', '他者', '状況']
    base.状態変化 = ['発生', '強化', '消滅']
    base.functions_emotions = ['感情の核', '行動の燃料']
  } else if (isAbstract) {
    base.物理的特徴 = ['概念的', '不定形']
    base.用途 = ['思考の枠組み', '意味付け']
    base.対象 = ['社会', '個人', '関係性']
    base.逆説性 = [`${raw}は定義するほど曖昧になる`]
  }

  return base
}

export function decomposeConcept(raw: string): Concept {
  const trimmed = raw.trim()
  const attributes = lookupConcept(trimmed) ?? heuristicDecompose(trimmed)
  return { raw: trimmed, attributes }
}

export function getConceptKeys(): string[] {
  return Object.keys(dictionary)
}
