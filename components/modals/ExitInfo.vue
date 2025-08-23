<script setup lang="ts">
defineProps<{
  borderLabel: string
}>()

const emit = defineEmits<{
  (e: "close"): void
}>()

const closeModal = () => {
  emit("close")
}
</script>

<template>
  <Teleport to="body">
    <div class="exit-modal-overlay">
      <div class="exit-modal">
        <button class="close-button" @click="closeModal">×</button>

        <h3>Ви покидаєте міжнародний пункт пропуску</h3>
        <p class="modal-subtitle">
          <strong>{{ borderLabel }}</strong>
        </p>
        <p>Щасливої дороги!</p>
      </div>
    </div>
  </Teleport>
</template>
<style scoped lang="scss">
.exit-modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(6px);
  display: grid;
  place-items: center;
  z-index: 9999;
}

.exit-modal {
  background: var(--themes-bg-modal);
  padding: 24px 30px;
  border-radius: 12px;
  text-align: center;
  max-width: 400px;
  width: 90%;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
  position: relative;

  h3 {
    margin: 12px 0;
    font-size: 20px;
  }
  .modal-subtitle {
    font-size: 1.8rem;
    margin-bottom: 1rem;
    text-align: center;
    color: #4db6ac;
  }
  p {
    font-size: 20px;
    margin-bottom: 8px;
  }
}

.close-button {
  position: absolute;
  top: 10px;
  right: 12px;
  font-size: 22px;
  background: transparent;
  border: none;
  cursor: pointer;
  color: #333;

  &:hover {
    color: #000;
  }
}
</style>
