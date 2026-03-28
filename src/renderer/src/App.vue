<script setup lang="ts">
import { onMounted } from 'vue'
import { useProjectsStore } from './features/projects/stores/projects'
import AppSidebar from './features/projects/components/AppSidebar.vue'
import PromptBuilder from './features/prompt-builder/components/PromptBuilder.vue'

const projectsStore = useProjectsStore()

onMounted(() => {
  projectsStore.fetchProjects()
})
</script>

<template>
  <div class="flex h-screen w-screen overflow-hidden bg-neutral-950 text-white">
    <AppSidebar />
    <main class="flex-1 min-w-0 overflow-hidden">
      <PromptBuilder v-if="projectsStore.activeProject" />
      <div v-else class="flex h-full items-center justify-center">
        <p class="text-neutral-600 text-sm">Select a project to get started</p>
      </div>
    </main>
  </div>
</template>
