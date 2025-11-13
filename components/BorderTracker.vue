// BorderTracker.vue
<script setup lang="ts">
import { computed } from "vue"
import { useI18n } from "vue-i18n"
import { useSessionToken } from "@/composables/useSessionToken"
import { useBorderTracker } from "@/composables/useBorderTracker"

const { t } = useI18n()
const { clearToken } = useSessionToken()
const {
  //  currentCoords,
  //accuracy,
  statusKey,
  startTime,
  timeElapsed,
  modal,
  direction,
  confirmDirection,
  isDirectionModalVisible,
} = useBorderTracker()

const directionVal = computed(() => direction.value)
//const currentCoordsVal = computed(() => currentCoords.value)
//const accuracyVal = computed(() => accuracy.value)
const statusVal = computed(() => statusKey.value)
const modalVal = computed(() => modal.value)
const timeElapsedVal = computed(() => timeElapsed.value)

// ✅ Оновлена функція закриття
const handleCloseCrossing = () => {
  if (modal.value?.type === "done") {
    startTime.value = null // очищаємо тільки після підтвердження
  }
  modal.value = null
  clearToken() // чистимо токен після закриття
  localStorage.removeItem("border-key") //  очищаємо назву пункту після завершення
}

// ⏱️ Форматований час (години + хвилини)
const formattedTime = computed(() => {
  const minutes = timeElapsed.value || 0
  if (minutes <= 59) {
    return { h: 0, m: minutes }
  }
  return {
    h: Math.floor(minutes / 60),
    m: minutes % 60,
  }
})

const warningItems = [
  { textKey: "tracker.warning" },
  { textKey: "tracker.warning-1" },
]
const warningIndex = ref(0)

function rotateWarning() {
  warningIndex.value = (warningIndex.value + 1) % warningItems.length
}

onMounted(() => {
  setInterval(rotateWarning, 7500) // змінюється кожні 4 секунди
})
</script>

<template>
  <div class="tracker-card">
    <div class="tracker-block">
      <transition name="fade" mode="out-in">
        <h1 class="tracker-warning" :key="warningItems[warningIndex].textKey">
          {{ $t(warningItems[warningIndex].textKey) }}
        </h1>
      </transition>
    </div>

    <div
      class="tracker-status"
      :class="{
        success: statusVal === 'received',
        error: statusVal === 'error',
      }"
    >
      <p>{{ t(`status.${statusVal}`) }}</p>
    </div>
    <div class="tracker-info">
      <div v-if="directionVal" class="tracker-info__item">
        <span>
          {{ $t("tracker.direction") }}
        </span>
        <svg
          class="arrow-icon"
          viewBox="0 0 16 16"
          width="16"
          height="16"
          aria-hidden="true"
        >
          <path
            fill="currentColor"
            d="M1 8h12M9 4l4 4-4 4"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke="currentColor"
          />
        </svg>
        <strong class="uppercase">{{ directionVal }}</strong>
      </div>
      <!-- <div v-if="currentCoordsVal" class="tracker-info__item">
        <span>📍 {{ $t("tracker.current") }}</span>
        <strong>
          {{ currentCoordsVal.lat.toFixed(6) }},
          {{ currentCoordsVal.lon.toFixed(6) }}
        </strong>
      </div> -->
      <!-- <div v-if="accuracyVal !== null" class="tracker-info__item">
        <span>🎯 {{ $t("tracker.accuracy") }}</span>
        <strong>{{ accuracyVal }} м</strong>
      </div> -->
      <div v-if="timeElapsedVal" class="tracker-info__item">
        <span>⏱ {{ $t("tracker.time") }}</span>
        <template v-if="formattedTime.h === 0">
          <strong>{{ formattedTime.m }} {{ $t("tracker.minutes") }}</strong>
        </template>
        <template v-else>
          <strong
            >{{ formattedTime.h }} {{ $t("tracker.hours") }}
            {{ formattedTime.m }} {{ $t("tracker.minutes") }}</strong
          >
        </template>
      </div>

      <!--  Кнопка для тесту відкриття/закриття -->
      <!-- <button class="open-test-btn" @click="openTestModal">
    {{ modalVal?.type === 'done' ? 'Закрити модалку' : 'Відкрити модалку' }}
  </button> -->
    </div>
    <!-- Модалка для вимкненої геолокації -->
    <ModalsGeoDisabled />
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
      :time="modalVal.time"
      @close="handleCloseCrossing"
    />

    <ModalsExitInfo
      v-if="modalVal?.type === 'exit-info'"
      :borderLabel="modalVal.borderLabel"
      @close="modal = null"
    />
  </div>
</template>
<style lang="scss" scoped>
.tracker-card {
  border: 1px solid #ff4e50;
  border-radius: 8px;
}
.tracker-block {
  display: flex;
  justify-content: center;
  align-items: center;
  background: linear-gradient(90deg, #ff4e50, #f9d423);
  height: 70px;
  text-align: center;
}
.tracker-warning {
  color: #fff;
  font-size: 1.2rem;

  border-radius: 8px 8px 0 0;
  margin: 0;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  letter-spacing: 1px;
}

.tracker-title {
  font-size: 1.3rem;
  font-weight: 600;
  padding: 10px 20px;
  text-align: center;
  margin: 0;
  box-shadow: inset 0 -1px 0 rgba(0, 0, 0, 0.05);
}

.tracker-status {
  padding: 10px 20px;
  font-size: 1.1rem;
  font-weight: 500;
  text-align: center;
  color: #fff;
  background: #9e9e9e;
  transition:
    background 0.3s ease,
    transform 0.2s ease;

  &.success {
    background: #4caf50;
  }

  &.error {
    background: #f44336;
    color: #fff;
    border-radius: 0;
  }

  &:hover {
    transform: scale(1.02);
  }
}
.uppercase {
  text-transform: uppercase;
  margin-left: 10px;
}
.tracker-info {
  background: rgba(255, 255, 255, 0.1);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.4rem;
  padding: 1rem 0.8rem;
  text-align: center;

  border-top: 1px solid rgba(255, 78, 80, 0.3);
  border-radius: 0 0 8px 8px;
  font-family: "Unbounded", sans-serif;
  font-size: 0.95rem;
  letter-spacing: 0.3px;

  .tracker-info__item {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-evenly;

    span {
      font-size: 0.85rem;
      color: #ff4e50;
      font-weight: 500;
      margin-bottom: 0.2rem;
    }

    strong {
      font-weight: 600;
      color: #222;
      text-transform: uppercase;
      background: linear-gradient(90deg, #d1af02, #ff4e50);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
  }
}

// .open-test-btn {
//   margin-left: 10px;
//   padding: 4px 10px;
//   border: none;
//   border-radius: 6px;
//   background: #4caf50;
//   color: #fff;
//   cursor: pointer;
//   font-size: 14px;

//   &:hover {
//     background: #43a047;
//   }
// }
.fade-enter-active,
.fade-leave-active {
  transition: opacity 2.5s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
