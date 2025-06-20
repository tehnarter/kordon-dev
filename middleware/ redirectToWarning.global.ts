export default defineNuxtRouteMiddleware((to) => {
  if (!process.client) return

  const userAgent = navigator.userAgent
  const platform = navigator.platform
  const width = window.innerWidth
  const height = window.innerHeight

  const isMobileUA =
    /Android|iPhone|iPod|Tablet|PlayBook|Silk|Kindle|Touch/i.test(userAgent)

  // Додатково ловимо iPadOS 13+ (desktop UA + touch)
  const isIPadOS13Plus = platform === "MacIntel" && "ontouchend" in document

  // Орієнтація: portrait чи landscape
  const isPortrait = height >= width

  // Логіка для планшета:
  // - якщо iPadOS або мобільний UA, вважаємо планшетом/мобільним
  // - або, якщо це touch-пристрій, і розмір в межах діапазону планшета
  const isTouchDevice = "ontouchend" in document

  // Визначаємо розмірний діапазон для планшетів (у portrait і landscape)
  const isTabletSize = isPortrait
    ? width >= 600 && width <= 1024
    : height >= 600 && height <= 1024

  const isMobileOrTablet =
    isMobileUA || isIPadOS13Plus || (isTouchDevice && isTabletSize)

  console.log(`UA: ${userAgent}`)
  console.log(`Width: ${width}, Height: ${height}, Portrait: ${isPortrait}`)
  console.log(`isMobileOrTablet: ${isMobileOrTablet}`)

  if (!isMobileOrTablet && to.path !== "/warning") {
    return navigateTo("/warning")
  }
})
