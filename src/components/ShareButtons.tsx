'use client'

import { JournalEntry } from '@/lib/types'
import { Share2, Twitter, Facebook, Linkedin, MessageCircle, Mail } from 'lucide-react'
import { useState } from 'react'

interface ShareButtonsProps {
  entry: JournalEntry
}

export default function ShareButtons({ entry }: ShareButtonsProps) {
  const [showMenu, setShowMenu] = useState(false)

  // Generate share text - use first line as title, or a preview
  const getShareTitle = () => {
    const firstLine = entry.content.split('\n')[0].trim()
    return firstLine.substring(0, 100) || 'My Journal Entry'
  }

  // Get a short preview of the content
  const getSharePreview = () => {
    const text = entry.content.replace(/[#*_`\[\]()]/g, '').trim()
    return text.substring(0, 100)
  }

  const shareTitle = getShareTitle()
  const shareText = `"${shareTitle}" - from my journal`
  const shareUrl = typeof window !== 'undefined' ? window.location.href : ''

  // Social media share functions
  const shareHandlers = {
    twitter: () => {
      const text = encodeURIComponent(`${shareText}\n\n${shareUrl}`)
      window.open(
        `https://twitter.com/intent/tweet?text=${text}`,
        'twitter-share',
        'width=550,height=420'
      )
    },
    facebook: () => {
      window.open(
        `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
        'facebook-share',
        'width=550,height=420'
      )
    },
    linkedin: () => {
      const text = encodeURIComponent(shareText)
      window.open(
        `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}&title=${text}`,
        'linkedin-share',
        'width=550,height=420'
      )
    },
    whatsapp: () => {
      const text = encodeURIComponent(`${shareText}\n\n${shareUrl}`)
      window.open(
        `https://wa.me/?text=${text}`,
        'whatsapp-share'
      )
    },
    email: () => {
      const subject = encodeURIComponent(`Check out my journal entry: ${shareTitle}`)
      const body = encodeURIComponent(`${shareText}\n\n${shareUrl}\n\n---\nShared from my journal`)
      window.location.href = `mailto:?subject=${subject}&body=${body}`
    },
  }

  return (
    <div className="relative">
      {/* Share Button */}
      <button
        onClick={() => setShowMenu(!showMenu)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white text-slate-600 hover:bg-slate-100 border border-slate-200 transition-colors"
        title="Share this entry"
      >
        <Share2 size={18} />
        <span className="text-sm font-medium">Share</span>
      </button>

      {/* Share Menu */}
      {showMenu && (
        <div className="absolute top-full right-0 mt-2 bg-white border border-slate-200 rounded-lg shadow-lg z-50 w-max">
          <button
            onClick={() => {
              shareHandlers.twitter()
              setShowMenu(false)
            }}
            className="w-full flex items-center gap-3 px-4 py-3 text-left text-slate-700 hover:bg-slate-50 transition-colors border-b border-slate-100 last:border-b-0"
          >
            <Twitter size={18} className="text-blue-400" />
            <span className="text-sm font-medium">Twitter</span>
          </button>

          <button
            onClick={() => {
              shareHandlers.facebook()
              setShowMenu(false)
            }}
            className="w-full flex items-center gap-3 px-4 py-3 text-left text-slate-700 hover:bg-slate-50 transition-colors border-b border-slate-100 last:border-b-0"
          >
            <Facebook size={18} className="text-blue-600" />
            <span className="text-sm font-medium">Facebook</span>
          </button>

          <button
            onClick={() => {
              shareHandlers.linkedin()
              setShowMenu(false)
            }}
            className="w-full flex items-center gap-3 px-4 py-3 text-left text-slate-700 hover:bg-slate-50 transition-colors border-b border-slate-100 last:border-b-0"
          >
            <Linkedin size={18} className="text-blue-700" />
            <span className="text-sm font-medium">LinkedIn</span>
          </button>

          <button
            onClick={() => {
              shareHandlers.whatsapp()
              setShowMenu(false)
            }}
            className="w-full flex items-center gap-3 px-4 py-3 text-left text-slate-700 hover:bg-slate-50 transition-colors border-b border-slate-100 last:border-b-0"
          >
            <MessageCircle size={18} className="text-green-500" />
            <span className="text-sm font-medium">WhatsApp</span>
          </button>

          <button
            onClick={() => {
              shareHandlers.email()
              setShowMenu(false)
            }}
            className="w-full flex items-center gap-3 px-4 py-3 text-left text-slate-700 hover:bg-slate-50 transition-colors"
          >
            <Mail size={18} className="text-red-500" />
            <span className="text-sm font-medium">Email</span>
          </button>
        </div>
      )}
    </div>
  )
}
