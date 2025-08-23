<script setup lang="ts">
const selectedBorder = useBorder()
const showBorders = ref(true)

const handleReloadBorders = () => {
  showBorders.value = false
  nextTick(() => {
    showBorders.value = true
  })
}
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
