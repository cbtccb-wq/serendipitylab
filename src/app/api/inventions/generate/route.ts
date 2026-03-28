import { NextRequest, NextResponse } from 'next/server'
import { generateInventions, generateRandom } from '@/features/invention/generate'
import { enrichFusionDescription, LLM_AVAILABLE } from '@/lib/llm'
import type { GenerateRequest, InventionIdea, Mode } from '@/types'

const VALID_MODES: Mode[] = ['真面目発明', '変な発明', '創作ドリブン', 'カリスモード']

async function maybeEnrich(inventions: InventionIdea[]): Promise<InventionIdea[]> {
  if (!LLM_AVAILABLE) return inventions

  return Promise.all(
    inventions.map(async (inv) => {
      const enriched = await enrichFusionDescription(
        inv.sourceConcepts[0] ?? '',
        inv.sourceConcepts[1] ?? inv.sourceConcepts[0] ?? '',
        inv.pattern,
        inv.description,
        inv.mode,
      )
      if (!enriched) return inv
      return {
        ...inv,
        description: enriched.description,
        catchcopy: enriched.catchcopy,
        problemSolved: enriched.problemSolved,
        targetUsers: enriched.targetUsers,
      }
    }),
  )
}

export async function POST(request: NextRequest) {
  let body: GenerateRequest & { random?: boolean }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  if (body.random) {
    const result = generateRandom()
    const inventions = await maybeEnrich(result.inventions)
    return NextResponse.json({ inventions })
  }

  if (!Array.isArray(body.concepts) || body.concepts.length < 2 || body.concepts.length > 3) {
    return NextResponse.json(
      { error: 'concepts は2〜3個の文字列配列である必要があります' },
      { status: 400 },
    )
  }

  const sanitized = body.concepts.map((c: string) => String(c).trim()).filter(Boolean)
  if (sanitized.length < 2) {
    return NextResponse.json(
      { error: '空でない概念が2つ以上必要です' },
      { status: 400 },
    )
  }

  if (!body.mode || !VALID_MODES.includes(body.mode)) {
    return NextResponse.json(
      { error: `mode は ${VALID_MODES.join(' / ')} のいずれかである必要があります` },
      { status: 400 },
    )
  }

  const result = generateInventions({ concepts: sanitized, mode: body.mode })
  const inventions = await maybeEnrich(result.inventions)
  return NextResponse.json({ inventions })
}
