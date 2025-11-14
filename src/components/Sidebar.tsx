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
    <div className="w-80 bg-gradient-to-b from-slate-900 to-slate-950 border-r border-slate-800 flex flex-col h-screen">
      {/* Header */}
      <div className="p-6 border-b border-slate-800">
        <h1 className="text-3xl font-black bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent mb-4">
          Journal
        </h1>
        <button
          onClick={onNewEntry}
          className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-semibold py-2.5 px-4 rounded-lg transition-all duration-200 shadow-lg hover:shadow-cyan-500/50"
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
                className={`group p-4 rounded-lg cursor-pointer transition-all duration-200 ${
                  selectedId === entry.id
                    ? 'bg-gradient-to-r from-cyan-500/30 to-blue-600/30 border border-cyan-500/50 shadow-lg shadow-cyan-500/20'
                    : 'bg-slate-800/40 hover:bg-slate-800/60 border border-slate-700/50 hover:border-cyan-500/30'
                }`}
              >
                <button
                  onClick={() => onSelectEntry(entry.id)}
                  className="w-full text-left"
                >
                  <h3 className="font-semibold text-slate-100 text-sm truncate group-hover:text-cyan-300 transition-colors">
                    {entry.title || 'Untitled'}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">
                    {formatDate(entry.updatedAt)}
                  </p>
                  <p className="text-xs text-slate-400 mt-2 line-clamp-2">
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
