import { NextRequest, NextResponse } from 'next/server'
import { addHistory, clearHistory, getHistory } from '@/lib/storage'
import type { InventionIdea, Mode } from '@/types'

export async function GET() {
  return NextResponse.json(getHistory())
}

export async function POST(request: NextRequest) {
  const body: { concepts: string[]; mode: Mode; inventions: InventionIdea[] } =
    await request.json()
  if (!body.inventions?.length) {
    return NextResponse.json({ error: 'inventions が必要です' }, { status: 400 })
  }
  const entry = addHistory(body)
  return NextResponse.json(entry)
}

export async function DELETE() {
  clearHistory()
  return NextResponse.json({ ok: true })
}
