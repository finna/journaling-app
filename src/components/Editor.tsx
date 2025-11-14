'use client'

import { JournalEntry } from '@/lib/types'
import Markdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { useState, useEffect } from 'react'
import { Eye, Edit, Sparkles } from 'lucide-react'
import AIAnalysis from './AIAnalysis'

interface EditorProps {
  entry: JournalEntry | null
  onSave: (entry: JournalEntry) => void
}

export default function Editor({ entry, onSave }: EditorProps) {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [viewMode, setViewMode] = useState(false)
  const [isSaved, setIsSaved] = useState(true)
  const [isAnalysisOpen, setIsAnalysisOpen] = useState(false)

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
    <div className="flex-1 flex flex-col bg-neutral-950">
      {/* Toolbar */}
      <div className="border-b border-neutral-900 p-4 flex items-center justify-between bg-neutral-950">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setViewMode(false)}
            className={`flex items-center gap-2 px-3 py-2 rounded transition-colors duration-200 font-medium text-sm ${
              !viewMode
                ? 'bg-neutral-900 text-neutral-100 border border-neutral-800'
                : 'bg-neutral-950 text-neutral-400 hover:text-neutral-200 border border-neutral-900 hover:border-neutral-800'
            }`}
          >
            <Edit size={16} />
            Edit
          </button>
          <button
            onClick={() => setViewMode(true)}
            className={`flex items-center gap-2 px-3 py-2 rounded transition-colors duration-200 font-medium text-sm ${
              viewMode
                ? 'bg-neutral-900 text-neutral-100 border border-neutral-800'
                : 'bg-neutral-950 text-neutral-400 hover:text-neutral-200 border border-neutral-900 hover:border-neutral-800'
            }`}
          >
            <Eye size={16} />
            Preview
          </button>
        </div>

        <div className="flex items-center gap-3">
          {!isSaved && (
            <span className="text-xs text-neutral-500 font-medium">Unsaved</span>
          )}
          <button
            onClick={() => setIsAnalysisOpen(true)}
            disabled={!content.trim()}
            title="Analyze with AI"
            className={`flex items-center gap-2 px-3 py-2 rounded transition-colors duration-200 font-medium text-sm ${
              !content.trim()
                ? 'bg-neutral-950 text-neutral-700 cursor-not-allowed border border-neutral-900'
                : 'bg-neutral-900 hover:bg-neutral-800 text-neutral-100 border border-neutral-800 hover:border-neutral-700'
            }`}
          >
            <Sparkles size={16} />
            Analyze
          </button>
          <button
            onClick={handleSave}
            disabled={isSaved}
            className={`px-3 py-2 rounded transition-colors duration-200 font-medium text-sm ${
              isSaved
                ? 'bg-neutral-950 text-neutral-700 cursor-not-allowed border border-neutral-900'
                : 'bg-neutral-900 hover:bg-neutral-800 text-neutral-100 border border-neutral-800 hover:border-neutral-700'
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
          className="border-b border-neutral-900 px-6 py-4 text-2xl font-light bg-transparent text-neutral-50 placeholder-neutral-700 focus:outline-none focus:ring-0 focus:border-neutral-800 transition-colors"
        />

        {/* Content Area */}
        <div className="flex-1 overflow-hidden">
          {!viewMode ? (
            <textarea
              value={content}
              onChange={handleContentChange}
              onKeyDown={handleKeyDown}
              placeholder="Start writing your journal entry... (Markdown is supported)"
              className="w-full h-full p-6 font-mono text-sm text-neutral-300 bg-transparent resize-none focus:outline-none border-none placeholder-neutral-700"
            />
          ) : (
            <div className="w-full h-full p-6 overflow-y-auto">
              <div className="prose prose-sm max-w-none">
                <Markdown remarkPlugins={[remarkGfm]}>{content}</Markdown>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* AI Analysis Modal */}
      <AIAnalysis
        title={title}
        content={content}
        isOpen={isAnalysisOpen}
        onClose={() => setIsAnalysisOpen(false)}
      />
    </div>
  )
}
