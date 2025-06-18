<script setup lang="ts">
import { ref, computed } from "vue"
import { useColorMode } from "#imports" // Nuxt хук

const themeBtn = ref<HTMLElement | null>(null)
const colorMode = useColorMode()

// Визначення активної теми
const isDark = computed(() => colorMode.value === "dark")

function animateThemeToggle() {
  if (!themeBtn.value) return

  // Анімація тільки кнопки
  themeBtn.value.animate(
    [
      { transform: "rotate(0deg) scale(1)" },
      { transform: "rotate(360deg) scale(1.2)" },
      { transform: "rotate(360deg) scale(1)" },
    ],
    {
      duration: 600,
      easing: "ease-out",
    }
  )
}

function toggleTheme() {
  colorMode.preference = isDark.value ? "light" : "dark"
  animateThemeToggle()
}
</script>

<template>
  <button
    ref="themeBtn"
    @click="toggleTheme"
    class="theme-toggle-btn"
    :aria-label="$t('toggleTheme')"
  >
    <span v-if="isDark">🌙</span>
    <span v-else>☀️</span>
  </button>
</template>

<style scoped lang="scss">
.theme-toggle-btn {
  padding: 0.5rem;
  font-size: 1.25rem;
  line-height: 1.75rem;
  border: 0 solid;
  border-radius: 0.25rem;
  // background-color: var(--themes-bg);
  transition: background-color 3s ease;

  &:hover {
    cursor: pointer;
  }
}
</style>
