export interface Project {
  id: string
  path: string
  name: string
}

export interface FileTreeEntry {
  name: string
  path: string
  isDirectory: boolean
}
