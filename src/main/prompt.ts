import { readFileSync, readdirSync } from 'fs'
import { join, basename, extname } from 'path'

const IGNORED_NAMES = new Set([
  'node_modules', '.git', '__pycache__', '.DS_Store', '.venv', 'venv',
  'dist', 'build', '.next', '.nuxt', '.cache', 'coverage',
  '.idea', '.vscode', '.svn', '.hg', 'Thumbs.db',
  '.parcel-cache', '.turbo', 'out', '.expo'
])

const BINARY_EXTENSIONS = new Set([
  '.png', '.jpg', '.jpeg', '.gif', '.bmp', '.ico', '.svg',
  '.mp3', '.mp4', '.avi', '.mov', '.webm', '.ogg',
  '.zip', '.tar', '.gz', '.rar', '.7z',
  '.pdf', '.doc', '.docx', '.xls', '.xlsx',
  '.exe', '.dll', '.so', '.dylib', '.wasm',
  '.ttf', '.otf', '.woff', '.woff2', '.eot',
  '.lock'
])

function isBinary(filePath: string): boolean {
  return BINARY_EXTENSIONS.has(extname(filePath).toLowerCase())
}

function sanitizeTagName(name: string): string {
  return name.replace(/[^a-zA-Z0-9._-]/g, '_')
}

function readFileContent(filePath: string): string {
  if (isBinary(filePath)) return '[binary file]'
  try {
    return readFileSync(filePath, 'utf-8')
  } catch {
    return '[unreadable]'
  }
}

function buildFolderXml(folderPath: string, indent: string = ''): string {
  const folderName = sanitizeTagName(basename(folderPath))
  const lines: string[] = []
  lines.push(`${indent}<${folderName}>`)

  try {
    const entries = readdirSync(folderPath, { withFileTypes: true })

    const sorted = entries
      .filter((e) => !IGNORED_NAMES.has(e.name) && !(e.name.startsWith('.') && e.isFile()))
      .sort((a, b) => {
        const aDir = a.isDirectory()
        const bDir = b.isDirectory()
        if (aDir !== bDir) return aDir ? -1 : 1
        return a.name.toLowerCase().localeCompare(b.name.toLowerCase())
      })

    for (const entry of sorted) {
      const entryPath = join(folderPath, entry.name)
      if (entry.isDirectory()) {
        lines.push(buildFolderXml(entryPath, indent + '    '))
      } else {
        const tagName = sanitizeTagName(entry.name)
        const content = readFileContent(entryPath)
        lines.push(`${indent}    <${tagName}>${content}</${tagName}>`)
      }
    }
  } catch {
    lines.push(`${indent}    [permission denied]`)
  }

  lines.push(`${indent}</${folderName}>`)
  return lines.join('\n')
}

function buildFileXml(filePath: string): string {
  const tagName = sanitizeTagName(basename(filePath))
  const content = readFileContent(filePath)
  return `<${tagName}>${content}</${tagName}>`
}

export interface SelectedEntry {
  path: string
  isDirectory: boolean
}

export interface AssembleResult {
  xml: string
  charCount: number
  tokenEstimate: number
}

export function assemblePrompt(entries: SelectedEntry[]): AssembleResult {
  const parts: string[] = []

  for (const entry of entries) {
    if (entry.isDirectory) {
      parts.push(buildFolderXml(entry.path))
    } else {
      parts.push(buildFileXml(entry.path))
    }
  }

  const xml = parts.join('\n')
  const charCount = xml.length
  const tokenEstimate = Math.ceil(charCount / 4)

  return { xml, charCount, tokenEstimate }
}
