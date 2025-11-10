'use client'

import { JournalEntry, JournalEntries } from './types'

const STORAGE_KEY = 'journal-entries'

export function getEntries(): JournalEntries {
  if (typeof window === 'undefined') return []

  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    return stored ? JSON.parse(stored) : []
  } catch (error) {
    console.error('Error reading from localStorage:', error)
    return []
  }
}

export function saveEntry(entry: JournalEntry): void {
  if (typeof window === 'undefined') return

  try {
    const entries = getEntries()
    const existingIndex = entries.findIndex((e) => e.id === entry.id)

    if (existingIndex > -1) {
      entries[existingIndex] = entry
    } else {
      entries.push(entry)
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(entries))
  } catch (error) {
    console.error('Error writing to localStorage:', error)
  }
}

export function deleteEntry(id: string): void {
  if (typeof window === 'undefined') return

  try {
    const entries = getEntries()
    const filtered = entries.filter((e) => e.id !== id)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered))
  } catch (error) {
    console.error('Error deleting from localStorage:', error)
  }
}

export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2)
}
