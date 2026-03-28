<script setup lang="ts">
import { ref, computed } from 'vue'
import { useProjectsStore } from '../stores/projects'
import ProjectList from './ProjectList.vue'
import AddProjectButton from './AddProjectButton.vue'

const store = useProjectsStore()
const isEditing = ref(false)

const hasSelection = computed(() => store.selectedIds.size > 0)

function enterEditMode(): void {
  store.clearSelected()
  isEditing.value = true
}

function exitEditMode(): void {
  store.clearSelected()
  isEditing.value = false
}

async function handleDeleteSelected(): Promise<void> {
  const ids = Array.from(store.selectedIds)
  if (ids.length === 0) return
  await store.deleteProjects(ids)
  isEditing.value = false
}
</script>

<template>
  <aside class="flex flex-col h-full bg-neutral-900 border-r border-white/10 w-64 flex-shrink-0">
    <!-- Header -->
    <div class="flex items-center justify-between px-4 py-3 border-b border-white/10">
      <span class="text-sm font-semibold text-neutral-100 tracking-wide">Projects</span>
      <button
        v-if="!isEditing"
        title="Edit projects"
        class="p-1 rounded text-neutral-400 hover:text-white hover:bg-white/10 transition-colors duration-100"
        @click="enterEditMode"
      >
        <!-- Pencil icon -->
        <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
        </svg>
      </button>
      <button
        v-else
        title="Cancel editing"
        class="p-1 rounded text-neutral-400 hover:text-white hover:bg-white/10 transition-colors duration-100"
        @click="exitEditMode"
      >
        <!-- X icon -->
        <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <line x1="18" y1="6" x2="6" y2="18"/>
          <line x1="6" y1="6" x2="18" y2="18"/>
        </svg>
      </button>
    </div>

    <!-- Project list -->
    <ProjectList
      :projects="store.projects"
      :is-editing="isEditing"
      :selected-ids="store.selectedIds"
      @toggle="store.toggleSelected($event)"
    />

    <!-- Bottom actions -->
    <div class="px-3 py-3 border-t border-white/10">
      <button
        v-if="isEditing"
        :disabled="!hasSelection"
        class="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-100"
        :class="[
          hasSelection
            ? 'bg-red-600 hover:bg-red-500 text-white cursor-pointer'
            : 'bg-neutral-800 text-neutral-500 cursor-not-allowed'
        ]"
        @click="handleDeleteSelected"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="3 6 5 6 21 6"/>
          <path d="M19 6l-1 14H6L5 6"/>
          <path d="M10 11v6"/>
          <path d="M14 11v6"/>
          <path d="M9 6V4h6v2"/>
        </svg>
        Delete Selected
      </button>
      <AddProjectButton v-else @add="store.addProject()" />
    </div>
  </aside>
</template>
