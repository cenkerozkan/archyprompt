import { ElectronAPI } from '@electron-toolkit/preload'

interface Project {
  id: string
  path: string
  name: string
}

interface FileTreeEntry {
  name: string
  path: string
  isDirectory: boolean
}

interface SelectedEntry {
  path: string
  isDirectory: boolean
}

interface AssembleResult {
  xml: string
  charCount: number
  tokenEstimate: number
}

interface ProjectAPI {
  listProjects(): Promise<Project[]>
  addProject(): Promise<Project[]>
  deleteProjects(ids: string[]): Promise<Project[]>
  readDirectory(dirPath: string): Promise<FileTreeEntry[]>
  assemblePrompt(entries: SelectedEntry[]): Promise<AssembleResult>
}

declare global {
  interface Window {
    electron: ElectronAPI
    api: ProjectAPI
  }
}
