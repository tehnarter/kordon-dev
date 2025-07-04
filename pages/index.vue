<script setup lang="ts">
const selectedBorder = useBorder()
</script>
<template>
  <main class="main__container">
    <Transition name="fade" mode="out-in">
      <template v-if="selectedBorder">
        <BorderName :border="selectedBorder" />
      </template>
      <template v-else>
        <DirectionBorders />
      </template>
    </Transition>
    <BorderTracker />
    <QueueForm />
    <CrossingTimeForm />
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
