<script setup lang="ts">
import { ref, onMounted } from "vue"
import { usePanels } from "@/composables/usePanels"

const { isMenuOpen, isSocialOpen, gestureLock } = usePanels()

const isClickedBurger = ref(false)
const navRef = ref()

const handleOpenMenu = () => {
  if (isSocialOpen.value) return
  isClickedBurger.value = true
  isMenuOpen.value = true
}
const handleCloseMenu = () => {
  isClickedBurger.value = false
  isMenuOpen.value = false
}

const isNewsModalOpen = ref(false)
const isInfoModalOpen = ref(false)

function handleOpenModal(modalKey: string) {
  if (modalKey === "newsBlock") isNewsModalOpen.value = true
  else if (modalKey === "infoBlock") isInfoModalOpen.value = true
}

onMounted(() => {
  if (!process.client) return

  let startX = 0
  let endX = 0
  let swipeFromSlider = false

  document.addEventListener("touchstart", (e) => {
    const target = e.target as HTMLElement
    swipeFromSlider = !!target.closest(".direction-buttons, .sort-buttons")
    startX = e.touches[0].clientX
  })

  document.addEventListener("touchend", (e) => {
    if (isSocialOpen.value || gestureLock.value === "social") return // блокуємо, якщо працює соцка

    endX = e.changedTouches[0].clientX
    const diff = endX - startX

    if (swipeFromSlider) return

    if (diff > 100 && !isClickedBurger.value) {
      gestureLock.value = "menu"
      handleOpenMenu()
    }

    if (diff < -100 && isClickedBurger.value) {
      gestureLock.value = "menu"
      navRef.value?.closeWithAnimation()
    }

    gestureLock.value = null // 🔓 після свайпу розблоковуємо
  })
})
</script>



<template>
  <header class="header">
    <div class="header__nav-1 nav-1">
      <div class="nav-1__container nav-1-content">
        <div class="header__logo">
          <img src="/ukraine.svg" alt="" class="header__logo-img" />
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
          <Burger
            :class="{ active: isClickedBurger }"
            @click="handleOpenMenu"
          />
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

  </header>
</template>

<style  lang="scss">
.header {
  &__nav-1 {
    padding: 12px 0px;
    width: 100%;
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
    padding: 12px 0px;
    width: 100%;
    height: 48px;
    background-color: var(--themes-bg-footer);
    transition: background-color 3s ease;
  }
}

.nav-1-content {
  height: 100%;
  display: flex;
  column-gap: 20px;
  align-items: center;
}

.nav-2-content {
  height: 100%;
  display: flex;
  justify-content: flex-start;
  column-gap: 15px;
  align-items: center;
}
</style>
