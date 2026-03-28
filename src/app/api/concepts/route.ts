import { NextRequest, NextResponse } from 'next/server'
import { addUserConcept, getUserConcepts } from '@/lib/storage'
import { getConceptKeys } from '@/features/concept/decompose'

export async function GET() {
  const builtin = getConceptKeys()
  const user = getUserConcepts().map((c) => c.name)
  return NextResponse.json({ builtin, user, all: [...new Set([...builtin, ...user])] })
}

export async function POST(request: NextRequest) {
  const body: { name: string } = await request.json()
  const name = String(body.name ?? '').trim()
  if (!name) {
    return NextResponse.json({ error: '概念名が必要です' }, { status: 400 })
  }
  const entry = addUserConcept(name)
  return NextResponse.json(entry)
}
