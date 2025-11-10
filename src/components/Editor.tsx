'use client'

import { JournalEntry } from '@/lib/types'
import Markdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { useState, useEffect } from 'react'
import { Eye, Edit } from 'lucide-react'

interface EditorProps {
  entry: JournalEntry | null
  onSave: (entry: JournalEntry) => void
}

export default function Editor({ entry, onSave }: EditorProps) {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [viewMode, setViewMode] = useState(false)
  const [isSaved, setIsSaved] = useState(true)

  useEffect(() => {
    if (entry) {
      setTitle(entry.title)
      setContent(entry.content)
      setIsSaved(true)
    } else {
      setTitle('')
      setContent('')
    }
    setViewMode(false)
  }, [entry])

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value)
    setIsSaved(false)
  }

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value)
    setIsSaved(false)
  }

  const handleSave = () => {
    if (entry) {
      onSave({
        ...entry,
        title: title || 'Untitled',
        content,
        updatedAt: Date.now(),
      })
      setIsSaved(true)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Ctrl+S or Cmd+S to save
    if ((e.ctrlKey || e.metaKey) && e.key === 's') {
      e.preventDefault()
      handleSave()
    }
  }

  if (!entry) {
    return (
      <div className="flex-1 flex items-center justify-center bg-white">
        <div className="text-center">
          <p className="text-slate-400 text-lg">Select or create an entry to start writing</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 flex flex-col bg-white">
      {/* Toolbar */}
      <div className="border-b border-slate-200 p-4 flex items-center justify-between bg-slate-50">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setViewMode(false)}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
              !viewMode
                ? 'bg-blue-600 text-white'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <Edit size={18} />
            Edit
          </button>
          <button
            onClick={() => setViewMode(true)}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
              viewMode
                ? 'bg-blue-600 text-white'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <Eye size={18} />
            Preview
          </button>
        </div>

        <div className="flex items-center gap-2">
          {!isSaved && (
            <span className="text-sm text-red-600 font-medium">Unsaved changes</span>
          )}
          <button
            onClick={handleSave}
            disabled={isSaved}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              isSaved
                ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                : 'bg-green-600 hover:bg-green-700 text-white'
            }`}
          >
            Save
          </button>
        </div>
      </div>

      {/* Title and Content Area */}
      <div className="flex-1 overflow-hidden flex flex-col">
        {/* Title Input */}
        <input
          type="text"
          value={title}
          onChange={handleTitleChange}
          placeholder="Entry title..."
          className="border-b border-slate-200 px-6 py-3 text-lg font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-inset"
        />

        {/* Content Area */}
        <div className="flex-1 overflow-hidden">
          {!viewMode ? (
            <textarea
              value={content}
              onChange={handleContentChange}
              onKeyDown={handleKeyDown}
              placeholder="Start writing your journal entry... (Markdown is supported)"
              className="w-full h-full p-6 font-mono text-sm resize-none focus:outline-none border-none"
            />
          ) : (
            <div className="w-full h-full p-6 overflow-y-auto">
              <h1 className="text-2xl font-bold mb-4 text-slate-900">{title || 'Untitled'}</h1>
              <div className="prose prose-sm max-w-none dark:prose-invert">
                <Markdown remarkPlugins={[remarkGfm]}>{content}</Markdown>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
