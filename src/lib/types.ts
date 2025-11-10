export type EntryColor = 'blue' | 'red' | 'yellow' | 'green' | 'purple' | 'orange'

export interface JournalEntry {
  id: string
  title: string
  content: string
  createdAt: number
  updatedAt: number
  color?: EntryColor
}

export type JournalEntries = JournalEntry[]

export const COLOR_OPTIONS: { color: EntryColor; label: string; bgClass: string; textClass: string; borderClass: string }[] = [
  { color: 'blue', label: 'Blue', bgClass: 'bg-blue-100', textClass: 'text-blue-700', borderClass: 'border-blue-300' },
  { color: 'red', label: 'Red', bgClass: 'bg-red-100', textClass: 'text-red-700', borderClass: 'border-red-300' },
  { color: 'yellow', label: 'Yellow', bgClass: 'bg-yellow-100', textClass: 'text-yellow-700', borderClass: 'border-yellow-300' },
  { color: 'green', label: 'Green', bgClass: 'bg-green-100', textClass: 'text-green-700', borderClass: 'border-green-300' },
  { color: 'purple', label: 'Purple', bgClass: 'bg-purple-100', textClass: 'text-purple-700', borderClass: 'border-purple-300' },
  { color: 'orange', label: 'Orange', bgClass: 'bg-orange-100', textClass: 'text-orange-700', borderClass: 'border-orange-300' },
]
