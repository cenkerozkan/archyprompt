import { readdirSync } from 'fs'
import { join } from 'path'

export interface FileTreeEntry {
  name: string
  path: string
  isDirectory: boolean
}

const IGNORED_NAMES = new Set([
  'node_modules',
  '.git',
  '__pycache__',
  '.DS_Store',
  '.venv',
  'venv',
  'dist',
  'build',
  '.next',
  '.nuxt',
  '.cache',
  'coverage',
  '.idea',
  '.vscode',
  '.svn',
  '.hg',
  'Thumbs.db',
  '.parcel-cache',
  '.turbo',
  'out',
  '.expo'
])

export function readDirectoryContents(dirPath: string): FileTreeEntry[] {
  try {
    const entries = readdirSync(dirPath, { withFileTypes: true })

    const result: FileTreeEntry[] = []

    for (const entry of entries) {
      if (IGNORED_NAMES.has(entry.name)) continue
      if (entry.name.startsWith('.') && entry.isFile()) continue

      result.push({
        name: entry.name,
        path: join(dirPath, entry.name),
        isDirectory: entry.isDirectory()
      })
    }

    result.sort((a, b) => {
      if (a.isDirectory !== b.isDirectory) {
        return a.isDirectory ? -1 : 1
      }
      return a.name.toLowerCase().localeCompare(b.name.toLowerCase())
    })

    return result
  } catch {
    return []
  }
}
