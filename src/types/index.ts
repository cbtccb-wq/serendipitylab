export type Mode = '真面目発明' | '変な発明' | '創作ドリブン' | 'カリスモード'

export type FusionPatternId =
  | '機能移植'
  | '状態連動'
  | '目的転流'
  | '物理化'
  | '本人化'
  | '取引化'
  | '制約追加'
  | '反転'

export interface ConceptAttributes {
  物理的特徴: string[]
  感情的特徴: string[]
  用途: string[]
  対象: string[]
  状態変化: string[]
  周辺イメージ: string[]
  制約: string[]
  逆説性: string[]
  functions_emotions: string[]
}

export interface Concept {
  raw: string
  attributes: ConceptAttributes
}

export interface FusionResult {
  pattern: FusionPatternId
  title: string
  catchcopy: string
  description: string
  problemSolved: string
  targetUsers: string
  sourceConcepts: string[]
}

export interface InventionScores {
  novelty: number
  feasibility: number
  weirdness: number
  usefulness: number
}

export interface InventionIdea {
  id: string
  title: string
  catchcopy: string
  sourceConcepts: string[]
  description: string
  problemSolved: string
  targetUsers: string
  scores: InventionScores
  pattern: FusionPatternId
  mode: Mode
}

export interface GenerateRequest {
  concepts: string[]
  mode: Mode
}

export interface GenerateResponse {
  inventions: InventionIdea[]
}
