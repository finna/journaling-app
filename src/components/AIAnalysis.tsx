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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[80vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="border-b border-slate-200 p-4 flex items-center justify-between bg-gradient-to-r from-blue-50 to-indigo-50">
          <div className="flex items-center gap-2">
            <Sparkles size={20} className="text-blue-600" />
            <h2 className="text-lg font-semibold text-slate-900">AI Analysis</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-slate-200 rounded transition-colors"
          >
            <X size={20} className="text-slate-600" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {!analysis && !isLoading && !error && (
            <div className="text-center py-8">
              <p className="text-slate-600 mb-4">
                Let AI analyze your journal entry for insights about mood, themes, and patterns.
              </p>
              <button
                onClick={handleAnalyze}
                className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors mx-auto"
              >
                <Sparkles size={18} />
                Analyze Entry
              </button>
            </div>
          )}

          {isLoading && (
            <div className="flex flex-col items-center justify-center py-8">
              <Loader size={32} className="text-blue-600 animate-spin mb-4" />
              <p className="text-slate-600">Analyzing your entry...</p>
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
              <p className="font-semibold mb-2">Error</p>
              <p className="text-sm">{error}</p>
              <button
                onClick={handleAnalyze}
                className="mt-4 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded transition-colors text-sm"
              >
                Try Again
              </button>
            </div>
          )}

          {analysis && (
            <div className="prose prose-sm max-w-none">
              <div className="text-slate-700 whitespace-pre-wrap leading-relaxed">
                {analysis}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        {analysis && (
          <div className="border-t border-slate-200 p-4 bg-slate-50 flex gap-2">
            <button
              onClick={handleAnalyze}
              className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium text-sm"
            >
              Analyze Again
            </button>
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 bg-slate-300 hover:bg-slate-400 text-slate-900 rounded-lg transition-colors font-medium text-sm"
            >
              Close
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
