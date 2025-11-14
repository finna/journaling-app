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
      <div className="bg-neutral-900 rounded-lg max-w-2xl w-full mx-4 max-h-[80vh] overflow-hidden flex flex-col border border-neutral-800">
        {/* Header */}
        <div className="border-b border-neutral-800 p-5 flex items-center justify-between bg-neutral-950">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-neutral-800 rounded-lg">
              <Sparkles size={20} className="text-neutral-400" />
            </div>
            <h2 className="text-lg font-medium text-neutral-100">Analysis</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-neutral-800 rounded-lg transition-colors text-neutral-600 hover:text-neutral-400"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {!analysis && !isLoading && !error && (
            <div className="text-center py-12">
              <p className="text-neutral-400 mb-6 text-sm">
                Let AI analyze your journal entry for insights about mood, themes, and patterns.
              </p>
              <button
                onClick={handleAnalyze}
                className="flex items-center justify-center gap-2 px-6 py-2.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-100 rounded-lg transition-colors font-medium text-sm border border-neutral-700 hover:border-neutral-600 mx-auto"
              >
                <Sparkles size={16} />
                Analyze Entry
              </button>
            </div>
          )}

          {isLoading && (
            <div className="flex flex-col items-center justify-center py-12">
              <Loader size={40} className="text-neutral-600 animate-spin mb-4" />
              <p className="text-neutral-400 text-sm">Analyzing your entry...</p>
            </div>
          )}

          {error && (
            <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-5 text-neutral-400">
              <p className="font-medium mb-2 text-neutral-300">Error</p>
              <p className="text-sm mb-4">{error}</p>
              <button
                onClick={handleAnalyze}
                className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-neutral-100 rounded-lg transition-colors text-sm font-medium border border-neutral-700 hover:border-neutral-600"
              >
                Try Again
              </button>
            </div>
          )}

          {analysis && (
            <div className="prose prose-sm max-w-none">
              <div className="text-neutral-300 whitespace-pre-wrap leading-relaxed">
                {analysis}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        {analysis && (
          <div className="border-t border-neutral-800 p-4 bg-neutral-950 flex gap-3">
            <button
              onClick={handleAnalyze}
              className="flex-1 px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-neutral-100 rounded-lg transition-colors font-medium text-sm border border-neutral-700 hover:border-neutral-600"
            >
              Analyze Again
            </button>
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 bg-neutral-900 hover:bg-neutral-800 text-neutral-400 hover:text-neutral-300 rounded-lg transition-colors font-medium text-sm border border-neutral-800 hover:border-neutral-700"
            >
              Close
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
