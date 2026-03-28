import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Project } from '../types'

export const useProjectsStore = defineStore('projects', () => {
  const projects = ref<Project[]>([])
  const selectedIds = ref<Set<string>>(new Set())

  async function fetchProjects(): Promise<void> {
    projects.value = await window.api.listProjects()
  }

  async function addProject(): Promise<void> {
    projects.value = await window.api.addProject()
  }

  async function deleteProjects(ids: string[]): Promise<void> {
    projects.value = await window.api.deleteProjects(ids)
    ids.forEach((id) => selectedIds.value.delete(id))
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

  return {
    projects,
    selectedIds,
    fetchProjects,
    addProject,
    deleteProjects,
    toggleSelected,
    clearSelected
  }
})
