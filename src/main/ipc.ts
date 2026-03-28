import { ipcMain, dialog } from 'electron'
import { loadProjects, addProject, deleteProjects } from './store'

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
}
