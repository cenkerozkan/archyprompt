<script setup lang="ts">
import type { ContextEntry } from '../types'

defineProps<{ entry: ContextEntry }>()
const emit = defineEmits<{ remove: [path: string] }>()
</script>

<template>
  <div class="flex items-center gap-1.5 pl-2.5 pr-1.5 py-1.5 rounded-md bg-neutral-800 border border-white/10 hover:border-white/20 transition-colors duration-100 group max-w-48">
    <!-- Icon -->
    <svg
      v-if="entry.isDirectory"
      xmlns="http://www.w3.org/2000/svg"
      class="w-3.5 h-3.5 shrink-0 text-indigo-400"
      viewBox="0 0 24 24"
      fill="currentColor"
    >
      <path d="M2 6a2 2 0 012-2h5l2 2h9a2 2 0 012 2v10a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" />
    </svg>
    <svg
      v-else
      xmlns="http://www.w3.org/2000/svg"
      class="w-3.5 h-3.5 shrink-0 text-neutral-400"
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

    <!-- Labels -->
    <div class="flex flex-col min-w-0">
      <span class="text-xs text-neutral-200 truncate leading-tight">{{ entry.name }}</span>
      <span class="text-[10px] text-neutral-500 leading-tight">{{ entry.extension }}</span>
    </div>

    <!-- Remove button -->
    <button
      class="ml-0.5 p-0.5 rounded text-neutral-600 hover:text-neutral-300 hover:bg-white/10 transition-colors duration-100 shrink-0 opacity-0 group-hover:opacity-100"
      @click="emit('remove', entry.path)"
    >
      <svg xmlns="http://www.w3.org/2000/svg" class="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
        <line x1="18" y1="6" x2="6" y2="18"/>
        <line x1="6" y1="6" x2="18" y2="18"/>
      </svg>
    </button>
  </div>
</template>
