<script setup lang="ts">
import { ref, onMounted } from "vue"
import TimeDate from "@/components/TimeDate.vue" // або свій шлях до компонента часу

const weather = ref("Завантаження погоди...")
const currentRate = ref("Завантаження курсів...")
const rates = ref<string[]>([])
let idx = 0

const defaultCoords = { lat: 50.4333, lon: 30.5167 }

const wtItems = [{ type: "weather" }, { type: "time" }]
const wtIndex = ref(0)

function rotateWT() {
  wtIndex.value = (wtIndex.value + 1) % wtItems.length
}

function rotateRate() {
  if (rates.value.length) {
    idx = (idx + 1) % rates.value.length
    currentRate.value = rates.value[idx]
  }
}

async function fetchWeather(lat: number, lon: number) {
  try {
    const key = "759916e1b82682818d6bab4555fc2340"
    const res = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${key}&units=metric&lang=ua`
    )
    if (!res.ok) throw new Error()
    const d = await res.json()
    weather.value = `${d.name}: ${d.weather[0].description}, ${Math.round(d.main.temp)}°C`
  } catch {
    weather.value = "Погода недоступна"
  }
}
const api_key = useRuntimeConfig().public.apiKey
const api_url = useRuntimeConfig().public.apiBase
async function fetchRates() {
  try {
    const res = await fetch(
      `${api_url}/api/get-rates-proxy.php?api_key=${api_key}`
    )
    if (!res.ok) throw new Error("Network error")
    const data = await res.json()

    // data: { pln: [...], usd: [...], eur: [...] }

    const codes = ["PLN", "USD", "EUR"]
    rates.value = codes.map((code) => {
      const curCode = code.toLowerCase()
      const rateObj = data[curCode]?.[0]
      if (rateObj?.rate) {
        return `${code} ${rateObj.rate}`
      }
      return `${code} —`
    })

    currentRate.value = rates.value[0]
  } catch {
    rates.value = ["PLN —", "USD —", "EUR —"]
    currentRate.value = rates.value[0]
  }
}

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

  setInterval(rotateWT, 7500)
  setInterval(rotateRate, 15000)
  setInterval(async () => {
    const coords = await getCoords()
    fetchWeather(coords.lat, coords.lon)
    fetchRates()
  }, 3600000)
})
</script>

<template>
  <div class="geo">
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
  min-height: 1.25em;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 5s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
