export default defineNuxtRouteMiddleware((to) => {
  if (process.client) {
    // Перевіряємо, чи користувач на мобільному пристрої
    const userAgent = navigator.userAgent
    const isMobile = /Android|iPhone|iPad|iPod/i.test(userAgent)
    console.log(`user  :${userAgent}`)
    console.log(`mobile : ${isMobile}`)

    // Якщо не мобільний пристрій і ми не на сторінці попередження
    if (!isMobile && to.name !== "warning") {
      // Перенаправляємо на сторінку попередження
      return navigateTo("/warning")
    }
  }
})
