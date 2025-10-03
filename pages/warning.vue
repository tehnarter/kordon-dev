<script setup lang="ts">
definePageMeta({
  layout: "custom",

})
import { useHead } from "#imports"
import { useI18n } from "vue-i18n"
const { t, locale } = useI18n()
const lang = locale.value
useHead({
   htmlAttrs: { lang },
   title: t("warning-page.title"),

  meta: [
    { name: "description", content:  t("warning-page.text")},]
  })



</script>
<template>
  <ClientOnly>
      <div class="warning-page">
         <div class="warning-content">
        <h1 class="warning-title">
         {{t("warning-page.title")}}
        </h1>
        <p class="warning-text">
          {{t("warning-page.text")}}
        </p>
      </div>
      </div>
  </ClientOnly>
</template>

<style lang="scss">
.warning-page {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #f8f9fa, #e9ecef);
  padding: 2rem;
  text-align: center;
}

.warning-content {
  max-width: 500px;
  background: white;
  border: 1px solid #dee2e6;
  border-radius: 1rem;
  padding: 2rem;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
}

.warning-title {
  font-size: 1.8rem;
  color: #212529;
  margin-bottom: 1rem;
  font-weight: 700;
}

.warning-text {
  font-size: 1.1rem;
  color: #495057;
}
</style>
