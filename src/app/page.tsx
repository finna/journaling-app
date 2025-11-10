'use client'

import { useState, useEffect } from 'react'
import Sidebar from '@/components/Sidebar'
import Editor from '@/components/Editor'
import { JournalEntry } from '@/lib/types'
import { getEntries, saveEntry, deleteEntry, generateId } from '@/lib/storage'

export default function Home() {
  const [entries, setEntries] = useState<JournalEntry[]>([])
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [isLoaded, setIsLoaded] = useState(false)

  // Load entries from localStorage on mount
  useEffect(() => {
    const loadedEntries = getEntries()
    setEntries(loadedEntries)
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

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center h-screen bg-white dark:bg-slate-950">
        <p className="text-slate-400 dark:text-slate-500">Loading...</p>
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-white dark:bg-slate-950">
      <Sidebar
        entries={entries}
        selectedId={selectedId}
        onSelectEntry={setSelectedId}
        onNewEntry={handleNewEntry}
        onDeleteEntry={handleDeleteEntry}
      />
      <Editor entry={selectedEntry} onSave={handleSaveEntry} />
    </div>
  )
}
