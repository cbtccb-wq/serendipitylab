import fs from 'fs'
import path from 'path'
import type { InventionIdea } from '@/types'

const DATA_DIR = path.join(process.cwd(), '.data')

function ensureDir() {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true })
}

function readJson<T>(filename: string, fallback: T): T {
  ensureDir()
  const file = path.join(DATA_DIR, filename)
  if (!fs.existsSync(file)) return fallback
  try {
    return JSON.parse(fs.readFileSync(file, 'utf-8')) as T
  } catch {
    return fallback
  }
}

function writeJson<T>(filename: string, data: T): void {
  ensureDir()
  fs.writeFileSync(path.join(DATA_DIR, filename), JSON.stringify(data, null, 2), 'utf-8')
}

// ── History ──────────────────────────────────────────────────────────────

export interface HistoryEntry {
  id: string
  concepts: string[]
  mode: string
  inventions: InventionIdea[]
  createdAt: string
}

export function getHistory(): HistoryEntry[] {
  return readJson<HistoryEntry[]>('history.json', [])
}

export function addHistory(entry: Omit<HistoryEntry, 'id' | 'createdAt'>): HistoryEntry {
  const history = getHistory()
  const newEntry: HistoryEntry = {
    ...entry,
    id: Math.random().toString(36).slice(2, 10),
    createdAt: new Date().toISOString(),
  }
  history.unshift(newEntry)
  // Keep last 100 entries
  writeJson('history.json', history.slice(0, 100))
  return newEntry
}

export function clearHistory(): void {
  writeJson('history.json', [])
}

// ── Favorites ─────────────────────────────────────────────────────────────

export interface FavoriteEntry {
  id: string
  invention: InventionIdea
  memo: string
  tags: string[]
  savedAt: string
}

export function getFavorites(): FavoriteEntry[] {
  return readJson<FavoriteEntry[]>('favorites.json', [])
}

export function addFavorite(invention: InventionIdea, memo = '', tags: string[] = []): FavoriteEntry {
  const favorites = getFavorites()
  // Prevent duplicates by invention id
  if (favorites.some((f) => f.invention.id === invention.id)) {
    return favorites.find((f) => f.invention.id === invention.id)!
  }
  const entry: FavoriteEntry = {
    id: Math.random().toString(36).slice(2, 10),
    invention,
    memo,
    tags,
    savedAt: new Date().toISOString(),
  }
  favorites.unshift(entry)
  writeJson('favorites.json', favorites)
  return entry
}

export function removeFavorite(inventionId: string): void {
  const favorites = getFavorites().filter((f) => f.invention.id !== inventionId)
  writeJson('favorites.json', favorites)
}

export function isFavorited(inventionId: string): boolean {
  return getFavorites().some((f) => f.invention.id === inventionId)
}

// ── User Concepts ──────────────────────────────────────────────────────────

export interface UserConcept {
  name: string
  addedAt: string
}

export function getUserConcepts(): UserConcept[] {
  return readJson<UserConcept[]>('user-concepts.json', [])
}

export function addUserConcept(name: string): UserConcept {
  const list = getUserConcepts()
  if (list.some((c) => c.name === name)) return list.find((c) => c.name === name)!
  const entry: UserConcept = { name, addedAt: new Date().toISOString() }
  list.push(entry)
  writeJson('user-concepts.json', list)
  return entry
}
