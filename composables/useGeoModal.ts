// composables/useGeoModal.ts
import { ref, onMounted } from 'vue'
import { useRoute } from '#app'

export const useGeoModal = () => {
  const showGeoModal = ref(false)
  const route = useRoute()
  const checkMobile = () => {
    if (!process.client) return false
    const userAgent = navigator.userAgent
    const platform = navigator.platform
    const width = window.innerWidth
    const height = window.innerHeight

    const isMobileUA = /Android|iPhone|iPod|Tablet|PlayBook|Silk|Kindle|Touch/i.test(userAgent)
    const isIPadOS13Plus = platform === 'MacIntel' && 'ontouchend' in document
    const isTouchDevice = 'ontouchend' in document
    const isPortrait = height >= width
    const isTabletSize = isPortrait ? width >= 600 && width <= 1024 : height >= 600 && height <= 1024

    return isMobileUA || isIPadOS13Plus || (isTouchDevice && isTabletSize)
  }

  const checkGeoStatus = () => {
    if (!process.client) return

    if (!navigator.geolocation) {
      showGeoModal.value = true
      return
    }

    navigator.geolocation.getCurrentPosition(
      () => {
        // Геолокація працює — показувати модалку не потрібно
        showGeoModal.value = false
      },
      (err) => {
        // Помилка — показуємо модалку
        if (err.code === err.PERMISSION_DENIED || err.code === err.POSITION_UNAVAILABLE) {
          showGeoModal.value = true
        }
      }
    )
  }

  const tryShowModal = () => {
    if (route.path === '/warning') return

    if (checkMobile()) {
      // Спочатку перевіряємо геолокацію
      checkGeoStatus()
    }
  }

  onMounted(() => {
    tryShowModal()
  })

  const closeGeoModal = () => {
    showGeoModal.value = false
  }

  return { showGeoModal, closeGeoModal }
}
