import { NextRequest, NextResponse } from 'next/server'
import { addFavorite, getFavorites, removeFavorite } from '@/lib/storage'
import type { InventionIdea } from '@/types'

export async function GET() {
  return NextResponse.json(getFavorites())
}

export async function POST(request: NextRequest) {
  const body: { invention: InventionIdea; memo?: string; tags?: string[] } = await request.json()
  if (!body.invention?.id) {
    return NextResponse.json({ error: 'invention が必要です' }, { status: 400 })
  }
  const entry = addFavorite(body.invention, body.memo ?? '', body.tags ?? [])
  return NextResponse.json(entry)
}

export async function DELETE(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const inventionId = searchParams.get('inventionId')
  if (!inventionId) {
    return NextResponse.json({ error: 'inventionId が必要です' }, { status: 400 })
  }
  removeFavorite(inventionId)
  return NextResponse.json({ ok: true })
}
