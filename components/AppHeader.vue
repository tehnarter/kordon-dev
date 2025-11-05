<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue"
import { usePanels } from "@/composables/usePanels"
import { useBorderKey } from "@/composables/useBorderKey"

const { isMenuOpen, isSocialOpen, gestureLock } = usePanels()
const { borderKey } = useBorderKey()

const isClickedBurger = ref(false)
const navRef = ref()
const isNewsModalOpen = ref(false)
const isInfoModalOpen = ref(false)
const isQueueModalOpen = ref(false)
const isTimeModalOpen = ref(false)

function handleOpenMenu() {
  if (isSocialOpen.value) return
  isClickedBurger.value = true
  isMenuOpen.value = true
}

function handleCloseMenu() {
  isClickedBurger.value = false
  isMenuOpen.value = false
}

function handleOpenModal(modalKey: string) {
  switch (modalKey) {
    case "newsBlock":
      isNewsModalOpen.value = true
      break
    case "infoBlock":
      isInfoModalOpen.value = true
      break
    case "queueSubmit":
      isQueueModalOpen.value = true
      break
    case "timeSubmit":
      isTimeModalOpen.value = true
      break
  }

  if (process.client) {
    borderKey.value = localStorage.getItem("border-key")
  }
}

//  Закриття ручного введення і очищення ключа
function handleManualClose() {
  isQueueModalOpen.value = false
  if (process.client) {
    localStorage.removeItem("border-key")
    borderKey.value = null
  }
}

//  Автоматичне закриття
function handleAutoClose() {
  isQueueModalOpen.value = false
}

//  Ініціалізація свайпів меню
onMounted(() => {
  let startX = 0
  let endX = 0
  let swipeFromSlider = false

  const handleTouchStart = (e: TouchEvent) => {
    const target = e.target as HTMLElement
    swipeFromSlider = !!target.closest(".direction-buttons, .sort-buttons")
    startX = e.touches[0].clientX
  }

  const handleTouchEnd = (e: TouchEvent) => {
    if (isSocialOpen.value || gestureLock.value === "social") return

    endX = e.changedTouches[0].clientX
    const diff = endX - startX
    if (swipeFromSlider) return

    if (diff > 100 && !isClickedBurger.value) {
      gestureLock.value = "menu"
      handleOpenMenu()
    } else if (diff < -100 && isClickedBurger.value) {
      gestureLock.value = "menu"
      navRef.value?.closeWithAnimation()
    }

    gestureLock.value = null
  }

  document.addEventListener("touchstart", handleTouchStart)
  document.addEventListener("touchend", handleTouchEnd)

  //  Очищення при розмонтуванні
  onUnmounted(() => {
    document.removeEventListener("touchstart", handleTouchStart)
    document.removeEventListener("touchend", handleTouchEnd)
  })
})
</script>

<template>
  <header class="header">
    <div class="header__nav-1 nav-1">
      <div class="nav-1__container nav-1-content">
        <div class="header__logo">
          <img src="/ukraine.svg" alt="Ukraine" class="header__logo-img" />
        </div>
        <ClientOnly>
          <ThemeSwitcher />
        </ClientOnly>
        <LanguageSwitcher />
      </div>
    </div>

    <div class="header__nav-2 nav-2">
      <div class="nav-2__container nav-2-content">
        <div class="header__burger">
          <Burger :class="{ active: isClickedBurger }" @click="handleOpenMenu" />
        </div>
        <Geo />
      </div>
    </div>

    <AppHeaderNav
      v-if="isClickedBurger"
      @close="handleCloseMenu"
      @openModal="handleOpenModal"
      ref="navRef"
    />

    <ModalsNewsBlock v-if="isNewsModalOpen" @close="isNewsModalOpen = false" />
    <ModalsInfoBlock v-if="isInfoModalOpen" @close="isInfoModalOpen = false" />
    <ModalsQueueManualSubmit
      v-if="isQueueModalOpen && !borderKey"
      @closeManual="handleManualClose"
      @closeAuto="handleAutoClose"
    />
    <ModalsTimeManualSubmit
      v-if="isTimeModalOpen"
      @close="isTimeModalOpen = false"
    />
  </header>
</template>

<style lang="scss">
.header {
  &__nav-1 {
    padding: 12px 0;
    height: 48px;
    background-color: var(--themes-bg-header);
    transition: background-color 3s ease;
  }

  &__logo {
    display: flex;
    align-items: center;
    column-gap: 20px;
    flex-basis: 100%;
  }

  &__logo-img {
    width: 50px;
  }

  &__nav-2 {
    padding: 12px 0;
    height: 48px;
    background-color: var(--themes-bg-footer);
    transition: background-color 3s ease;
  }
}

.nav-1-content,
.nav-2-content {
  display: flex;
  align-items: center;
  height: 100%;
}

.nav-1-content {
  column-gap: 20px;
}

.nav-2-content {
  justify-content: flex-start;
  column-gap: 15px;
}
</style>
