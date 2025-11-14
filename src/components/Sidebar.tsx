'use client'

import { JournalEntry, Folder } from '@/lib/types'
import { formatDate, truncateText, extractFirstLine } from '@/lib/utils'
import { Plus, Trash2 } from 'lucide-react'
import FolderManager from './FolderManager'

interface SidebarProps {
  entries: JournalEntry[]
  selectedId: string | null
  folders: Folder[]
  selectedFolderId: string | null
  onSelectEntry: (id: string) => void
  onNewEntry: () => void
  onDeleteEntry: (id: string) => void
  onSelectFolder: (folderId: string | null) => void
  onCreateFolder: (name: string, color?: string) => void
  onDeleteFolder: (id: string) => void
  onMoveEntry: (entryId: string, folderId: string | undefined) => void
}

export default function Sidebar({
  entries,
  selectedId,
  folders,
  selectedFolderId,
  onSelectEntry,
  onNewEntry,
  onDeleteEntry,
  onSelectFolder,
  onCreateFolder,
  onDeleteFolder,
  onMoveEntry,
}: SidebarProps) {
  const sortedEntries = [...entries].sort((a, b) => b.updatedAt - a.updatedAt)

  // Filter entries based on selected folder
  const filteredEntries =
    selectedFolderId === null
      ? sortedEntries
      : sortedEntries.filter((e) => e.folderId === selectedFolderId)

  return (
    <div className="w-80 bg-neutral-950 border-r border-neutral-900 flex flex-col h-screen">
      {/* Header */}
      <div className="p-6 border-b border-neutral-900">
        <h1 className="text-2xl font-light text-neutral-50 mb-4 tracking-tight">
          Journal
        </h1>
        <button
          onClick={onNewEntry}
          className="w-full flex items-center justify-center gap-2 bg-neutral-900 hover:bg-neutral-800 text-neutral-100 font-medium py-2.5 px-4 rounded transition-colors duration-200 border border-neutral-800 hover:border-neutral-700"
        >
          <Plus size={18} />
          New Entry
        </button>
      </div>

      {/* Folder Manager */}
      <FolderManager
        folders={folders}
        selectedFolderId={selectedFolderId}
        onSelectFolder={onSelectFolder}
        onCreateFolder={onCreateFolder}
        onDeleteFolder={onDeleteFolder}
      />

      {/* Entries List */}
      <div className="flex-1 overflow-y-auto">
        {filteredEntries.length === 0 ? (
          <div className="p-6 text-center">
            <p className="text-slate-400 text-sm">No entries yet</p>
            <p className="text-slate-500 text-xs mt-2">Create one to get started</p>
          </div>
        ) : (
          <div className="space-y-2 p-4">
            {filteredEntries.map((entry) => (
              <div
                key={entry.id}
                className={`group p-3 rounded cursor-pointer transition-colors duration-200 ${
                  selectedId === entry.id
                    ? 'bg-neutral-900 border border-neutral-800'
                    : 'bg-neutral-950 hover:bg-neutral-900 border border-neutral-950 hover:border-neutral-800'
                }`}
              >
                <button
                  onClick={() => onSelectEntry(entry.id)}
                  className="w-full text-left"
                >
                  <h3 className="font-medium text-neutral-100 text-sm truncate">
                    {entry.title || 'Untitled'}
                  </h3>
                  <p className="text-xs text-neutral-600 mt-1">
                    {formatDate(entry.updatedAt)}
                  </p>
                  <p className="text-xs text-neutral-500 mt-1.5 line-clamp-2">
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
                  className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-neutral-800 rounded"
                >
                  <Trash2 size={14} className="text-neutral-600 hover:text-neutral-400" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
