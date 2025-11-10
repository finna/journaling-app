export function formatDate(timestamp: number): string {
  const date = new Date(timestamp)
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export function truncateText(text: string, length: number = 50): string {
  if (text.length <= length) return text
  return text.substring(0, length).trim() + '...'
}

export function extractFirstLine(text: string): string {
  const lines = text.split('\n').filter((line) => line.trim())
  return lines[0] || 'Untitled'
}
