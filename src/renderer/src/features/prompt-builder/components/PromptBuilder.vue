<script setup lang="ts">
import { ref } from 'vue'
import { usePromptStore } from '../stores/prompt'
import ContextStack from './ContextStack.vue'

const store = usePromptStore()
const copied = ref(false)

async function handleCopy(): Promise<void> {
  await store.copyToClipboard()
  copied.value = true
  setTimeout(() => { copied.value = false }, 2000)
}

function formatCount(n: number): string {
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k`
  return String(n)
}
</script>

<template>
  <div class="flex flex-col h-full">
    <!-- Context stack (top) -->
    <ContextStack />

    <!-- Spacer / empty state when no project selected -->
    <div v-if="!store.hasContext && store.contextEntries.length === 0" class="flex-1" />
    <div v-else class="flex-1" />

    <!-- Input area (bottom) -->
    <div class="border-t border-white/10 px-4 pt-3 pb-4 flex flex-col gap-3">
      <textarea
        v-model="store.userQuery"
        placeholder="Enter your instructions or question..."
        rows="4"
        class="w-full bg-neutral-900 border border-white/10 rounded-md px-3 py-2 text-sm text-neutral-200 placeholder-neutral-600 resize-none focus:outline-none focus:border-indigo-500/60 transition-colors duration-100"
      />

      <!-- Action row -->
      <div class="flex items-center justify-between gap-3">
        <!-- Metrics -->
        <div class="flex items-center gap-3 text-xs text-neutral-500">
          <span>
            <span class="text-neutral-400 font-medium">{{ formatCount(store.totalCharCount) }}</span>
            &nbsp;chars
          </span>
          <span class="text-neutral-700">·</span>
          <span>
            <span class="text-neutral-400 font-medium">~{{ formatCount(store.totalTokenEstimate) }}</span>
            &nbsp;tokens
          </span>
          <span v-if="store.isAssembling" class="text-neutral-600 italic">building...</span>
        </div>

        <!-- Copy button -->
        <button
          :disabled="!store.hasContext && !store.userQuery.trim()"
          class="flex items-center gap-1.5 px-4 py-1.5 rounded-md text-sm font-medium transition-all duration-100"
          :class="[
            copied
              ? 'bg-green-600 text-white'
              : store.hasContext || store.userQuery.trim()
                ? 'bg-indigo-600 hover:bg-indigo-500 text-white cursor-pointer'
                : 'bg-neutral-800 text-neutral-500 cursor-not-allowed'
          ]"
          @click="handleCopy"
        >
          <!-- Check icon when copied -->
          <svg v-if="copied" xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
          <!-- Copy icon -->
          <svg v-else xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
            <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/>
          </svg>
          {{ copied ? 'Copied!' : 'Copy Prompt' }}
        </button>
      </div>
    </div>
  </div>
</template>
