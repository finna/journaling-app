'use client'

import { JournalEntry, JournalEntries, Folder, Folders } from './types'

const STORAGE_KEY = 'journal-entries'
const FOLDERS_KEY = 'journal-folders'

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

// Folder operations
export function getFolders(): Folders {
  if (typeof window === 'undefined') return []

  try {
    const stored = localStorage.getItem(FOLDERS_KEY)
    return stored ? JSON.parse(stored) : []
  } catch (error) {
    console.error('Error reading folders from localStorage:', error)
    return []
  }
}

export function createFolder(name: string, color?: string): Folder {
  const folder: Folder = {
    id: generateId(),
    name,
    color,
    createdAt: Date.now(),
  }

  try {
    const folders = getFolders()
    folders.push(folder)
    localStorage.setItem(FOLDERS_KEY, JSON.stringify(folders))
  } catch (error) {
    console.error('Error creating folder:', error)
  }

  return folder
}

export function updateFolder(id: string, updates: Partial<Folder>): void {
  if (typeof window === 'undefined') return

  try {
    const folders = getFolders()
    const index = folders.findIndex((f) => f.id === id)
    if (index > -1) {
      folders[index] = { ...folders[index], ...updates }
      localStorage.setItem(FOLDERS_KEY, JSON.stringify(folders))
    }
  } catch (error) {
    console.error('Error updating folder:', error)
  }
}

export function deleteFolder(id: string): void {
  if (typeof window === 'undefined') return

  try {
    const folders = getFolders()
    const filtered = folders.filter((f) => f.id !== id)
    localStorage.setItem(FOLDERS_KEY, JSON.stringify(filtered))

    // Remove folder reference from entries
    const entries = getEntries()
    const updatedEntries = entries.map((e) =>
      e.folderId === id ? { ...e, folderId: undefined } : e
    )
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedEntries))
  } catch (error) {
    console.error('Error deleting folder:', error)
  }
}
