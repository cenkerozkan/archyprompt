<script setup lang="ts">
import { onMounted } from 'vue'
import { useProjectsStore } from './features/projects/stores/projects'
import AppSidebar from './features/projects/components/AppSidebar.vue'

const projectsStore = useProjectsStore()

onMounted(() => {
  projectsStore.fetchProjects()
})
</script>

<template>
  <div class="flex h-screen w-screen overflow-hidden bg-neutral-950 text-white">
    <AppSidebar />
    <main class="flex-1 flex items-center justify-center">
      <p class="text-neutral-600 text-sm">Select a project to get started</p>
    </main>
  </div>
</template>
