<script setup lang="ts">
import { ref, onMounted } from "vue"

const isClickedBurger = ref(false)
const navRef = ref()

const handleOpenMenu = () => {
  isClickedBurger.value = true
}

const handleCloseMenu = () => {
  isClickedBurger.value = false
}

onMounted(() => {
  if (!process.client) return

  let startX = 0
  let endX = 0
  let swipeFromSlider = false

  document.addEventListener("touchstart", (e) => {
    const target = e.target as HTMLElement
    swipeFromSlider = !!target.closest(".direction-buttons, .sort-buttons") // 👈 перевірка
    startX = e.touches[0].clientX
  })

  document.addEventListener("touchend", (e) => {
    endX = e.changedTouches[0].clientX
    const diff = endX - startX

    if (swipeFromSlider) return // ❌ не відкривати меню

    if (diff > 100 && !isClickedBurger.value) {
      handleOpenMenu()
    }

    if (diff < -100 && isClickedBurger.value) {
      navRef.value?.closeWithAnimation()
    }
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
        <ThemeSwitcher />
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
      ref="navRef"
    />
  </header>
</template>

<style scoped lang="scss">
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
