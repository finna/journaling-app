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
      <div className="flex-1 flex items-center justify-center bg-white dark:bg-slate-950">
        <div className="text-center">
          <p className="text-slate-400 dark:text-slate-500 text-lg">Select or create an entry to start writing</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 flex flex-col bg-white dark:bg-slate-950">
      {/* Toolbar */}
      <div className="border-b border-slate-200 dark:border-slate-700 p-4 flex items-center justify-between bg-slate-50 dark:bg-slate-900">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setViewMode(false)}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
              !viewMode
                ? 'bg-blue-600 dark:bg-blue-500 text-white'
                : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-600'
            }`}
          >
            <Edit size={18} />
            Edit
          </button>
          <button
            onClick={() => setViewMode(true)}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
              viewMode
                ? 'bg-blue-600 dark:bg-blue-500 text-white'
                : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-600'
            }`}
          >
            <Eye size={18} />
            Preview
          </button>
        </div>

        <div className="flex items-center gap-2">
          {!isSaved && (
            <span className="text-sm text-red-600 dark:text-red-400 font-medium">Unsaved changes</span>
          )}
          <button
            onClick={handleSave}
            disabled={isSaved}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              isSaved
                ? 'bg-slate-200 dark:bg-slate-700 text-slate-400 dark:text-slate-500 cursor-not-allowed'
                : 'bg-green-600 hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600 text-white'
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
          className="border-b border-slate-200 dark:border-slate-700 px-6 py-3 text-lg font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:ring-inset bg-white dark:bg-slate-950 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500"
        />

        {/* Content Area */}
        <div className="flex-1 overflow-hidden">
          {!viewMode ? (
            <textarea
              value={content}
              onChange={handleContentChange}
              onKeyDown={handleKeyDown}
              placeholder="Start writing your journal entry... (Markdown is supported)"
              className="w-full h-full p-6 font-mono text-sm resize-none focus:outline-none border-none bg-white dark:bg-slate-950 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500"
            />
          ) : (
            <div className="w-full h-full p-6 overflow-y-auto">
              <h1 className="text-2xl font-bold mb-4 text-slate-900 dark:text-white">{title || 'Untitled'}</h1>
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
