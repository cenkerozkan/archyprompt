<script setup lang="ts">
import { usePromptStore } from '../stores/prompt'
import ContextCard from './ContextCard.vue'

const store = usePromptStore()
</script>

<template>
  <div class="px-4 py-3 border-b border-white/10">
    <!-- Header -->
    <div class="flex items-center justify-between mb-2">
      <span class="text-xs font-medium text-neutral-400 uppercase tracking-wider">Context</span>
      <button
        v-if="store.hasContext"
        class="text-xs text-neutral-500 hover:text-neutral-300 transition-colors duration-100"
        @click="store.clearEntries()"
      >
        Clear all
      </button>
    </div>

    <!-- Cards -->
    <div v-if="store.hasContext" class="flex flex-wrap gap-2">
      <ContextCard
        v-for="entry in store.contextEntries"
        :key="entry.path"
        :entry="entry"
        @remove="store.removeEntry($event)"
      />
    </div>

    <!-- Empty state -->
    <p v-else class="text-xs text-neutral-600">
      Select files or folders from the sidebar to add them to the context.
    </p>
  </div>
</template>
