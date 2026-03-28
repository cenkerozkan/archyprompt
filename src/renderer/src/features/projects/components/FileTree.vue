<script setup lang="ts">
import { useProjectsStore } from '../stores/projects'
import FileTreeNode from './FileTreeNode.vue'

const store = useProjectsStore()
</script>

<template>
  <div class="flex flex-col h-full">
    <!-- Header -->
    <div class="flex items-center gap-2 px-3 py-3 border-b border-white/10 min-w-0">
      <button
        title="Back to projects"
        class="p-1 rounded text-neutral-400 hover:text-white hover:bg-white/10 transition-colors duration-100 shrink-0"
        @click="store.deselectProject()"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="15 18 9 12 15 6" />
        </svg>
      </button>
      <span class="text-sm font-semibold text-neutral-100 truncate">
        {{ store.activeProject?.name }}
      </span>
    </div>

    <!-- Tree content — scrolls both axes -->
    <div class="flex-1 overflow-y-auto overflow-x-auto min-h-0 py-1">
      <div class="min-w-max">
        <FileTreeNode
          v-for="entry in store.rootEntries"
          :key="entry.path"
          :entry="entry"
          :depth="0"
        />
        <p
          v-if="store.rootEntries.length === 0 && !store.loadingPaths.has(store.activeProject?.path ?? '')"
          class="text-xs text-neutral-500 text-center mt-6 px-4"
        >
          Empty directory
        </p>
      </div>
    </div>
  </div>
</template>
