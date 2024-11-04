// middleware/mobile-only.js
import { useUserAgent } from "@vueuse/core"

export default defineNuxtRouteMiddleware(() => {
  const ua = useUserAgent()

  // Перевіряємо, чи це не мобільний пристрій
  if (!ua.isMobile) {
    return navigateTo("/mobile-only") // Перенаправляємо на сторінку з повідомленням
  }
})
