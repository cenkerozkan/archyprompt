import { ipcMain, dialog } from 'electron'
import { loadProjects, addProject, deleteProjects } from './store'
import { readDirectoryContents } from './filesystem'

export function registerIpcHandlers(): void {
  ipcMain.handle('projects:list', () => {
    return loadProjects()
  })

  ipcMain.handle('projects:add', async () => {
    const result = await dialog.showOpenDialog({
      properties: ['openDirectory'],
      title: 'Select Project Folder'
    })
    if (result.canceled || result.filePaths.length === 0) {
      return loadProjects()
    }
    return addProject(result.filePaths[0])
  })

  ipcMain.handle('projects:delete', (_event, ids: string[]) => {
    return deleteProjects(ids)
  })

  ipcMain.handle('fs:readDirectory', (_event, dirPath: string) => {
    const projects = loadProjects()
    const isAllowed = projects.some(
      (p) => dirPath === p.path || dirPath.startsWith(p.path + require('path').sep)
    )
    if (!isAllowed) return []
    return readDirectoryContents(dirPath)
  })
}
