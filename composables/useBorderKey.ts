import { ref, onMounted, watch } from "vue"

const borderKey = ref<string | null>(null)

export function useBorderKey() {
  // 🔹 Оновлення з localStorage
  const updateBorderKey = () => {
    if (process.client) {
      borderKey.value = localStorage.getItem("border-key")
    }
  }

  // 🔹 Ініціалізація + синхронізація з localStorage
  onMounted(() => {
    if (!process.client) return

    // при завантаженні сторінки
    updateBorderKey()

    // слухати зміни localStorage з інших вкладок
    window.addEventListener("storage", (e) => {
      if (e.key === "border-key") {
        borderKey.value = e.newValue
      }
    })
  })

  // 🔹 Реактивна синхронізація між ref і localStorage
  watch(borderKey, (newVal) => {
    if (!process.client) return
    if (newVal) localStorage.setItem("border-key", newVal)
    else localStorage.removeItem("border-key")
  })

  return { borderKey, updateBorderKey }
}

