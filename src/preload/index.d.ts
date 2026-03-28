import { ElectronAPI } from '@electron-toolkit/preload'

interface Project {
  id: string
  path: string
  name: string
}

interface ProjectAPI {
  listProjects(): Promise<Project[]>
  addProject(): Promise<Project[]>
  deleteProjects(ids: string[]): Promise<Project[]>
}

declare global {
  interface Window {
    electron: ElectronAPI
    api: ProjectAPI
  }
}
