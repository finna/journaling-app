'use client'

import { JournalEntry, JournalEntries, Folder, Folders } from './types'

const ENTRIES_STORAGE_KEY = 'journal-entries'
const FOLDERS_STORAGE_KEY = 'journal-folders'

export function getEntries(): JournalEntries {
  if (typeof window === 'undefined') return []

  try {
    const stored = localStorage.getItem(ENTRIES_STORAGE_KEY)
    return stored ? JSON.parse(stored) : []
  } catch (error) {
    console.error('Error reading from localStorage:', error)
    return []
  }
}

export function getFolders(): Folders {
  if (typeof window === 'undefined') return []

  try {
    const stored = localStorage.getItem(FOLDERS_STORAGE_KEY)
    return stored ? JSON.parse(stored) : []
  } catch (error) {
    console.error('Error reading folders from localStorage:', error)
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

    localStorage.setItem(ENTRIES_STORAGE_KEY, JSON.stringify(entries))
  } catch (error) {
    console.error('Error writing to localStorage:', error)
  }
}

export function saveFolder(folder: Folder): void {
  if (typeof window === 'undefined') return

  try {
    const folders = getFolders()
    const existingIndex = folders.findIndex((f) => f.id === folder.id)

    if (existingIndex > -1) {
      folders[existingIndex] = folder
    } else {
      folders.push(folder)
    }

    localStorage.setItem(FOLDERS_STORAGE_KEY, JSON.stringify(folders))
  } catch (error) {
    console.error('Error saving folder to localStorage:', error)
  }
}

export function deleteFolder(id: string): void {
  if (typeof window === 'undefined') return

  try {
    const folders = getFolders()
    const filtered = folders.filter((f) => f.id !== id)
    localStorage.setItem(FOLDERS_STORAGE_KEY, JSON.stringify(filtered))

    // Also remove folderId from entries in this folder
    const entries = getEntries()
    const updated = entries.map((e) =>
      e.folderId === id ? { ...e, folderId: undefined } : e
    )
    localStorage.setItem(ENTRIES_STORAGE_KEY, JSON.stringify(updated))
  } catch (error) {
    console.error('Error deleting folder from localStorage:', error)
  }
}

export function deleteEntry(id: string): void {
  if (typeof window === 'undefined') return

  try {
    const entries = getEntries()
    const filtered = entries.filter((e) => e.id !== id)
    localStorage.setItem(ENTRIES_STORAGE_KEY, JSON.stringify(filtered))
  } catch (error) {
    console.error('Error deleting from localStorage:', error)
  }
}

export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2)
}
