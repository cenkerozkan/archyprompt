import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'

const api = {
  listProjects: (): Promise<Project[]> => ipcRenderer.invoke('projects:list'),
  addProject: (): Promise<Project[]> => ipcRenderer.invoke('projects:add'),
  deleteProjects: (ids: string[]): Promise<Project[]> => ipcRenderer.invoke('projects:delete', ids)
}

if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', api)
  } catch (error) {
    console.error(error)
  }
} else {
  window.electron = electronAPI
  window.api = api
}
