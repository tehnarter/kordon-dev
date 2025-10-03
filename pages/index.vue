<script setup lang="ts">
import { useI18n } from "vue-i18n"
const { t} = useI18n()

const selectedBorder = useBorder()
const showBorders = ref(true)

const handleReloadBorders = () => {
  showBorders.value = false
  nextTick(() => {
    showBorders.value = true
  })
}

const route = useRoute()
const config = useRuntimeConfig()
const Url = `${config.public.siteUrl}${route.fullPath}`
const Image = `${config.public.siteUrl}/preview.jpg` //1200×630px
const i18nHead = useLocaleHead()
const linksWithTrailingSlash = (i18nHead.value.link || []).map((link) => {
  return {
    ...link,
    href: link.href.endsWith("/") ? link.href : link.href + "/", // Додаемо слеш до масива link rel="alternate
  }
})
useHead({
  htmlAttrs: {
    lang: i18nHead.value.htmlAttrs.lang,
  },
  title: t("seo.title"),
  link: [...linksWithTrailingSlash],
  meta: [
    // ...(i18nHead.value.meta || []),// OG-теги  рекомендовані для мультимовних сайтів
    { name: "description", content: t("seo.description") },
    { name: "keywords", content: t("seo.keywords") },

    // Open Graph
    { property: "og:title", content: t("og.title") },
    { property: "og:description", content: t("og.description") },
    { property: "og:image", content: Image }, //1200×630 px,
    { property: "og:url", content: Url },
    { property: "og:type", content: "website" },

    // Twitter
    { name: "twitter:card", content: t("twitter.card") },
    { name: "twitter:title", content: t("twitter.title") },
    { name: "twitter:description", content: t("twitter.description") },
    { name: "twitter:url", content: Url },
    { name: "twitter:image", content: Image }, //1200×630 px,
  ],
})
</script>
<template>
  <main class="main__container">
    <BorderTracker @reloadBorders="handleReloadBorders" />
    <Transition name="fade" mode="out-in">
      <template v-if="selectedBorder">
        <BorderName :border="selectedBorder" />
      </template>
      <template v-else>
        <DirectionBorders v-if="showBorders" />
      </template>
    </Transition>
    <SocialSidebar/>
  </main>
</template>

<style lang="scss" scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 1.5s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
