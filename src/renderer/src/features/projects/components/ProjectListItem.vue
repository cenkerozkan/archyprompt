<script setup lang="ts">
import type { Project } from '../types'

defineProps<{
  project: Project
  isEditing: boolean
  isSelected: boolean
}>()

const emit = defineEmits<{
  toggle: [id: string]
  select: [project: Project]
}>()

function handleRowClick(isEditing: boolean, project: Project): void {
  if (isEditing) {
    emit('toggle', project.id)
  } else {
    emit('select', project)
  }
}
</script>

<template>
  <div
    class="flex items-center gap-2 px-3 py-2 rounded-md cursor-pointer select-none transition-colors duration-100"
    :class="[isSelected ? 'bg-white/10' : 'hover:bg-white/5']"
    @click="handleRowClick(isEditing, project)"
  >
    <input
      v-if="isEditing"
      type="checkbox"
      :checked="isSelected"
      class="w-4 h-4 accent-indigo-400 cursor-pointer flex-shrink-0"
      @change="emit('toggle', project.id)"
      @click.stop
    />
    <span class="text-sm text-neutral-200 truncate">{{ project.name }}</span>
  </div>
</template>
