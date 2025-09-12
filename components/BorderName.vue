<script setup lang="ts">
import { ref, watch, computed, onMounted } from "vue"
import { useI18n } from "vue-i18n"
const { t } = useI18n()

const props = defineProps<{
  border: {
    key: string
    labelfun: () => string
  }
}>()

const selectedSort = ref<number | string>(1) // стартуємо з 1h

const queueData = ref({
  buses: "-",
  cars: "-",
  tir: "-",
  foot: "-",
})
const waitTimeData = ref({
  buses: "-",
  cars: "-",
  tir: "-",
  foot: "-",
})
const errorMessage = ref("")

watch(
  [() => props.border.key, selectedSort],
  async ([newKey, hours]) => {
    if (hours === "all") {
      const selectedBorder = useBorder()
      selectedBorder.value = null
      return
    }
    await fetchQueueData(newKey, Number(hours))
  }
)

onMounted(() => {
  // при кожному переході на компонент викликаємо запит на 1 годину
  selectedSort.value = 1
  fetchQueueData(props.border.key, 1)
})

function getTrafficClass(value: string | number) {
  if (value === "-") return "status-gray"
  const numeric = Number(value)
  if (numeric <= 10) return "status-green"
  if (numeric <= 30) return "status-yellow"
  return "status-red"
}

function getBusTrafficClass(value: string | number) {
  if (value === "-") return "status-gray"
  const numeric = Number(value)
  if (numeric <= 2) return "status-green"
  if (numeric <= 5) return "status-yellow"
  return "status-red"
}

function setUnavailable() {
  const unavailable = { buses: "-", cars: "-", tir: "-", foot: "-" }
  queueData.value = unavailable
  waitTimeData.value = unavailable
}

const api_key = useRuntimeConfig().public.apiKey
const api_url = useRuntimeConfig().public.apiBase
async function fetchQueueData(borderKey: string, hours: number) {
  try {
    const { queues, times } = await $fetch(
      `${api_url}/api/get-border-data.php?name=${encodeURIComponent(
        borderKey
      )}&hours=${hours}&api_key=${api_key}`
    )

    queueData.value = {
      buses: queues.bus ?? "-",
      cars: queues.car ?? "-",
      tir: queues.tir ?? "-",
      foot: queues.pedestrian ?? "-",
    }

    waitTimeData.value = {
      buses: times.bus ?? "-",
      cars: times.car ?? "-",
      tir: times.tir ?? "-",
      foot: times.pedestrian ?? "-",
    }

    errorMessage.value = ""
  } catch (err) {
    console.error("Помилка отримання даних:", err)
    setUnavailable()
    errorMessage.value = t("errorMessage")
  }
}

const sortOptions = [
  {
    label: "1h",
    value: 1,
    icon: "clock", // icon для 1h
  },
  {
    label: "3h",
    value: 3,
    icon: "clock-history", // інші години
  },
  {
    label: "6h",
    value: 6,
    icon: "clock-history",
  },
  {
    label: "12h",
    value: 12,
    icon: "clock-history",
  },
  {
    label: "24h",
    value: 24,
    icon: "clock-history",
  },
  {
    label: t("button-clock.all"),
    value: "all",
    icon: null, // без іконки
  },
]

// --- Додано для відображення часу актуальності ---
const timeInfo = computed(() => {
  if (selectedSort.value === "all") return ""

  const now = new Date()
  const hoursBack = Number(selectedSort.value)

  const pad = (n: number) => n.toString().padStart(2, "0")

  if (hoursBack === 1) {
    const adjustedTime = new Date(now.getTime() - 30 * 60 * 1000)
    const hours = pad(adjustedTime.getHours())
    const minutes = pad(adjustedTime.getMinutes())

    return `${t("button-clock.time")}\n ${hours}:${minutes}`
  } else {
    const pastDate = new Date(now.getTime() - hoursBack * 60 * 60 * 1000)
    const year = pastDate.getFullYear()
    const month = pad(pastDate.getMonth() + 1)
    const day = pad(pastDate.getDate())
    const hours = pad(pastDate.getHours())
    const minutes = pad(pastDate.getMinutes())

    return `${t("button-clock.timeInfo")}\n${year}-${month}-${day} ${hours}:${minutes}`
  }
})
function formatWaitTime(value: string | number) {
  if (value === "-" || value === null) return "-"

  const minutes = Number(value)
  if (isNaN(minutes)) return "-"

  if (minutes <= 59) {
    return `${minutes} ${t("tracker.minutes")}`
  }

  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60
  return mins > 0 ? `${hours} ${t("tracker.hours")} ${mins} ${t("tracker.minutes")}` : `${hours} год`
}
</script>
<template>
  <div class="border-queue">
    <h2>{{ border.labelfun() }}</h2>
    <transition name="slide-fade">
      <p v-if="errorMessage" class="error-msg">
        {{ errorMessage }}
      </p>
    </transition>
    <div class="sort-buttons">
      <button
        v-for="option in sortOptions"
        :key="option.value"
        :class="{ active: selectedSort === option.value }"
        @click="selectedSort = option.value"
      >
        <template v-if="option.icon === 'clock'">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="currentColor"
            class="bi bi-clock"
            viewBox="0 0 16 16"
          >
            <path
              d="M8 3.5a.5.5 0 0 0-1 0V9a.5.5 0 0 0 .252.434l3.5 2a.5.5 0 0 0 .496-.868L8 8.71z"
            />
            <path
              d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16m7-8A7 7 0 1 1 1 8a7 7 0 0 1 14 0"
            />
          </svg>
        </template>

        <template v-else-if="option.icon === 'clock-history'">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="currentColor"
            class="bi bi-clock-history"
            viewBox="0 0 16 16"
          >
            <path
              d="M8.515 1.019A7 7 0 0 0 8 1V0a8 8 0 0 1 .589.022zm2.004.45a7 7 0 0 0-.985-.299l.219-.976q.576.129 1.126.342zm1.37.71a7 7 0 0 0-.439-.27l.493-.87a8 8 0 0 1 .979.654l-.615.789a7 7 0 0 0-.418-.302zm1.834 1.79a7 7 0 0 0-.653-.796l.724-.69q.406.429.747.91zm.744 1.352a7 7 0 0 0-.214-.468l.893-.45a8 8 0 0 1 .45 1.088l-.95.313a7 7 0 0 0-.179-.483m.53 2.507a7 7 0 0 0-.1-1.025l.985-.17q.1.58.116 1.17zm-.131 1.538q.05-.254.081-.51l.993.123a8 8 0 0 1-.23 1.155l-.964-.267q.069-.247.12-.501m-.952 2.379q.276-.436.486-.908l.914.405q-.24.54-.555 1.038zm-.964 1.205q.183-.183.35-.378l.758.653a8 8 0 0 1-.401.432z"
            />
            <path
              d="M8 1a7 7 0 1 0 4.95 11.95l.707.707A8.001 8.001 0 1 1 8 0z"
            />
            <path
              d="M7.5 3a.5.5 0 0 1 .5.5v5.21l3.248 1.856a.5.5 0 0 1-.496.868l-3.5-2A.5.5 0 0 1 7 9V3.5a.5.5 0 0 1 .5-.5"
            />
          </svg>
        </template>

        {{ option.label }}
      </button>
    </div>
    <p v-if="timeInfo" class="time-info">{{ timeInfo }}</p>

    <div class="queue-row">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="25"
        height="25"

        :class="['bi bi-car-front-fill', getTrafficClass(queueData.cars)]"
        viewBox="0 0 16 16"
      >
        <path
          d="M2.52 3.515A2.5 2.5 0 0 1 4.82 2h6.362c1 0 1.904.596 2.298 1.515l.792 1.848c.075.175.21.319.38.404.5.25.855.715.965 1.262l.335 1.679q.05.242.049.49v.413c0 .814-.39 1.543-1 1.997V13.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-1.338c-1.292.048-2.745.088-4 .088s-2.708-.04-4-.088V13.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-1.892c-.61-.454-1-1.183-1-1.997v-.413a2.5 2.5 0 0 1 .049-.49l.335-1.68c.11-.546.465-1.012.964-1.261a.8.8 0 0 0 .381-.404l.792-1.848ZM3 10a1 1 0 1 0 0-2 1 1 0 0 0 0 2m10 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2M6 8a1 1 0 0 0 0 2h4a1 1 0 1 0 0-2zM2.906 5.189a.51.51 0 0 0 .497.731c.91-.073 3.35-.17 4.597-.17s3.688.097 4.597.17a.51.51 0 0 0 .497-.731l-.956-1.913A.5.5 0 0 0 11.691 3H4.309a.5.5 0 0 0-.447.276L2.906 5.19Z"
        />
      </svg>
      <span :class="getTrafficClass(queueData.cars)"
        >{{ queueData.cars }}
      </span>
      <span :class="{ 'gray-text': waitTimeData.cars === '-' }">
  {{ formatWaitTime(waitTimeData.cars) }}
</span>
    </div>

    <div class="queue-row">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="25"
        height="25"
        :class="['bi bi-bus-front-fill', getBusTrafficClass(queueData.buses)]"
        viewBox="0 0 16 16"
      >
        <path
          d="M16 7a1 1 0 0 1-1 1v3.5c0 .818-.393 1.544-1 2v2a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5V14H5v1.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-2a2.5 2.5 0 0 1-1-2V8a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1V2.64C1 1.452 1.845.408 3.064.268A44 44 0 0 1 8 0c2.1 0 3.792.136 4.936.268C14.155.408 15 1.452 15 2.64V4a1 1 0 0 1 1 1zM3.552 3.22A43 43 0 0 1 8 3c1.837 0 3.353.107 4.448.22a.5.5 0 0 0 .104-.994A44 44 0 0 0 8 2c-1.876 0-3.426.109-4.552.226a.5.5 0 1 0 .104.994M8 4c-1.876 0-3.426.109-4.552.226A.5.5 0 0 0 3 4.723v3.554a.5.5 0 0 0 .448.497C4.574 8.891 6.124 9 8 9s3.426-.109 4.552-.226A.5.5 0 0 0 13 8.277V4.723a.5.5 0 0 0-.448-.497A44 44 0 0 0 8 4m-3 7a1 1 0 1 0-2 0 1 1 0 0 0 2 0m8 0a1 1 0 1 0-2 0 1 1 0 0 0 2 0m-7 0a1 1 0 0 0 1 1h2a1 1 0 1 0 0-2H7a1 1 0 0 0-1 1"
        />
      </svg>
      <span :class="getBusTrafficClass(queueData.buses)"
        >{{ queueData.buses }}
      </span>
      <span :class="{ 'gray-text': waitTimeData.buses === '-' }">
  {{ formatWaitTime(waitTimeData.buses) }}
</span>
    </div>
    <!-- Аналогічно додай TIR і пішоходи зі стилями -->
    <div class="queue-row">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="25"
        height="25"
        :class="['bi bi-truck', getTrafficClass(queueData.tir)]"
        viewBox="0 0 16 16"
      >
        <path
          d="M0 3.5A1.5 1.5 0 0 1 1.5 2h9A1.5 1.5 0 0 1 12 3.5V5h1.02a1.5 1.5 0 0 1 1.17.563l1.481 1.85a1.5 1.5 0 0 1 .329.938V10.5a1.5 1.5 0 0 1-1.5 1.5H14a2 2 0 1 1-4 0H5a2 2 0 1 1-3.998-.085A1.5 1.5 0 0 1 0 10.5zm1.294 7.456A2 2 0 0 1 4.732 11h5.536a2 2 0 0 1 .732-.732V3.5a.5.5 0 0 0-.5-.5h-9a.5.5 0 0 0-.5.5v7a.5.5 0 0 0 .294.456M12 10a2 2 0 0 1 1.732 1h.768a.5.5 0 0 0 .5-.5V8.35a.5.5 0 0 0-.11-.312l-1.48-1.85A.5.5 0 0 0 13.02 6H12zm-9 1a1 1 0 1 0 0 2 1 1 0 0 0 0-2m9 0a1 1 0 1 0 0 2 1 1 0 0 0 0-2"
        />
      </svg>
      <span :class="getTrafficClass(queueData.tir)">{{ queueData.tir }} </span>
     <span :class="{ 'gray-text': waitTimeData.tir === '-' }">
  {{ formatWaitTime(waitTimeData.tir) }}
</span>
    </div>
    <div class="queue-row">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="25"
        height="25"
        :class="['bi bi-person-walking', getTrafficClass(queueData.foot)]"
        viewBox="0 0 16 16"
      >
        <path
          d="M9.5 1.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0M6.44 3.752A.75.75 0 0 1 7 3.5h1.445c.742 0 1.32.643 1.243 1.38l-.43 4.083a1.8 1.8 0 0 1-.088.395l-.318.906.213.242a.8.8 0 0 1 .114.175l2 4.25a.75.75 0 1 1-1.357.638l-1.956-4.154-1.68-1.921A.75.75 0 0 1 6 8.96l.138-2.613-.435.489-.464 2.786a.75.75 0 1 1-1.48-.246l.5-3a.75.75 0 0 1 .18-.375l2-2.25Z"
        />
        <path
          d="M6.25 11.745v-1.418l1.204 1.375.261.524a.8.8 0 0 1-.12.231l-2.5 3.25a.75.75 0 1 1-1.19-.914zm4.22-4.215-.494-.494.205-1.843.006-.067 1.124 1.124h1.44a.75.75 0 0 1 0 1.5H11a.75.75 0 0 1-.531-.22Z"
        />
      </svg>
      <span :class="getTrafficClass(queueData.foot)"
        >{{ queueData.foot }}
      </span>
      <span :class="{ 'gray-text': waitTimeData.foot === '-' }">
  {{ formatWaitTime(waitTimeData.foot) }}
</span>
    </div>
  </div>
</template>

<style scoped lang="scss">
.border-queue {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  max-width: 700px;
  width: 100%;
  margin: 1rem auto;
  padding: 1.5rem;
  border-radius: 1rem;
  background: rgba(255, 255, 255, 0.1);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.25);
}

h2 {
  font-size: 1.75rem;
  color: #4db6ac;
  text-align: center;
}

.sort-buttons {
  display: flex;
  flex-wrap: nowrap;
  overflow-x: auto;
  gap: 0.75rem;
  padding: 0.5rem 0;
  margin: 1rem 0;

  scroll-snap-type: x mandatory;
  -webkit-overflow-scrolling: touch;

  scrollbar-width: none; // Firefox
  -ms-overflow-style: none; // IE 10+
  &::-webkit-scrollbar {
    display: none; // Chrome, Safari, Opera
  }

  button {
    flex: 0 0 auto;
    min-width: 110px;
    scroll-snap-align: start;

    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.7rem;

    background: rgba(255, 255, 255, 0.1);
    padding: 0.6rem;
    border: none;
    border-radius: 12px;
    box-shadow: 0 4px 8px rgba(77, 182, 172, 0.4);
    cursor: pointer;

    font-weight: 700;
    font-size: 1rem;
    white-space: nowrap;
    user-select: none;

    transition:
      background-color 0.3s ease,
      box-shadow 0.3s ease;

    &.active {
      background-color: #4db6ac;
      box-shadow: 0 6px 14px rgba(0, 137, 123, 0.8);
    }

    &:hover:not(.active) {
      background-color: #4db6ac;
      box-shadow: 0 6px 12px rgba(77, 182, 172, 0.7);
    }
  }
}

.queue-row {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  background-color: rgba(255, 255, 255, 0.15);
  padding: 1rem;
  border-radius: 0.75rem;
  gap: 0.75rem;

  span {
    flex: 1 1 auto;
    text-align: center;
    font-weight: 500;
    min-width: 60px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  svg {
    flex-shrink: 0;
    width: 20px;
    height: 20px;
    margin-right: 0.5rem;
  }
}

// Статуси
.status-gray {
  color: #9e9e9e;
  fill: #9e9e9e !important;
}
.status-green {
  color: #4caf50;
  fill: #4caf50 !important;
}
.status-yellow {
  color: #f8b201;
  fill: #f8b201 !important;
}
.status-red {
  color: #f44336;
  fill: #f44336 !important;
}

.gray-text {
  color: #9e9e9e;
}

.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: all 0.3s ease;
  overflow: hidden;
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  max-height: 0;
  opacity: 0;
  margin-top: 0;
  margin-bottom: 0;
  padding-top: 0;
  padding-bottom: 0;
  transform: translateY(-15px);
}

.slide-fade-enter-to,
.slide-fade-leave-from {
  max-height: 100px; // або скільки треба
  opacity: 1;
  margin-top: 0.5rem;
  margin-bottom: 0.5rem;
  padding-top: 0.25rem;
  padding-bottom: 0.25rem;
  transform: translateY(0);
}
.error-msg {
  color: #f44336;
  background: rgba(244, 67, 54, 0.1);
  text-align: center;
  border-radius: 8px;
  margin-top: 0.5rem;
  margin-bottom: 0.5rem;
  padding-top: 0.25rem;
  padding-bottom: 0.25rem;
  font-weight: 700;
}
.time-info {
  white-space: pre-line;
  margin: 0.5rem 0 1rem;
  font-weight: 500;
  font-size: 1rem;
  color: #00796b;
  text-align: center;
}
</style>
