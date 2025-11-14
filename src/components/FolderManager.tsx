'use client'

import { Folder } from '@/lib/types'
import { Trash2, Folder as FolderIcon, Plus } from 'lucide-react'
import { useState } from 'react'

interface FolderManagerProps {
  folders: Folder[]
  selectedFolderId: string | null
  onSelectFolder: (folderId: string | null) => void
  onCreateFolder: (name: string, color?: string) => void
  onDeleteFolder: (id: string) => void
}

const FOLDER_COLORS = [
  { name: 'slate', bg: 'bg-neutral-700', text: 'text-neutral-300', indicator: 'bg-neutral-600' },
  { name: 'stone', bg: 'bg-neutral-600', text: 'text-neutral-200', indicator: 'bg-neutral-500' },
  { name: 'zinc', bg: 'bg-neutral-500', text: 'text-neutral-100', indicator: 'bg-neutral-400' },
  { name: 'amber', bg: 'bg-amber-900', text: 'text-amber-200', indicator: 'bg-amber-700' },
  { name: 'rose', bg: 'bg-rose-900', text: 'text-rose-200', indicator: 'bg-rose-700' },
  { name: 'green', bg: 'bg-green-900', text: 'text-green-200', indicator: 'bg-green-700' },
]

export default function FolderManager({
  folders,
  selectedFolderId,
  onSelectFolder,
  onCreateFolder,
  onDeleteFolder,
}: FolderManagerProps) {
  const [isCreating, setIsCreating] = useState(false)
  const [newFolderName, setNewFolderName] = useState('')
  const [selectedColor, setSelectedColor] = useState('blue')

  const handleCreateFolder = () => {
    if (newFolderName.trim()) {
      onCreateFolder(newFolderName, selectedColor)
      setNewFolderName('')
      setIsCreating(false)
      setSelectedColor('blue')
    }
  }

  const getColorClasses = (colorName?: string) => {
    const color = FOLDER_COLORS.find((c) => c.name === colorName) || FOLDER_COLORS[1]
    return { bg: color.bg, light: color.light, text: color.text }
  }

  return (
    <div className="p-4 border-b border-neutral-900">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xs font-semibold text-neutral-500 uppercase tracking-widest">Folders</h2>
        <button
          onClick={() => setIsCreating(true)}
          className="p-1 hover:bg-neutral-800 rounded transition-colors text-neutral-600 hover:text-neutral-400"
          title="Create folder"
        >
          <Plus size={16} />
        </button>
      </div>

      {/* All Entries Button */}
      <button
        onClick={() => onSelectFolder(null)}
        className={`w-full text-left px-3 py-2 rounded text-sm font-medium transition-colors duration-200 mb-2 ${
          selectedFolderId === null
            ? 'bg-neutral-900 text-neutral-100 border border-neutral-800'
            : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-900 border border-neutral-950 hover:border-neutral-800'
        }`}
      >
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-neutral-700"></div>
          <span>All Entries</span>
        </div>
      </button>

      {/* Folder List */}
      <div className="space-y-1.5">
        {folders.map((folder) => {
          const color = FOLDER_COLORS.find((c) => c.name === folder.color) || FOLDER_COLORS[0]
          return (
            <div key={folder.id} className="group">
              <button
                onClick={() => onSelectFolder(folder.id)}
                className={`w-full text-left px-3 py-2 rounded text-sm font-medium transition-colors duration-200 flex items-center gap-2 border ${
                  selectedFolderId === folder.id
                    ? `bg-neutral-900 ${color.text} border-neutral-800`
                    : `text-neutral-400 hover:text-neutral-200 hover:bg-neutral-900 border-neutral-950 hover:border-neutral-800`
                }`}
              >
                <div className={`w-2 h-2 rounded-full ${color.indicator}`}></div>
                <span className="flex-1 truncate">{folder.name}</span>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    if (confirm(`Delete folder "${folder.name}"?`)) {
                      onDeleteFolder(folder.id)
                    }
                  }}
                  className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-neutral-800 rounded text-neutral-600 hover:text-neutral-400"
                >
                  <Trash2 size={14} />
                </button>
              </button>
            </div>
          )
        })}
      </div>

      {/* Create Folder Form */}
      {isCreating && (
        <div className="mt-4 p-4 bg-neutral-900 border border-neutral-800 rounded">
          <input
            type="text"
            placeholder="Folder name"
            value={newFolderName}
            onChange={(e) => setNewFolderName(e.target.value)}
            autoFocus
            className="w-full px-3 py-2 mb-3 border border-neutral-800 rounded bg-neutral-950 text-neutral-100 text-sm placeholder-neutral-600 focus:outline-none focus:border-neutral-700 focus:ring-1 focus:ring-neutral-700 transition-colors"
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleCreateFolder()
              if (e.key === 'Escape') {
                setIsCreating(false)
                setNewFolderName('')
              }
            }}
          />
          <div className="mb-4">
            <p className="text-xs text-neutral-500 font-semibold mb-3 uppercase tracking-widest">Color:</p>
            <div className="flex gap-2 flex-wrap">
              {FOLDER_COLORS.map((color) => (
                <button
                  key={color.name}
                  onClick={() => setSelectedColor(color.name)}
                  className={`w-6 h-6 rounded-full ${color.bg} transition-all duration-200 ${
                    selectedColor === color.name ? 'ring-2 ring-offset-2 ring-offset-neutral-900 ring-neutral-400 scale-110' : 'hover:scale-105'
                  }`}
                  title={color.name}
                />
              ))}
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleCreateFolder}
              className="flex-1 px-2 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-100 text-sm font-medium rounded transition-colors border border-neutral-700"
            >
              Create
            </button>
            <button
              onClick={() => {
                setIsCreating(false)
                setNewFolderName('')
              }}
              className="flex-1 px-2 py-1.5 bg-neutral-950 hover:bg-neutral-900 text-neutral-400 text-sm font-medium rounded transition-colors border border-neutral-800"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
