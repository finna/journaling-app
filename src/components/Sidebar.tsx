'use client'

import { JournalEntry } from '@/lib/types'
import { formatDate, truncateText, extractFirstLine } from '@/lib/utils'
import { Plus, Trash2 } from 'lucide-react'
import DarkModeToggle from './DarkModeToggle'

interface SidebarProps {
  entries: JournalEntry[]
  selectedId: string | null
  onSelectEntry: (id: string) => void
  onNewEntry: () => void
  onDeleteEntry: (id: string) => void
}

export default function Sidebar({
  entries,
  selectedId,
  onSelectEntry,
  onNewEntry,
  onDeleteEntry,
}: SidebarProps) {
  const sortedEntries = [...entries].sort((a, b) => b.updatedAt - a.updatedAt)

  return (
    <div className="w-80 bg-slate-50 dark:bg-slate-900 border-r border-slate-200 dark:border-slate-700 flex flex-col h-screen">
      {/* Header */}
      <div className="p-6 border-b border-slate-200 dark:border-slate-700">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Journal</h1>
          <DarkModeToggle />
        </div>
        <button
          onClick={onNewEntry}
          className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg transition-colors"
        >
          <Plus size={18} />
          New Entry
        </button>
      </div>

      {/* Entries List */}
      <div className="flex-1 overflow-y-auto">
        {sortedEntries.length === 0 ? (
          <div className="p-6 text-center">
            <p className="text-slate-500 dark:text-slate-400 text-sm">No entries yet</p>
            <p className="text-slate-400 dark:text-slate-500 text-xs mt-2">Create one to get started</p>
          </div>
        ) : (
          <div className="space-y-2 p-4">
            {sortedEntries.map((entry) => (
              <div
                key={entry.id}
                className={`group p-4 rounded-lg cursor-pointer transition-all ${
                  selectedId === entry.id
                    ? 'bg-blue-100 dark:bg-blue-900/30 border border-blue-300 dark:border-blue-700'
                    : 'bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 border border-transparent hover:border-slate-200 dark:hover:border-slate-600'
                }`}
              >
                <button
                  onClick={() => onSelectEntry(entry.id)}
                  className="w-full text-left"
                >
                  <h3 className="font-semibold text-slate-900 dark:text-white text-sm truncate">
                    {entry.title || 'Untitled'}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    {formatDate(entry.updatedAt)}
                  </p>
                  <p className="text-xs text-slate-600 dark:text-slate-300 mt-2 line-clamp-2">
                    {truncateText(entry.content, 60)}
                  </p>
                </button>

                {/* Delete Button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    if (confirm('Delete this entry?')) {
                      onDeleteEntry(entry.id)
                    }
                  }}
                  className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-red-100 dark:hover:bg-red-900/30 rounded"
                >
                  <Trash2 size={16} className="text-red-600 dark:text-red-400" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
