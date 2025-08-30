
<script setup lang="ts">
import { defineEmits } from 'vue'
const emit = defineEmits(['close'])
const closeModalGeo = () => {
  emit('close') // повідомляємо батька про закриття
}
</script>

<template>
<Teleport to="body">
    <div class="modal-overlay">
      <div class="geo-modal">
        <button class="close-button" @click="closeModalGeo">×</button>
     <h3>{{ $t("modals.geo") }}</h3>
      <p>{{ $t("modals.on") }}</p>
        </div>
    </div>
  </Teleport>


</template>


<style scoped lang="scss">
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(6px);
  display: grid;
  place-items: center;
  z-index: 9999;
}

.geo-modal {
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
    font-size: 25px;
    text-align: center;
    color: #4db6ac;
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
