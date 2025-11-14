export interface JournalEntry {
  id: string
  title: string
  content: string
  createdAt: number
  updatedAt: number
  folderId?: string
}

export type JournalEntries = JournalEntry[]

export interface Folder {
  id: string
  name: string
  color?: string
  createdAt: number
}

export type Folders = Folder[]
