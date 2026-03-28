import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { ContextEntry } from '../types'

function getBasename(p: string): string {
  return p.split(/[\\/]/).pop() ?? p
}

function getExtname(name: string): string {
  const dot = name.lastIndexOf('.')
  return dot > 0 ? name.slice(dot) : ''
}

export const usePromptStore = defineStore('prompt', () => {
  // Ordered list of selected context entries
  const contextEntries = ref<ContextEntry[]>([])

  // User's query text
  const userQuery = ref('')

  // Assembled XML result from main process
  const assembledXml = ref('')
  const charCount = ref(0)
  const tokenEstimate = ref(0)
  const isAssembling = ref(false)
  const assembleError = ref<string | null>(null)

  const hasContext = computed(() => contextEntries.value.length > 0)

  const finalPrompt = computed(() => {
    const parts: string[] = []
    if (assembledXml.value) parts.push(assembledXml.value)
    if (userQuery.value.trim()) {
      parts.push(`<user_query>${userQuery.value}</user_query>`)
    }
    return parts.join('\n')
  })

  const totalCharCount = computed(() => {
    const queryPart = userQuery.value.trim()
      ? `\n<user_query>${userQuery.value}</user_query>`.length
      : 0
    return charCount.value + queryPart
  })

  const totalTokenEstimate = computed(() => Math.ceil(totalCharCount.value / 4))

  function addEntry(path: string, isDirectory: boolean): void {
    if (contextEntries.value.some((e) => e.path === path)) return
    const name = getBasename(path)
    const extension = isDirectory ? 'Folder' : (getExtname(name) || 'file')
    contextEntries.value.push({ path, name, isDirectory, extension })
    assemble()
  }

  function removeEntry(path: string): void {
    contextEntries.value = contextEntries.value.filter((e) => e.path !== path)
    assemble()
  }

  function toggleEntry(path: string, isDirectory: boolean): void {
    if (contextEntries.value.some((e) => e.path === path)) {
      removeEntry(path)
    } else {
      addEntry(path, isDirectory)
    }
  }

  function hasEntry(path: string): boolean {
    return contextEntries.value.some((e) => e.path === path)
  }

  function clearEntries(): void {
    contextEntries.value = []
    assembledXml.value = ''
    charCount.value = 0
    tokenEstimate.value = 0
  }

  async function assemble(): Promise<void> {
    if (contextEntries.value.length === 0) {
      assembledXml.value = ''
      charCount.value = 0
      tokenEstimate.value = 0
      return
    }
    isAssembling.value = true
    assembleError.value = null
    try {
      const result = await window.api.assemblePrompt(
        contextEntries.value.map((e) => ({ path: e.path, isDirectory: e.isDirectory }))
      )
      assembledXml.value = result.xml
      charCount.value = result.charCount
      tokenEstimate.value = result.tokenEstimate
    } catch (e) {
      assembleError.value = e instanceof Error ? e.message : 'Assembly failed'
    } finally {
      isAssembling.value = false
    }
  }

  async function copyToClipboard(): Promise<void> {
    if (!finalPrompt.value) return
    await navigator.clipboard.writeText(finalPrompt.value)
  }

  return {
    contextEntries,
    userQuery,
    assembledXml,
    charCount,
    tokenEstimate,
    isAssembling,
    assembleError,
    hasContext,
    finalPrompt,
    totalCharCount,
    totalTokenEstimate,
    addEntry,
    removeEntry,
    toggleEntry,
    hasEntry,
    clearEntries,
    assemble,
    copyToClipboard
  }
})
