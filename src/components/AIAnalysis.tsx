'use client'

import { useState } from 'react'
import { Sparkles, X, Loader } from 'lucide-react'

interface AIAnalysisProps {
  title: string
  content: string
  isOpen: boolean
  onClose: () => void
}

export default function AIAnalysis({ title, content, isOpen, onClose }: AIAnalysisProps) {
  const [analysis, setAnalysis] = useState<string>('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string>('')

  const handleAnalyze = async () => {
    setIsLoading(true)
    setError('')
    setAnalysis('')

    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, content }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || 'Failed to analyze entry')
        return
      }

      setAnalysis(data.analysis)
    } catch (err) {
      setError('Error connecting to analysis service')
      console.error('Analysis error:', err)
    } finally {
      setIsLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-gradient-to-br from-slate-900 to-slate-950 rounded-xl shadow-2xl max-w-2xl w-full mx-4 max-h-[80vh] overflow-hidden flex flex-col border border-slate-800">
        {/* Header */}
        <div className="border-b border-slate-800 p-5 flex items-center justify-between bg-gradient-to-r from-violet-500/20 to-pink-600/20">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-violet-500 to-pink-600 rounded-lg">
              <Sparkles size={20} className="text-white" />
            </div>
            <h2 className="text-xl font-bold bg-gradient-to-r from-violet-400 to-pink-400 bg-clip-text text-transparent">AI Analysis</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-slate-700/50 rounded-lg transition-colors text-slate-400 hover:text-slate-200"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {!analysis && !isLoading && !error && (
            <div className="text-center py-12">
              <p className="text-slate-300 mb-6 text-lg">
                Let AI analyze your journal entry for insights about mood, themes, and patterns.
              </p>
              <button
                onClick={handleAnalyze}
                className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-violet-500 to-pink-600 hover:from-violet-400 hover:to-pink-500 text-white rounded-lg transition-all font-semibold shadow-lg hover:shadow-violet-500/30 mx-auto"
              >
                <Sparkles size={18} />
                Analyze Entry
              </button>
            </div>
          )}

          {isLoading && (
            <div className="flex flex-col items-center justify-center py-12">
              <Loader size={40} className="text-violet-500 animate-spin mb-4" />
              <p className="text-slate-300 text-lg">Analyzing your entry...</p>
            </div>
          )}

          {error && (
            <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-5 text-red-300">
              <p className="font-bold mb-2 text-red-200">Error</p>
              <p className="text-sm mb-4">{error}</p>
              <button
                onClick={handleAnalyze}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors text-sm font-semibold"
              >
                Try Again
              </button>
            </div>
          )}

          {analysis && (
            <div className="prose prose-sm max-w-none">
              <div className="text-slate-200 whitespace-pre-wrap leading-relaxed">
                {analysis}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        {analysis && (
          <div className="border-t border-slate-800 p-4 bg-slate-900/50 flex gap-3">
            <button
              onClick={handleAnalyze}
              className="flex-1 px-4 py-2 bg-gradient-to-r from-violet-500 to-pink-600 hover:from-violet-400 hover:to-pink-500 text-white rounded-lg transition-all font-semibold text-sm shadow-lg hover:shadow-violet-500/30"
            >
              Analyze Again
            </button>
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg transition-colors font-semibold text-sm border border-slate-700"
            >
              Close
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
