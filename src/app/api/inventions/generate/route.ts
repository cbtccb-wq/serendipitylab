import { NextRequest, NextResponse } from 'next/server'
import { generateInventions, generateRandom } from '@/features/invention/generate'
import type { GenerateRequest, Mode } from '@/types'

const VALID_MODES: Mode[] = ['真面目発明', '変な発明', '創作ドリブン', 'カリスモード']

export async function POST(request: NextRequest) {
  let body: GenerateRequest & { random?: boolean }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  if (body.random) {
    const result = generateRandom()
    return NextResponse.json(result)
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
  return NextResponse.json(result)
}
