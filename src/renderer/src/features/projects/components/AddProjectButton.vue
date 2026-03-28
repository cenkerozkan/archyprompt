<script setup lang="ts">
const emit = defineEmits<{
  add: []
}>()
</script>

<template>
  <button
    class="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-md text-sm text-neutral-300 hover:bg-white/5 hover:text-white transition-colors duration-100 border border-white/10 hover:border-white/20"
    @click="emit('add')"
  >
    <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/>
      <line x1="12" y1="11" x2="12" y2="17"/>
      <line x1="9" y1="14" x2="15" y2="14"/>
    </svg>
    Add New Project
  </button>
</template>
