<script setup lang="ts">
import { computed } from "vue"
import { useBorderTracker } from "~/composables/useBorderTracker"

const {
  currentCoords,
  accuracy,
  status,
  timeElapsed,
  modal,
  direction,
  confirmDirection,
  isDirectionModalVisible,
} = useBorderTracker()

const directionVal = computed(() => direction.value)
const currentCoordsVal = computed(() => currentCoords.value)
const accuracyVal = computed(() => accuracy.value)
const statusVal = computed(() => status.value)
const modalVal = computed(() => modal.value)
const timeElapsedVal = computed(() => timeElapsed.value)
const { clearToken } = useSessionToken()
const handleCloseCrossing = () => {
  modal.value = null
  clearToken() // Чистимо токен тільки після закриття
}
</script>
<template>
  <div class="tracker-card">
    <h2 class="tracker-title">Відстеження проходження кордону</h2>

    <div
      class="tracker-status"
      :class="{ success: timeElapsedVal, error: statusVal.includes('Помилка') }"
    >
      {{ statusVal }}
    </div>

    <div class="tracker-info">
      <div v-if="directionVal" class="tracker-info__item">
        <span>➡️ Напрям:</span>
        <strong>{{ directionVal }}</strong>
      </div>
      <div v-if="currentCoordsVal" class="tracker-info__item">
        <span>📍 Координати:</span>
        <strong>
          {{ currentCoordsVal.lat.toFixed(6) }},
          {{ currentCoordsVal.lon.toFixed(6) }}
        </strong>
      </div>
      <div v-if="accuracyVal !== null" class="tracker-info__item">
        <span>🎯 Точність:</span>
        <strong>{{ accuracyVal }} м</strong>
      </div>
      <div v-if="timeElapsedVal" class="tracker-info__item">
        <span>⏱ Час проходження:</span>
        <strong>{{ timeElapsedVal }} сек</strong>
      </div>
    </div>

    <!-- Модалка вибору напряму — тільки якщо напрям ще не вибрано -->
    <ModalsConfirmDirection
      v-if="isDirectionModalVisible"
      @confirm="confirmDirection"
      @reloadBorders="$emit('reloadBorders')"
    />

    <!-- Інші модалки -->
    <ModalsQueueForm
      v-if="modalVal?.type === 'input-queue'"
      :borderKey="modalVal.borderKey"
      :borderLabel="modalVal.borderLabel"
      @close="modal = null"
    />
    <ModalsCrossingTimeForm
      v-if="modalVal?.type === 'done'"
      :borderLabel="modalVal.borderLabel"
      :time="timeElapsedVal"
      @close="handleCloseCrossing"
    />

    <ModalsExitInfo
      v-if="modalVal?.type === 'exit-info'"
      :borderLabel="modalVal.borderLabel"
      @close="modal = null"
    />
  </div>
</template>
