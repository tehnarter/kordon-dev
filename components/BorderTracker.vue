<script setup>
import { ref, onMounted, onUnmounted } from "vue"
import { useFetch } from "#app"

const startCoordinates = { lat: 50.4501, lon: 30.5234 } // Початкова точка
const endCoordinates = { lat: 49.8397, lon: 24.0297 } // Кінцева точка

const status = ref("Чекаємо на наближення до початкових координат...")
const timeElapsed = ref(0)
const currentLocation = ref(null) // Поточні координати для виведення на екран
const accuracy = ref(null) // Змінна для точності

let startTime = null
let watchId = null // ID для стеження, щоб зупинити його при демонтуванні

// Функція для обчислення відстані між двома координатами
const getDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371e3 // Радіус Землі в метрах
  const φ1 = (lat1 * Math.PI) / 180
  const φ2 = (lat2 * Math.PI) / 180
  const Δφ = ((lat2 - lat1) * Math.PI) / 180
  const Δλ = ((lon2 - lon1) * Math.PI) / 180

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}

// Успішний зворотний виклик для початку відстеження
const successCallback = (position) => {
  const { latitude, longitude, accuracy: positionAccuracy } = position.coords
  currentLocation.value = `Широта: ${latitude}, Довгота: ${longitude}`
  accuracy.value = Math.round(positionAccuracy) // Округляємо точність до цілого числа

  const distanceToStart = getDistance(
    latitude,
    longitude,
    startCoordinates.lat,
    startCoordinates.lon
  )

  if (distanceToStart < 500 && !startTime) {
    startTime = Date.now()
    status.value = "Час проходження розпочато!"
  }

  const distanceToEnd = getDistance(
    latitude,
    longitude,
    endCoordinates.lat,
    endCoordinates.lon
  )
  if (distanceToEnd < 500 && startTime) {
    const endTime = Date.now()
    timeElapsed.value = ((endTime - startTime) / 1000).toFixed(2)
    saveTimeToDatabase(timeElapsed.value)
    status.value = "Час проходження завершено!"
    navigator.geolocation.clearWatch(watchId) // Зупиняємо стеження
  }
}

// Зворотний виклик для обробки помилок
const errorCallback = (error) => {
  console.error(error)
  status.value = "Помилка отримання геолокації"
}

// Функція для збереження часу в базу даних
const saveTimeToDatabase = async (elapsedTime) => {
  await useFetch("/api/saveTime", {
    method: "POST",
    body: { time: elapsedTime },
  })
}

// Початковий запит на доступ до геолокації при монтуванні компонента
onMounted(() => {
  if (navigator.geolocation) {
    watchId = navigator.geolocation.watchPosition(
      successCallback,
      errorCallback,
      {
        enableHighAccuracy: true, // Максимальна точність
        timeout: 30000, // Максимальний час очікування відповіді (мс)
        maximumAge: 0, // Як довго можна використовувати кешовані дані (мс)
      }
    )
  } else {
    status.value = "Геолокація не підтримується"
  }
})

// Зупинка відстеження при демонтуванні компонента
onUnmounted(() => {
  if (watchId !== null) {
    navigator.geolocation.clearWatch(watchId)
  }
})
</script>

<template>
  <div class="tracker-card">
    <h2 class="tracker-title">Відстеження проходження кордону</h2>
    <div
      class="tracker-status"
      :class="{ success: timeElapsed, error: status.includes('Помилка') }"
    >
      {{ status }}
    </div>

    <div class="tracker-info">
      <div v-if="timeElapsed" class="tracker-info__item">
        <span>⏱ Час проходження:</span>
        <strong>{{ timeElapsed }} сек</strong>
      </div>
      <div v-if="currentLocation" class="tracker-info__item">
        <span>📍 Координати:</span>
        <strong>{{ currentLocation }}</strong>
      </div>
      <div v-if="accuracy" class="tracker-info__item">
        <span>🎯 Точність:</span>
        <strong>{{ accuracy }} м</strong>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.tracker-card {
  max-width: 600px;
  margin: 30px auto;
  padding: 24px;
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.tracker-title {
  font-size: 20px;
  margin-bottom: 16px;
  font-weight: 600;
  text-align: center;
}

.tracker-status {
  text-align: center;
  font-size: 16px;
  margin-bottom: 24px;
  padding: 10px 16px;
  border-radius: 8px;
  background-color: rgba(255, 255, 255, 0.15);
  transition: background 0.3s;

  &.success {
    background-color: rgba(76, 175, 80, 0.3); // Зелений
  }

  &.error {
    background-color: rgba(244, 67, 54, 0.3); // Червоний
  }
}

.tracker-info {
  display: flex;
  flex-direction: column;
  gap: 12px;

  &__item {
    background: rgba(255, 255, 255, 0.1);
    padding: 12px 16px;
    border-radius: 10px;
    font-size: 15px;
    display: flex;
    justify-content: space-between;
    align-items: center;

    span {
      opacity: 0.8;
    }

    strong {
      font-weight: 500;
    }
  }
}

// Адаптивність
@media (max-width: 500px) {
  .tracker-card {
    padding: 16px;
    border-radius: 12px;
  }

  .tracker-info__item {
    flex-direction: column;
    align-items: flex-start;
    gap: 4px;
  }
}
</style>
