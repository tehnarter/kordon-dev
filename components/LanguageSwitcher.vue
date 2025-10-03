<script setup>
import { ref, computed } from "vue"
import { useI18n, useRoute } from "#imports"
import { useClickOutside } from "~/composables/useClickOutside"

const { locale, defaultLocale } = useI18n()
const route = useRoute()

const locales = [
  { code: "ua", label: "🇺🇦 UA" },
  { code: "en", label: "🇬🇧 EN" },
  { code: "pl", label: "🇵🇱 PL" },
  { code: "ru", label: "🇷🇺 RU" },
]

const showDropdown = ref(false)
const dropdownRef = ref(null)

const toggleDropdown = () => {
  showDropdown.value = !showDropdown.value
}
const closeDropdown = () => {
  showDropdown.value = false
}

useClickOutside(dropdownRef, closeDropdown)

const currentLocaleLabel = computed(() => {
  return locales.find((l) => l.code === locale.value)?.label || "🌐"
})

// Відфільтрований список без поточної мови
const availableLocales = computed(() =>
  locales.filter((l) => l.code !== locale.value)
)

// Функція для побудови шляху з правильним префіксом
const getLocalePath = (code) => {
  let path = route.fullPath

  // Видаляємо будь-який існуючий префікс мови
  locales.forEach((l) => {
    const prefix = `/${l.code}`
    if (path === prefix) path = "/"
    else if (path.startsWith(prefix + "/")) path = path.replace(prefix, "")
  })

  // Додаємо новий префікс
  return `/${code}${path}`
}
</script>

<template>
  <div class="language-dropdown" ref="dropdownRef">
    <button class="dropdown-toggle" @click="toggleDropdown">
      {{ currentLocaleLabel }}
    </button>
    <div class="dropdown-menu" v-if="showDropdown">
      <NuxtLink
        v-for="l in availableLocales"
        :key="l.code"
        :to="getLocalePath(l.code)"
        class="dropdown-item"
        @click="closeDropdown"
      >
        {{ l.label }}
      </NuxtLink>
    </div>
  </div>
</template>


<style scoped lang="scss">
.language-dropdown {
  min-width: 5.2rem;
  position: relative;
  display: inline-block;

  .dropdown-toggle {
    padding: 0.4rem 0.8rem;
    border-radius: 0.4rem;
    color: #f4c038;
    font-family: Unbounded;
    font-weight: 500;
    cursor: pointer;
  }

  .dropdown-menu {
    position: absolute;
    right: 0;
    color: #fff;
    background-color: var(--themes-bg);
    border: 1px solid var(--themes-text);
    border-radius: 0.4rem;
    margin-top: 0.4rem;
    z-index: 10;
    min-width: 100%;
    overflow: hidden;

    .dropdown-item {
      display: block;
      padding: 0.4rem 0.8rem;
      color: var(--themes-text);
      text-decoration: none;
      font-family: Unbounded;

      &:hover {
        background-color: #141fec;
        color: var(--themes-bg);
      }
    }
  }
}
</style>
