import { decomposeConcept, getConceptKeys } from '@/features/concept/decompose'
import {
  ALL_PATTERN_IDS,
  MODE_PREFERRED_PATTERNS,
  fusionPatterns,
} from '@/features/fusion/patterns'
import { scoreInvention } from '@/features/scoring/score'
import type {
  Concept,
  FusionPatternId,
  GenerateRequest,
  GenerateResponse,
  InventionIdea,
  Mode,
} from '@/types'

function randomId(): string {
  return Math.random().toString(36).slice(2, 10)
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function selectPatterns(mode: Mode, random: boolean): FusionPatternId[] {
  if (random) return shuffle(ALL_PATTERN_IDS).slice(0, 3)
  const preferred = MODE_PREFERRED_PATTERNS[mode]
  // Pick 3: first two from preferred, third from remaining patterns
  const rest = ALL_PATTERN_IDS.filter((p) => !preferred.includes(p))
  return [preferred[0], preferred[1], shuffle(rest)[0]]
}

function buildIdea(
  conceptA: Concept,
  conceptB: Concept,
  pattern: FusionPatternId,
  mode: Mode,
): InventionIdea {
  const fusion = fusionPatterns[pattern](conceptA, conceptB, mode)
  const scores = scoreInvention(conceptA, conceptB, pattern, mode, fusion.problemSolved)
  return {
    id: randomId(),
    title: fusion.title,
    catchcopy: fusion.catchcopy,
    sourceConcepts: fusion.sourceConcepts,
    description: fusion.description,
    problemSolved: fusion.problemSolved,
    targetUsers: fusion.targetUsers,
    scores,
    pattern,
    mode,
  }
}

export function generateInventions(request: GenerateRequest): GenerateResponse {
  const { concepts, mode } = request
  const isRandom = concepts.length === 0

  const decomposed = concepts.map(decomposeConcept)
  const patterns = selectPatterns(mode, false)

  let pairs: [Concept, Concept][]
  if (decomposed.length >= 3) {
    pairs = [
      [decomposed[0], decomposed[1]],
      [decomposed[1], decomposed[2]],
      [decomposed[0], decomposed[2]],
    ]
  } else {
    pairs = [
      [decomposed[0], decomposed[1]],
      [decomposed[1], decomposed[0]],
      [decomposed[0], decomposed[1]],
    ]
  }

  const inventions: InventionIdea[] = patterns.map((pattern, i) =>
    buildIdea(pairs[i][0], pairs[i][1], pattern, mode),
  )

  return { inventions }
}

export function generateRandom(): GenerateResponse {
  const keys = getConceptKeys()
  const shuffled = shuffle(keys)
  const [a, b] = shuffled.slice(0, 2)
  const modes: Mode[] = ['真面目発明', '変な発明', '創作ドリブン', 'カリスモード']
  const mode = modes[Math.floor(Math.random() * modes.length)]
  const patterns = shuffle(ALL_PATTERN_IDS).slice(0, 3) as [
    FusionPatternId,
    FusionPatternId,
    FusionPatternId,
  ]

  const ca = decomposeConcept(a)
  const cb = decomposeConcept(b)

  const inventions: InventionIdea[] = [
    buildIdea(ca, cb, patterns[0], mode),
    buildIdea(cb, ca, patterns[1], mode),
    buildIdea(ca, cb, patterns[2], mode),
  ]

  return { inventions }
}
