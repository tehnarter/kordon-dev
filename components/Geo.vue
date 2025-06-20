<script setup lang="ts">
import { ref, onMounted } from "vue"

const weather = ref("Завантаження погоди...")
const currentRate = ref("Завантаження курсів...")
const rates = ref<string[]>([])
let idx = 0

// Нові реактивні для часу/погоди
const wtItems = [{ type: "weather" }, { type: "time" }]
const wtIndex = ref(0)

const defaultCoords = { lat: 50.4333, lon: 30.5167 }

// Функція для чергової появи часу чи погоди
function rotateWT() {
  wtIndex.value = (wtIndex.value + 1) % wtItems.length
}

// Отримання погоди (без змін)
async function fetchWeather(lat: number, lon: number) {
  try {
    const key = "759916e1b82682818d6bab4555fc2340"
    const res = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}` +
        `&appid=${key}&units=metric&lang=ua`
    )
    if (!res.ok) throw new Error()
    const d = await res.json()
    weather.value = `${d.name}: ${d.weather[0].description}, ${Math.round(d.main.temp)}°C`
  } catch {
    weather.value = "Погода недоступна"
  }
}

// Отримання курсів (без змін)
async function fetchRates() {
  const date = new Date().toISOString().slice(0, 10).replace(/-/g, "")
  const codes = ["EUR", "USD", "PLN"]
  const promises = codes.map((cur) =>
    fetch(`/api/exchangeRate?currencyCode=${cur}&dateFormat=${date}`)
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((js) => (js?.[0]?.rate ? `${cur} ${js[0].rate}` : `${cur} —`))
      .catch(() => `${cur} —`)
  )
  rates.value = await Promise.all(promises)
  idx = 0
  currentRate.value = rates.value[idx]
}

// Змінює курс
function rotateRate() {
  if (rates.value.length) {
    idx = (idx + 1) % rates.value.length
    currentRate.value = rates.value[idx]
  }
}

// Отримання координат
function getCoords(): Promise<{ lat: number; lon: number }> {
  return new Promise((resolve) => {
    if (!navigator.geolocation) return resolve(defaultCoords)
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => resolve({ lat: coords.latitude, lon: coords.longitude }),
      () => resolve(defaultCoords),
      { timeout: 20000, maximumAge: 60000 }
    )
  })
}

onMounted(async () => {
  const { lat, lon } = await getCoords()
  await fetchWeather(lat, lon)
  await fetchRates()

  // Ротація часу/погоди
  setInterval(rotateWT, 7500)
  // Оновлення щогодини
  setInterval(async () => {
    const c = await getCoords()
    fetchWeather(c.lat, c.lon)
    fetchRates()
  }, 3600000)
  // Ротація курсів
  setInterval(rotateRate, 15000)
})
</script>

<template>
  <div class="geo">
    <!-- Анімація погоди/часу -->
    <div class="rotate-container">
      <transition name="fade" mode="out-in">
        <div :key="wtItems[wtIndex].type" class="rotate-item">
          <template v-if="wtItems[wtIndex].type === 'weather'">
            <div class="weather">{{ weather }}</div>
          </template>
          <template v-else>
            <TimeDate />
          </template>
        </div>
      </transition>
    </div>

    <!-- Анімація курсів -->
    <transition name="fade" mode="out-in">
      <div class="rate" :key="currentRate">{{ currentRate }}</div>
    </transition>
  </div>
</template>

<style scoped lang="scss">
.geo {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.1rem;
  width: 100%;
}

.rotate-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 1rem;
  overflow: hidden;
}

.rotate-item {
  font-family: Unbounded;
  font-weight: 500;
  font-size: 16px;
  color: #141fec;
  text-align: center;
}

.rate {
  font-weight: 500;
  font-size: 16px;
  line-height: 1.25;
  text-align: center;
  color: #141fec;
  min-height: 1.25em; // Щоб не скакало при появі/зникненні
}

/* Однакова анімація для обох блоків */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 5s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
