import { app } from 'electron'
import { join } from 'path'
import { readFileSync, writeFileSync, renameSync, existsSync } from 'fs'
import { randomUUID } from 'crypto'
import { basename } from 'path'

export interface Project {
  id: string
  path: string
  name: string
}

function getStorePath(): string {
  return join(app.getPath('userData'), 'projects.json')
}

export function loadProjects(): Project[] {
  const storePath = getStorePath()
  if (!existsSync(storePath)) return []
  try {
    const raw = readFileSync(storePath, 'utf-8')
    return JSON.parse(raw) as Project[]
  } catch {
    return []
  }
}

export function saveProjects(projects: Project[]): void {
  const storePath = getStorePath()
  const tmpPath = storePath + '.tmp'
  writeFileSync(tmpPath, JSON.stringify(projects, null, 2), 'utf-8')
  renameSync(tmpPath, storePath)
}

export function addProject(folderPath: string): Project[] {
  const projects = loadProjects()
  if (projects.some((p) => p.path === folderPath)) return projects
  const newProject: Project = {
    id: randomUUID(),
    path: folderPath,
    name: basename(folderPath)
  }
  const updated = [...projects, newProject]
  saveProjects(updated)
  return updated
}

export function deleteProjects(ids: string[]): Project[] {
  const projects = loadProjects()
  const updated = projects.filter((p) => !ids.includes(p.id))
  saveProjects(updated)
  return updated
}
