<script setup lang="ts">
import { computed } from 'vue'
import { useProjectsStore } from '../stores/projects'
import { usePromptStore } from '../../prompt-builder/stores/prompt'
import type { FileTreeEntry } from '../types'

const props = defineProps<{
  entry: FileTreeEntry
  depth: number
}>()

const store = useProjectsStore()
const promptStore = usePromptStore()

const isExpanded = computed(() => store.expandedPaths.has(props.entry.path))
const isLoading = computed(() => store.loadingPaths.has(props.entry.path))
const children = computed(() => store.directoryCache.get(props.entry.path) ?? [])
const isChecked = computed(() => promptStore.hasEntry(props.entry.path))

function handleClick(): void {
  if (props.entry.isDirectory) {
    store.toggleDirectory(props.entry.path)
  }
}

function handleCheck(event: Event): void {
  event.stopPropagation()
  promptStore.toggleEntry(props.entry.path, props.entry.isDirectory)
}
</script>

<template>
  <div>
    <!-- Row -->
    <div
      class="flex items-center gap-1.5 py-1 px-2 rounded hover:bg-white/5 cursor-pointer select-none text-sm transition-colors duration-100 group"
      :class="entry.isDirectory ? 'text-neutral-200' : 'text-neutral-400'"
      :style="{ paddingLeft: `${8 + depth * 16}px` }"
      @click="handleClick"
    >
      <!-- Chevron for directories -->
      <svg
        v-if="entry.isDirectory"
        xmlns="http://www.w3.org/2000/svg"
        class="w-3 h-3 shrink-0 transition-transform duration-150 text-neutral-500"
        :class="isExpanded ? 'rotate-90' : ''"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <polyline points="9 18 15 12 9 6" />
      </svg>
      <!-- Spacer for files -->
      <span v-else class="w-3 h-3 shrink-0" />

      <!-- Loading spinner -->
      <svg
        v-if="isLoading"
        class="w-3.5 h-3.5 shrink-0 animate-spin text-neutral-500"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
      </svg>

      <!-- Folder icon -->
      <svg
        v-else-if="entry.isDirectory"
        xmlns="http://www.w3.org/2000/svg"
        class="w-3.5 h-3.5 shrink-0 text-indigo-400"
        viewBox="0 0 24 24"
        fill="currentColor"
      >
        <path d="M2 6a2 2 0 012-2h5l2 2h9a2 2 0 012 2v10a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" />
      </svg>

      <!-- File icon -->
      <svg
        v-else
        xmlns="http://www.w3.org/2000/svg"
        class="w-3.5 h-3.5 shrink-0 text-neutral-500"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
        <polyline points="14 2 14 8 20 8" />
      </svg>

      <span class="truncate flex-1">{{ entry.name }}</span>

      <!-- Checkbox (visible on hover or when checked) -->
      <input
        type="checkbox"
        :checked="isChecked"
        class="w-3.5 h-3.5 accent-indigo-400 cursor-pointer shrink-0 opacity-0 group-hover:opacity-100 transition-opacity duration-100"
        :class="{ 'opacity-100': isChecked }"
        @change="handleCheck"
        @click.stop
      />
    </div>

    <!-- Children (recursive) -->
    <template v-if="entry.isDirectory && isExpanded && !isLoading">
      <FileTreeNode
        v-for="child in children"
        :key="child.path"
        :entry="child"
        :depth="depth + 1"
      />
    </template>
  </div>
</template>
