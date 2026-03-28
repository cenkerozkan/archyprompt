<script setup lang="ts">
import type { Project } from '../types'
import ProjectListItem from './ProjectListItem.vue'

defineProps<{
  projects: Project[]
  isEditing: boolean
  selectedIds: Set<string>
}>()

const emit = defineEmits<{
  toggle: [id: string]
  select: [project: Project]
}>()
</script>

<template>
  <div class="flex-1 overflow-y-auto px-2 py-1 min-h-0">
    <p v-if="projects.length === 0" class="text-xs text-neutral-500 text-center mt-6 px-3">
      No projects yet. Add a folder to get started.
    </p>
    <ProjectListItem
      v-for="project in projects"
      :key="project.id"
      :project="project"
      :is-editing="isEditing"
      :is-selected="selectedIds.has(project.id)"
      @toggle="emit('toggle', $event)"
      @select="emit('select', $event)"
    />
  </div>
</template>
