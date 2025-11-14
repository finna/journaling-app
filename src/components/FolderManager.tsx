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
  { name: 'cyan', bg: 'bg-cyan-500', light: 'from-cyan-500/20 to-cyan-600/10', text: 'text-cyan-300', border: 'border-cyan-500/50' },
  { name: 'blue', bg: 'bg-blue-500', light: 'from-blue-500/20 to-blue-600/10', text: 'text-blue-300', border: 'border-blue-500/50' },
  { name: 'emerald', bg: 'bg-emerald-500', light: 'from-emerald-500/20 to-emerald-600/10', text: 'text-emerald-300', border: 'border-emerald-500/50' },
  { name: 'orange', bg: 'bg-orange-500', light: 'from-orange-500/20 to-orange-600/10', text: 'text-orange-300', border: 'border-orange-500/50' },
  { name: 'pink', bg: 'bg-pink-500', light: 'from-pink-500/20 to-pink-600/10', text: 'text-pink-300', border: 'border-pink-500/50' },
  { name: 'violet', bg: 'bg-violet-500', light: 'from-violet-500/20 to-violet-600/10', text: 'text-violet-300', border: 'border-violet-500/50' },
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
    <div className="p-4 border-b border-slate-800">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xs font-black text-cyan-400 uppercase tracking-widest">Folders</h2>
        <button
          onClick={() => setIsCreating(true)}
          className="p-1 hover:bg-cyan-500/20 rounded transition-colors text-cyan-400 hover:text-cyan-300"
          title="Create folder"
        >
          <Plus size={16} />
        </button>
      </div>

      {/* All Entries Button */}
      <button
        onClick={() => onSelectFolder(null)}
        className={`w-full text-left px-3 py-2 rounded-lg transition-all duration-200 mb-2 ${
          selectedFolderId === null
            ? 'bg-gradient-to-r from-slate-700 to-slate-800 text-cyan-300 font-medium border border-cyan-500/50 shadow-lg shadow-cyan-500/10'
            : 'text-slate-300 hover:text-cyan-300 hover:bg-slate-800/40 border border-slate-700/50 hover:border-cyan-500/30'
        }`}
      >
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-sm bg-gradient-to-br from-slate-400 to-slate-500"></div>
          <span className="text-sm font-medium">All Entries</span>
        </div>
      </button>

      {/* Folder List */}
      <div className="space-y-2">
        {folders.map((folder) => {
          const color = FOLDER_COLORS.find((c) => c.name === folder.color) || FOLDER_COLORS[0]
          return (
            <div key={folder.id} className="group">
              <button
                onClick={() => onSelectFolder(folder.id)}
                className={`w-full text-left px-3 py-2 rounded-lg transition-all duration-200 flex items-center gap-2 border ${
                  selectedFolderId === folder.id
                    ? `bg-gradient-to-r ${color.light} ${color.text} font-medium ${color.border} shadow-lg shadow-${color.name}-500/20`
                    : `text-slate-300 hover:text-${color.name}-300 bg-slate-800/20 border-slate-700/50 hover:bg-slate-800/40 hover:${color.border}`
                }`}
              >
                <FolderIcon size={16} className={color.text} />
                <span className="text-sm flex-1 truncate font-medium">{folder.name}</span>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    if (confirm(`Delete folder "${folder.name}"?`)) {
                      onDeleteFolder(folder.id)
                    }
                  }}
                  className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-red-500/20 rounded text-red-400 hover:text-red-300"
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
        <div className="mt-4 p-4 bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-700/50 rounded-lg">
          <input
            type="text"
            placeholder="Folder name"
            value={newFolderName}
            onChange={(e) => setNewFolderName(e.target.value)}
            autoFocus
            className="w-full px-3 py-2 mb-3 border border-slate-700 rounded-lg bg-slate-900 text-slate-100 text-sm placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-colors"
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleCreateFolder()
              if (e.key === 'Escape') {
                setIsCreating(false)
                setNewFolderName('')
              }
            }}
          />
          <div className="mb-4">
            <p className="text-xs text-cyan-400 font-semibold mb-2 uppercase tracking-widest">Color:</p>
            <div className="flex gap-3 flex-wrap">
              {FOLDER_COLORS.map((color) => (
                <button
                  key={color.name}
                  onClick={() => setSelectedColor(color.name)}
                  className={`w-7 h-7 rounded-full ${color.bg} transition-all duration-200 ${
                    selectedColor === color.name ? 'ring-2 ring-offset-2 ring-offset-slate-900 ring-cyan-400 scale-110' : 'hover:scale-105'
                  }`}
                  title={color.name}
                />
              ))}
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleCreateFolder}
              className="flex-1 px-2 py-1.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white text-sm font-semibold rounded-lg transition-all shadow-lg hover:shadow-cyan-500/30"
            >
              Create
            </button>
            <button
              onClick={() => {
                setIsCreating(false)
                setNewFolderName('')
              }}
              className="flex-1 px-2 py-1.5 bg-slate-700 hover:bg-slate-600 text-slate-200 text-sm font-semibold rounded-lg transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
