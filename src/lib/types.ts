export interface Folder {
  id: string
  name: string
  createdAt: number
  updatedAt: number
}

export interface JournalEntry {
  id: string
  title: string
  content: string
  createdAt: number
  updatedAt: number
  folderId?: string
}

export type JournalEntries = JournalEntry[]
export type Folders = Folder[]
