// ~/composables/useClickOutside.js
import { onMounted, onBeforeUnmount } from "vue"

export function useClickOutside(elementRef, callback) {
  const handler = (event) => {
    if (!elementRef.value) return
    if (!elementRef.value.contains(event.target)) {
      callback()
    }
  }

  onMounted(() => {
    document.addEventListener("click", handler)
  })

  onBeforeUnmount(() => {
    document.removeEventListener("click", handler)
  })
}
