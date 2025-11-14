'use client'

import { useState, useEffect } from 'react'
import Sidebar from '@/components/Sidebar'
import Editor from '@/components/Editor'
import { JournalEntry, Folder } from '@/lib/types'
import {
  getEntries,
  saveEntry,
  deleteEntry,
  generateId,
  getFolders,
  createFolder,
  updateFolder,
  deleteFolder,
} from '@/lib/storage'

export default function Home() {
  const [entries, setEntries] = useState<JournalEntry[]>([])
  const [folders, setFolders] = useState<Folder[]>([])
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [selectedFolderId, setSelectedFolderId] = useState<string | null>(null)
  const [isLoaded, setIsLoaded] = useState(false)

  // Load entries and folders from localStorage on mount
  useEffect(() => {
    const loadedEntries = getEntries()
    const loadedFolders = getFolders()
    setEntries(loadedEntries)
    setFolders(loadedFolders)
    if (loadedEntries.length > 0) {
      setSelectedId(loadedEntries[0].id)
    }
    setIsLoaded(true)
  }, [])

  const selectedEntry = entries.find((e) => e.id === selectedId) || null

  const handleNewEntry = () => {
    const newEntry: JournalEntry = {
      id: generateId(),
      title: 'Untitled',
      content: '',
      createdAt: Date.now(),
      updatedAt: Date.now(),
      folderId: selectedFolderId || undefined,
    }
    setEntries([newEntry, ...entries])
    setSelectedId(newEntry.id)
  }

  const handleSaveEntry = (entry: JournalEntry) => {
    saveEntry(entry)
    setEntries(entries.map((e) => (e.id === entry.id ? entry : e)))
  }

  const handleDeleteEntry = (id: string) => {
    deleteEntry(id)
    setEntries(entries.filter((e) => e.id !== id))
    if (selectedId === id) {
      const remaining = entries.filter((e) => e.id !== id)
      setSelectedId(remaining.length > 0 ? remaining[0].id : null)
    }
  }

  const handleCreateFolder = (name: string, color?: string) => {
    const newFolder = createFolder(name, color)
    setFolders([...folders, newFolder])
  }

  const handleDeleteFolder = (id: string) => {
    deleteFolder(id)
    setFolders(folders.filter((f) => f.id !== id))
    if (selectedFolderId === id) {
      setSelectedFolderId(null)
    }
  }

  const handleMoveEntry = (entryId: string, folderId: string | undefined) => {
    const entry = entries.find((e) => e.id === entryId)
    if (entry) {
      const updatedEntry = { ...entry, folderId }
      saveEntry(updatedEntry)
      setEntries(entries.map((e) => (e.id === entryId ? updatedEntry : e)))
    }
  }

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center h-screen bg-white">
        <p className="text-slate-400">Loading...</p>
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-white">
      <Sidebar
        entries={entries}
        selectedId={selectedId}
        folders={folders}
        selectedFolderId={selectedFolderId}
        onSelectEntry={setSelectedId}
        onNewEntry={handleNewEntry}
        onDeleteEntry={handleDeleteEntry}
        onSelectFolder={setSelectedFolderId}
        onCreateFolder={handleCreateFolder}
        onDeleteFolder={handleDeleteFolder}
        onMoveEntry={handleMoveEntry}
      />
      <Editor entry={selectedEntry} onSave={handleSaveEntry} />
    </div>
  )
}
