import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Project, FileTreeEntry } from '../types'

export const useProjectsStore = defineStore('projects', () => {
  // --- Project list state ---
  const projects = ref<Project[]>([])
  const selectedIds = ref<Set<string>>(new Set())
  const error = ref<string | null>(null)

  // --- File tree state ---
  const activeProject = ref<Project | null>(null)
  const directoryCache = ref<Map<string, FileTreeEntry[]>>(new Map())
  const expandedPaths = ref<Set<string>>(new Set())
  const loadingPaths = ref<Set<string>>(new Set())

  const rootEntries = computed<FileTreeEntry[]>(() => {
    if (!activeProject.value) return []
    return directoryCache.value.get(activeProject.value.path) ?? []
  })

  // --- Project list actions ---
  async function fetchProjects(): Promise<void> {
    try {
      projects.value = await window.api.listProjects()
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Failed to load projects'
    }
  }

  async function addProject(): Promise<void> {
    try {
      projects.value = await window.api.addProject()
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Failed to add project'
    }
  }

  async function deleteProjects(ids: string[]): Promise<void> {
    try {
      projects.value = await window.api.deleteProjects(ids)
      clearSelected()
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Failed to delete projects'
    }
  }

  function toggleSelected(id: string): void {
    if (selectedIds.value.has(id)) {
      selectedIds.value.delete(id)
    } else {
      selectedIds.value.add(id)
    }
  }

  function clearSelected(): void {
    selectedIds.value = new Set()
  }

  // --- File tree actions ---
  async function loadDirectory(dirPath: string): Promise<void> {
    if (loadingPaths.value.has(dirPath)) return
    loadingPaths.value.add(dirPath)
    try {
      const entries = await window.api.readDirectory(dirPath)
      const newCache = new Map(directoryCache.value)
      newCache.set(dirPath, entries)
      directoryCache.value = newCache
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Failed to read directory'
    } finally {
      const newLoading = new Set(loadingPaths.value)
      newLoading.delete(dirPath)
      loadingPaths.value = newLoading
    }
  }

  async function selectProject(project: Project): Promise<void> {
    activeProject.value = project
    directoryCache.value = new Map()
    expandedPaths.value = new Set()
    loadingPaths.value = new Set()
    await loadDirectory(project.path)
  }

  function deselectProject(): void {
    activeProject.value = null
    directoryCache.value = new Map()
    expandedPaths.value = new Set()
    loadingPaths.value = new Set()
  }

  async function toggleDirectory(dirPath: string): Promise<void> {
    const newExpanded = new Set(expandedPaths.value)
    if (newExpanded.has(dirPath)) {
      newExpanded.delete(dirPath)
      expandedPaths.value = newExpanded
    } else {
      newExpanded.add(dirPath)
      expandedPaths.value = newExpanded
      if (!directoryCache.value.has(dirPath)) {
        await loadDirectory(dirPath)
      }
    }
  }

  return {
    // Project list
    projects,
    selectedIds,
    error,
    fetchProjects,
    addProject,
    deleteProjects,
    toggleSelected,
    clearSelected,
    // File tree
    activeProject,
    directoryCache,
    expandedPaths,
    loadingPaths,
    rootEntries,
    selectProject,
    deselectProject,
    toggleDirectory,
    loadDirectory
  }
})
