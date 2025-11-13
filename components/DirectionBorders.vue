<script setup lang="ts">
import { ref, onMounted, watch, computed } from "vue"
import { useI18n } from "vue-i18n"
const { t } = useI18n()
const { menu } = useMenu()

interface BorderQueuesTimes {
  cars: number | string
  buses: number | string
  tir: number | string
  foot: number | string
}

interface BorderData {
  id: number
  name: string
  queues: BorderQueuesTimes
  times: BorderQueuesTimes
}

// ✅ Динамічне формування напрямків з menu
const directions = computed(() =>
  menu.value.map((d) => ({
    id: d.key,
    from: d.from ?? d.key.split("-")[0].toUpperCase(),
    to: d.to ?? d.key.split("-")[1].toUpperCase(),
    label: d.name,
    flags: d.flags ?? {
      from: `/flags/${(d.from ?? d.key.split("-")[0]).toLowerCase()}.svg`,
      to: `/flags/${(d.to ?? d.key.split("-")[1]).toLowerCase()}.svg`,
    },
  }))
)

const selectedDirection = ref("")
const borders = ref<BorderData[]>([])
const loading = ref(true)
const error = ref("")

function normalizeValue(value: any): number | string {
  return value == null ? "-" : value
}

function getStatusClass(type: string, value: string | number): string {
  if (type === "buses") {
    if (value === "-" || value === "Дані відсутні") return "status-gray"
    const num = Number(value)
    if (num <= 2) return "status-green"
    if (num <= 5) return "status-yellow"
    return "status-red"
  } else {
    // для інших транспортів залишаємо старі пороги
    if (value === "-" || value === "Дані відсутні") return "status-gray"
    const num = Number(value)
    if (isNaN(num)) return "status-gray"
    if (num <= 10) return "status-green"
    if (num <= 30) return "status-yellow"
    return "status-red"
  }
}

function getBorderLabel(borderName: string): string {
  const directionKeyNormalized = selectedDirection.value.toLowerCase()
  const direction = menu.value.find(
    (d) => d.key.toLowerCase() === directionKeyNormalized
  )
  if (!direction) return borderName
  const border = direction.borders.find(
    (b) => b.key.toLowerCase() === borderName.toLowerCase()
  )
  return border?.label ?? borderName
}
const api_key = useRuntimeConfig().public.apiKey
const api_url = useRuntimeConfig().public.apiBase
async function fetchBorders(directionId: string): Promise<void> {
  loading.value = true
  error.value = ""

  try {
    const response = await $fetch(
      `${api_url}/api/get-borders.php?direction=${encodeURIComponent(directionId)}&api_key=${api_key}`
    )

    let data: any[] = []

    if (typeof response === "string") {
      data = JSON.parse(response)
    } else if (Array.isArray(response)) {
      data = response
    } else {
      throw new Error("unexpected_format")
    }

    borders.value = data.map((b) => ({
      id: b.id,
      name: b.name,
      queues: {
        cars: normalizeValue(b.cars),
        buses: normalizeValue(b.buses),
        tir: normalizeValue(b.tir),
        foot: normalizeValue(b.foot),
      },
      times: {
        cars: normalizeValue(b.cars_time),
        buses: normalizeValue(b.buses_time),
        tir: normalizeValue(b.tir_time),
        foot: normalizeValue(b.foot_time),
      },
    }))
  } catch (e: any) {
    console.error("❌ fetchBorders error:", e)
    error.value = t("error")
    borders.value = []
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  const cookieDirection = useCookie<string>("user_direction").value
  const defaultDirection = directions.value[0]?.id || ""

  if (
    cookieDirection &&
    directions.value.some((d) => d.id === cookieDirection)
  ) {
    selectedDirection.value = cookieDirection
  } else {
    selectedDirection.value = defaultDirection
  }

  fetchBorders(selectedDirection.value)
})

const initial = ref(true) // прапорець першого рендера

watch(selectedDirection, (newVal) => {
  if (initial.value) {
    initial.value = false
    return // ігноруємо перший тригер
  }

  if (!newVal) {
    borders.value = []
    return
  }

  useCookie<string>("user_direction").value = newVal
  fetchBorders(newVal)
})
const transportTypes = ["cars", "buses", "tir", "foot"] as const

function getIcon(type: (typeof transportTypes)[number], statusClass: string) {
  const icons = {
    cars: ` <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-car-front-fill ${statusClass}" viewBox="0 0 16 16">
        <path d="M2.52 3.515A2.5 2.5 0 0 1 4.82 2h6.362c1 0 1.904.596 2.298 1.515l.792 1.848c.075.175.21.319.38.404.5.25.855.715.965 1.262l.335 1.679q.05.242.049.49v.413c0 .814-.39 1.543-1 1.997V13.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-1.338c-1.292.048-2.745.088-4 .088s-2.708-.04-4-.088V13.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-1.892c-.61-.454-1-1.183-1-1.997v-.413a2.5 2.5 0 0 1 .049-.49l.335-1.68c.11-.546.465-1.012.964-1.261a.8.8 0 0 0 .381-.404l.792-1.848ZM3 10a1 1 0 1 0 0-2 1 1 0 0 0 0 2m10 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2M6 8a1 1 0 0 0 0 2h4a1 1 0 1 0 0-2zM2.906 5.189a.51.51 0 0 0 .497.731c.91-.073 3.35-.17 4.597-.17s3.688.097 4.597.17a.51.51 0 0 0 .497-.731l-.956-1.913A.5.5 0 0 0 11.691 3H4.309a.5.5 0 0 0-.447.276L2.906 5.19Z"/>
      </svg>`, // залишити svg як є
    buses: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-bus-front-fill ${statusClass}" viewBox="0 0 16 16">
        <path d="M16 7a1 1 0 0 1-1 1v3.5c0 .818-.393 1.544-1 2v2a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5V14H5v1.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-2a2.5 2.5 0 0 1-1-2V8a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1V2.64C1 1.452 1.845.408 3.064.268A44 44 0 0 1 8 0c2.1 0 3.792.136 4.936.268C14.155.408 15 1.452 15 2.64V4a1 1 0 0 1 1 1zM3.552 3.22A43 43 0 0 1 8 3c1.837 0 3.353.107 4.448.22a.5.5 0 0 0 .104-.994A44 44 0 0 0 8 2c-1.876 0-3.426.109-4.552.226a.5.5 0 1 0 .104.994M8 4c-1.876 0-3.426.109-4.552.226A.5.5 0 0 0 3 4.723v3.554a.5.5 0 0 0 .448.497C4.574 8.891 6.124 9 8 9s3.426-.109 4.552-.226A.5.5 0 0 0 13 8.277V4.723a.5.5 0 0 0-.448-.497A44 44 0 0 0 8 4m-3 7a1 1 0 1 0-2 0 1 1 0 0 0 2 0m8 0a1 1 0 1 0-2 0 1 1 0 0 0 2 0m-7 0a1 1 0 0 0 1 1h2a1 1 0 1 0 0-2H7a1 1 0 0 0-1 1"/>
      </svg>`,
    tir: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-truck ${statusClass}" viewBox="0 0 16 16">
        <path d="M0 3.5A1.5 1.5 0 0 1 1.5 2h9A1.5 1.5 0 0 1 12 3.5V5h1.02a1.5 1.5 0 0 1 1.17.563l1.481 1.85a1.5 1.5 0 0 1 .329.938V10.5a1.5 1.5 0 0 1-1.5 1.5H14a2 2 0 1 1-4 0H5a2 2 0 1 1-3.998-.085A1.5 1.5 0 0 1 0 10.5zm1.294 7.456A2 2 0 0 1 4.732 11h5.536a2 2 0 0 1 .732-.732V3.5a.5.5 0 0 0-.5-.5h-9a.5.5 0 0 0-.5.5v7a.5.5 0 0 0 .294.456M12 10a2 2 0 0 1 1.732 1h.768a.5.5 0 0 0 .5-.5V8.35a.5.5 0 0 0-.11-.312l-1.48-1.85A.5.5 0 0 0 13.02 6H12zm-9 1a1 1 0 1 0 0 2 1 1 0 0 0 0-2m9 0a1 1 0 1 0 0 2 1 1 0 0 0 0-2"/>
      </svg>`,
    foot: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-person-walking ${statusClass}" viewBox="0 0 16 16">
        <path d="M9.5 1.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0M6.44 3.752A.75.75 0 0 1 7 3.5h1.445c.742 0 1.32.643 1.243 1.38l-.43 4.083a1.8 1.8 0 0 1-.088.395l-.318.906.213.242a.8.8 0 0 1 .114.175l2 4.25a.75.75 0 1 1-1.357.638l-1.956-4.154-1.68-1.921A.75.75 0 0 1 6 8.96l.138-2.613-.435.489-.464 2.786a.75.75 0 1 1-1.48-.246l.5-3a.75.75 0 0 1 .18-.375l2-2.25Z"/>
        <path d="M6.25 11.745v-1.418l1.204 1.375.261.524a.8.8 0 0 1-.12.231l-2.5 3.25a.75.75 0 1 1-1.19-.914zm4.22-4.215-.494-.494.205-1.843.006-.067 1.124 1.124h1.44a.75.75 0 0 1 0 1.5H11a.75.75 0 0 1-.531-.22Z"/>
      </svg>`,
  }
  return icons[type] ?? ""
}
function formatWaitTime(value: string | number) {
  if (value === "-" || value === null) return "-"

  const minutes = Number(value)
  if (isNaN(minutes)) return "-"

  if (minutes < 60) {
    return `${minutes} ${t("tracker.minutes")}`
  }

  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60
  return mins > 0
    ? `${hours} ${t("tracker.hours")} ${mins} ${t("tracker.minutes")}`
    : `${hours} год`
}
</script>

<template>
  <div class="direction-borders">
    <div class="direction-buttons">
      <button
        v-for="dir in directions"
        :key="dir.id"
        :class="{ active: dir.id === selectedDirection }"
        @click="selectedDirection = dir.id"
        type="button"
      >
        <img :src="dir.flags.from" alt="Flag from" />
        <span>{{ dir.from }}</span>
        <span
          ><svg
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
            /></svg
        ></span>

        <span>{{ dir.to }}</span>
        <img :src="dir.flags.to" alt="Flag to" />
      </button>
    </div>

    <transition name="fade" mode="out-in">
      <div v-if="loading" key="loading" class="loading">{{ t("loading") }}</div>
      <div v-else-if="error" key="error" class="error">{{ error }}</div>
      <div v-else-if="borders.length" key="data">
        <div v-for="border in borders" :key="border.id" class="border-card">
          <div class="border-name">{{ getBorderLabel(border.name) }}</div>

          <div class="traffic-row">
            <div
              class="traffic-cell"
              v-for="type in transportTypes"
              :key="type"
            >
              <div
                class="icon"
                v-html="
                  getIcon(type, getStatusClass(type, border.queues[type]))
                "
              ></div>
              <div class="traffic-values">
                <span :class="getStatusClass(type, border.queues[type])">
                  {{ border.queues[type] }}
                </span>
                <small :class="{ 'status-gray': border.times[type] === '-' }">
                  {{ formatWaitTime(border.times[type]) }}
                </small>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div v-else key="empty" class="empty">{{ t("empty") }}</div>
    </transition>
  </div>
</template>

<style lang="scss">
.fade-enter-active,
.fade-leave-active {
  transition: opacity 1s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.direction-borders {
  max-width: 700px;
  width: 100%;
  margin: 0 auto;
}

.direction-buttons {
  display: flex;
  flex-wrap: nowrap;
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  -webkit-overflow-scrolling: touch;
  gap: 0.75rem;
  padding: 0.5rem 0;
  margin: 1rem 0;
  width: 100%;

  // Приховуємо скроллбар у всіх браузерах
  scrollbar-width: none; // Firefox
  -ms-overflow-style: none; // IE 10+
  &::-webkit-scrollbar {
    display: none; // Chrome/Safari/Edge
  }

  button {
    flex: 0 0 auto;
    display: flex;
    align-items: center;
    gap: 0.4rem;
    padding: 0.6rem 0.75rem;
    border: none;
    border-radius: 12px;
    background: rgba(255, 255, 255, 0.08);
    box-shadow: 0 4px 8px rgba(77, 182, 172, 0.4);
    scroll-snap-align: start;
    cursor: pointer;
    transition:
      background-color 0.3s ease,
      box-shadow 0.3s ease;

    img {
      width: 28px;
      height: 18px;
      border-radius: 3px;
      object-fit: cover;
      box-shadow: 0 0 3px rgba(0, 0, 0, 0.25);
      user-select: none;
      flex-shrink: 0;
    }

    span {
      font-size: 0.95rem;
      font-weight: 700;
      white-space: nowrap;
      user-select: none;
    }

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

// Карта кордону
.border-card {
  background: rgba(255, 255, 255, 0.1);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
  border-radius: 1rem;
  padding: 0.75rem;
  margin-bottom: 0.75rem;
}

.border-name {
  font-size: 1.4rem;
  font-weight: 700;
  text-align: center;
  margin-bottom: 0.5rem;
  color: #4db6ac;
}

// Сітка для черг
.traffic-row {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 0.5rem;
  margin-top: 0.5rem;
  text-align: center;
}

.traffic-cell {
  display: flex;
  flex-direction: column;
  align-items: center;
  background: rgba(255, 255, 255, 0.08);
  padding: 0.5rem;
  border-radius: 0.5rem;

  .icon {
    font-size: 1.5rem;
    margin-bottom: 0.25rem;
  }

  .traffic-values {
    span {
      display: block;
      font-weight: 500;
    }

    small {
      font-size: 0.85rem;
      font-weight: 500;
    }
  }
}

// Статуси
.status-gray {
  color: #9e9e9e;
}
.status-green {
  color: #4caf50;
}
.status-yellow {
  color: #f8b201;
}
.status-red {
  color: #f44336;
}

// Завантаження/Помилка
.loading,
.empty {
  margin: 1rem 0;
  text-align: center;
  font-weight: 500;
}
.error {
  text-align: center;
  font-weight: 700;
  color: #f44336;
  background: rgba(244, 67, 54, 0.1);
  padding: 1rem;
  border-radius: 0.75rem;
}
</style>
