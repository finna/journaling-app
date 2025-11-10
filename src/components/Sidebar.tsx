'use client'

import { useState } from 'react'
import { JournalEntry, Folder } from '@/lib/types'
import { formatDate, truncateText, extractFirstLine } from '@/lib/utils'
import { Plus, Trash2, ChevronDown, ChevronRight, Folder as FolderIcon, Edit2, Check, X } from 'lucide-react'

interface SidebarProps {
  entries: JournalEntry[]
  folders: Folder[]
  selectedId: string | null
  selectedFolderId: string | undefined
  onSelectEntry: (id: string) => void
  onSelectFolder: (id: string | undefined) => void
  onNewEntry: () => void
  onDeleteEntry: (id: string) => void
  onNewFolder: () => void
  onDeleteFolder: (id: string) => void
  onRenameFolder: (id: string, name: string) => void
}

export default function Sidebar({
  entries,
  folders,
  selectedId,
  selectedFolderId,
  onSelectEntry,
  onSelectFolder,
  onNewEntry,
  onDeleteEntry,
  onNewFolder,
  onDeleteFolder,
  onRenameFolder,
}: SidebarProps) {
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set())
  const [renamingFolderId, setRenamingFolderId] = useState<string | null>(null)
  const [renamingValue, setRenamingValue] = useState('')

  const toggleFolder = (folderId: string) => {
    const newExpanded = new Set(expandedFolders)
    if (newExpanded.has(folderId)) {
      newExpanded.delete(folderId)
    } else {
      newExpanded.add(folderId)
    }
    setExpandedFolders(newExpanded)
  }

  const handleRenameStart = (folder: Folder) => {
    setRenamingFolderId(folder.id)
    setRenamingValue(folder.name)
  }

  const handleRenameSave = (folderId: string) => {
    if (renamingValue.trim()) {
      onRenameFolder(folderId, renamingValue)
    }
    setRenamingFolderId(null)
    setRenamingValue('')
  }

  const unfolderizedEntries = entries
    .filter((e) => !e.folderId)
    .sort((a, b) => b.updatedAt - a.updatedAt)

  const renderEntry = (entry: JournalEntry) => (
    <div
      key={entry.id}
      className={`group p-4 rounded-lg cursor-pointer transition-all ml-4 ${
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
          {extractFirstLine(entry.content) || 'Untitled'}
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
  )

  return (
    <div className="w-80 bg-slate-50 border-r border-slate-200 flex flex-col h-screen">
      {/* Header */}
      <div className="p-6 border-b border-slate-200">
        <h1 className="text-2xl font-bold text-slate-900 mb-4">Journal</h1>
        <div className="flex gap-2">
          <button
            onClick={onNewEntry}
            className="flex-1 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
          >
            <Plus size={18} />
            Entry
          </button>
          <button
            onClick={onNewFolder}
            className="flex-1 flex items-center justify-center gap-2 bg-slate-400 hover:bg-slate-500 text-white font-medium py-2 px-4 rounded-lg transition-colors"
          >
            <FolderIcon size={18} />
            Folder
          </button>
        </div>
      </div>

      {/* Content List */}
      <div className="flex-1 overflow-y-auto">
        {entries.length === 0 && folders.length === 0 ? (
          <div className="p-6 text-center">
            <p className="text-slate-500 text-sm">No entries or folders yet</p>
            <p className="text-slate-400 text-xs mt-2">Create one to get started</p>
          </div>
        ) : (
          <div className="space-y-2 p-4">
            {/* Folders Section */}
            {folders.length > 0 && (
              <div className="space-y-2">
                {folders.map((folder) => {
                  const isFolderExpanded = expandedFolders.has(folder.id)
                  const isRenamingThisFolder = renamingFolderId === folder.id
                  const folderEntries = entries
                    .filter((e) => e.folderId === folder.id)
                    .sort((a, b) => b.updatedAt - a.updatedAt)

                  return (
                    <div key={folder.id}>
                      {/* Folder Header */}
                      <div
                        className={`group p-3 rounded-lg cursor-pointer transition-all flex items-center gap-2 ${
                          selectedFolderId === folder.id
                            ? 'bg-purple-100 border border-purple-300'
                            : 'bg-white hover:bg-slate-100 border border-transparent hover:border-slate-200'
                        }`}
                      >
                        <button
                          onClick={() => toggleFolder(folder.id)}
                          className="p-0 hover:bg-slate-200 rounded"
                        >
                          {isFolderExpanded ? (
                            <ChevronDown size={16} className="text-slate-600" />
                          ) : (
                            <ChevronRight size={16} className="text-slate-600" />
                          )}
                        </button>

                        <FolderIcon size={16} className="text-purple-600" />

                        {isRenamingThisFolder ? (
                          <div className="flex-1 flex gap-2">
                            <input
                              type="text"
                              value={renamingValue}
                              onChange={(e) => setRenamingValue(e.target.value)}
                              className="flex-1 px-2 py-1 rounded border border-slate-300 text-sm focus:outline-none focus:border-blue-500"
                              autoFocus
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                  handleRenameSave(folder.id)
                                } else if (e.key === 'Escape') {
                                  setRenamingFolderId(null)
                                }
                              }}
                            />
                            <button
                              onClick={() => handleRenameSave(folder.id)}
                              className="p-1 hover:bg-green-100 rounded"
                            >
                              <Check size={14} className="text-green-600" />
                            </button>
                            <button
                              onClick={() => setRenamingFolderId(null)}
                              className="p-1 hover:bg-red-100 rounded"
                            >
                              <X size={14} className="text-red-600" />
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => onSelectFolder(folder.id)}
                            className="flex-1 text-left font-semibold text-slate-900 text-sm"
                          >
                            {folder.name}
                          </button>
                        )}

                        {/* Folder Actions */}
                        {!isRenamingThisFolder && (
                          <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                handleRenameStart(folder)
                              }}
                              className="p-1 hover:bg-blue-100 rounded"
                            >
                              <Edit2 size={14} className="text-blue-600" />
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                if (confirm(`Delete "${folder.name}" folder?`)) {
                                  onDeleteFolder(folder.id)
                                }
                              }}
                              className="p-1 hover:bg-red-100 rounded"
                            >
                              <Trash2 size={14} className="text-red-600" />
                            </button>
                          </div>
                        )}
                      </div>

                      {/* Folder Contents */}
                      {isFolderExpanded && folderEntries.length > 0 && (
                        <div className="space-y-2 mt-2">
                          {folderEntries.map((entry) => renderEntry(entry))}
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            )}

            {/* Unfolderized Entries Section */}
            {unfolderizedEntries.length > 0 && (
              <div className="space-y-2">
                {folders.length > 0 && (
                  <div className="px-4 py-2 text-xs font-semibold text-slate-500 uppercase tracking-wide">
                    Other Entries
                  </div>
                )}
                {unfolderizedEntries.map((entry) => renderEntry(entry))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
