'use client'

import { JournalEntry } from '@/lib/types'
import { formatDate, truncateText, extractFirstLine } from '@/lib/utils'
import { Plus, Trash2 } from 'lucide-react'

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
    <div className="w-80 bg-slate-50 border-r border-slate-200 flex flex-col h-screen">
      {/* Header */}
      <div className="p-6 border-b border-slate-200">
        <h1 className="text-2xl font-bold text-slate-900 mb-4">Journal</h1>
        <button
          onClick={onNewEntry}
          className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
        >
          <Plus size={18} />
          New Entry
        </button>
      </div>

      {/* Entries List */}
      <div className="flex-1 overflow-y-auto">
        {sortedEntries.length === 0 ? (
          <div className="p-6 text-center">
            <p className="text-slate-500 text-sm">No entries yet</p>
            <p className="text-slate-400 text-xs mt-2">Create one to get started</p>
          </div>
        ) : (
          <div className="space-y-2 p-4">
            {sortedEntries.map((entry) => (
              <div
                key={entry.id}
                className={`group p-4 rounded-lg cursor-pointer transition-all ${
                  selectedId === entry.id
                    ? 'bg-blue-100 border border-blue-300'
                    : 'bg-white hover:bg-slate-100 border border-transparent hover:border-slate-200'
                }`}
              >
                <button
                  onClick={() => onSelectEntry(entry.id)}
                  className="w-full text-left"
                >
                  <h3 className="font-semibold text-slate-900 text-sm truncate">
                    {entry.title || 'Untitled'}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">
                    {formatDate(entry.updatedAt)}
                  </p>
                  <p className="text-xs text-slate-600 mt-2 line-clamp-2">
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
                  className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-red-100 rounded"
                >
                  <Trash2 size={16} className="text-red-600" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
