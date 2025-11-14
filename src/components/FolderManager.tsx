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
  { name: 'slate', bg: 'bg-slate-500', light: 'bg-slate-100', text: 'text-slate-700' },
  { name: 'blue', bg: 'bg-blue-500', light: 'bg-blue-100', text: 'text-blue-700' },
  { name: 'emerald', bg: 'bg-emerald-500', light: 'bg-emerald-100', text: 'text-emerald-700' },
  { name: 'amber', bg: 'bg-amber-500', light: 'bg-amber-100', text: 'text-amber-700' },
  { name: 'rose', bg: 'bg-rose-500', light: 'bg-rose-100', text: 'text-rose-700' },
  { name: 'violet', bg: 'bg-violet-500', light: 'bg-violet-100', text: 'text-violet-700' },
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
    <div className="p-4 border-b border-slate-200">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-semibold text-slate-700 uppercase tracking-wider">Folders</h2>
        <button
          onClick={() => setIsCreating(true)}
          className="p-1 hover:bg-slate-200 rounded transition-colors"
          title="Create folder"
        >
          <Plus size={16} className="text-slate-600" />
        </button>
      </div>

      {/* All Entries Button */}
      <button
        onClick={() => onSelectFolder(null)}
        className={`w-full text-left px-3 py-2 rounded-lg transition-colors mb-2 ${
          selectedFolderId === null
            ? 'bg-slate-300 text-slate-900 font-medium'
            : 'text-slate-700 hover:bg-slate-100'
        }`}
      >
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-sm bg-slate-300"></div>
          <span className="text-sm">All Entries</span>
        </div>
      </button>

      {/* Folder List */}
      <div className="space-y-2">
        {folders.map((folder) => {
          const colors = getColorClasses(folder.color)
          return (
            <div key={folder.id} className="group">
              <button
                onClick={() => onSelectFolder(folder.id)}
                className={`w-full text-left px-3 py-2 rounded-lg transition-colors flex items-center gap-2 ${
                  selectedFolderId === folder.id
                    ? `${colors.light} ${colors.text} font-medium`
                    : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                <FolderIcon size={16} className={colors.bg.replace('bg-', 'text-')} />
                <span className="text-sm flex-1 truncate">{folder.name}</span>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    if (confirm(`Delete folder "${folder.name}"?`)) {
                      onDeleteFolder(folder.id)
                    }
                  }}
                  className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-red-100 rounded"
                >
                  <Trash2 size={14} className="text-red-600" />
                </button>
              </button>
            </div>
          )
        })}
      </div>

      {/* Create Folder Form */}
      {isCreating && (
        <div className="mt-4 p-3 bg-slate-100 rounded-lg">
          <input
            type="text"
            placeholder="Folder name"
            value={newFolderName}
            onChange={(e) => setNewFolderName(e.target.value)}
            autoFocus
            className="w-full px-2 py-1 mb-3 border border-slate-300 rounded text-sm"
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleCreateFolder()
              if (e.key === 'Escape') {
                setIsCreating(false)
                setNewFolderName('')
              }
            }}
          />
          <div className="mb-3">
            <p className="text-xs text-slate-600 mb-2">Color:</p>
            <div className="flex gap-2 flex-wrap">
              {FOLDER_COLORS.map((color) => (
                <button
                  key={color.name}
                  onClick={() => setSelectedColor(color.name)}
                  className={`w-6 h-6 rounded-full ${color.bg} ${
                    selectedColor === color.name ? 'ring-2 ring-offset-1 ring-slate-400' : ''
                  }`}
                />
              ))}
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleCreateFolder}
              className="flex-1 px-2 py-1 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded transition-colors"
            >
              Create
            </button>
            <button
              onClick={() => {
                setIsCreating(false)
                setNewFolderName('')
              }}
              className="flex-1 px-2 py-1 bg-slate-300 hover:bg-slate-400 text-slate-900 text-sm rounded transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
