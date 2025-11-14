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
    <div className="flex-1 flex flex-col bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Toolbar */}
      <div className="border-b border-slate-800 p-4 flex items-center justify-between bg-slate-900/50 backdrop-blur-sm">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setViewMode(false)}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-200 font-medium ${
              !viewMode
                ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/20'
                : 'bg-slate-800 text-slate-300 hover:text-cyan-300 border border-slate-700 hover:border-cyan-500/30'
            }`}
          >
            <Edit size={18} />
            Edit
          </button>
          <button
            onClick={() => setViewMode(true)}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-200 font-medium ${
              viewMode
                ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/20'
                : 'bg-slate-800 text-slate-300 hover:text-cyan-300 border border-slate-700 hover:border-cyan-500/30'
            }`}
          >
            <Eye size={18} />
            Preview
          </button>
        </div>

        <div className="flex items-center gap-2">
          {!isSaved && (
            <span className="text-sm text-orange-400 font-semibold animate-pulse">Unsaved changes</span>
          )}
          <button
            onClick={() => setIsAnalysisOpen(true)}
            disabled={!content.trim()}
            title="Analyze with AI"
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-all duration-200 ${
              !content.trim()
                ? 'bg-slate-800 text-slate-600 cursor-not-allowed'
                : 'bg-gradient-to-r from-violet-500 to-pink-600 text-white hover:from-violet-400 hover:to-pink-500 shadow-lg hover:shadow-violet-500/30'
            }`}
          >
            <Sparkles size={18} />
            Analyze
          </button>
          <button
            onClick={handleSave}
            disabled={isSaved}
            className={`px-4 py-2 rounded-lg font-semibold transition-all duration-200 ${
              isSaved
                ? 'bg-slate-800 text-slate-600 cursor-not-allowed'
                : 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white hover:from-emerald-400 hover:to-teal-500 shadow-lg hover:shadow-emerald-500/30'
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
          className="border-b border-slate-800 px-6 py-4 text-2xl font-bold bg-transparent text-slate-100 placeholder-slate-600 focus:outline-none focus:ring-0 focus:border-cyan-500 transition-colors"
        />

        {/* Content Area */}
        <div className="flex-1 overflow-hidden">
          {!viewMode ? (
            <textarea
              value={content}
              onChange={handleContentChange}
              onKeyDown={handleKeyDown}
              placeholder="Start writing your journal entry... (Markdown is supported)"
              className="w-full h-full p-6 font-mono text-sm text-slate-200 bg-transparent resize-none focus:outline-none border-none placeholder-slate-600"
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
