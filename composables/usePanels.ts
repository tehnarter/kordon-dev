import { ref } from "vue"

const isMenuOpen = ref(false)
const isSocialOpen = ref(false)
const gestureLock = ref<"menu" | "social" | null>(null)

export function usePanels() {
  return { isMenuOpen, isSocialOpen, gestureLock }
}
