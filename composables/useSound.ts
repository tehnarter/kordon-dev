import { ref, onMounted } from "vue"

export const useSound = () => {
  const isMuted = ref<boolean>(false)

  const initSound = () => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("mute_state")
      isMuted.value = stored === "true"
    }
  }

  const toggleSound = () => {
    isMuted.value = !isMuted.value
    localStorage.setItem("mute_state", String(isMuted.value))
  }

  onMounted(initSound)

  return { isMuted, toggleSound }
}
