// ~/middleware/redirectToWarning.global.ts
export default defineNuxtRouteMiddleware((to) => {
  // Виконуємо тільки на клієнті
  if (!process.client) return

  const nuxtApp = useNuxtApp()

  // Отримуємо локаль як рядок
  const locale = nuxtApp.$i18n?.locale?.value || "ua"

  // Дані про пристрій
  const { userAgent, platform } = navigator
  const width = window.innerWidth
  const height = window.innerHeight

  const isMobileUA =
    /Android|iPhone|iPod|Tablet|PlayBook|Silk|Kindle|Touch/i.test(userAgent)
  const isIPadOS13Plus = platform === "MacIntel" && "ontouchend" in document
  const isPortrait = height >= width
  const isTouchDevice = "ontouchend" in document
  const isTabletSize = isPortrait
    ? width >= 600 && width <= 1024
    : height >= 600 && height <= 1024

  const isMobileOrTablet = isMobileUA || isIPadOS13Plus || (isTouchDevice && isTabletSize)

  // Шлях до сторінки warning для поточної локалі
  const warningPath = `/${locale}/warning`

  // Якщо не мобільний/планшет і ми ще не на warning
  if (!isMobileOrTablet && to.fullPath !== warningPath) {
    return navigateTo(warningPath)
  }
})
