export interface ContextEntry {
  path: string
  name: string
  isDirectory: boolean
  extension: string   // e.g. '.ts', '.vue', '' for folders
}
