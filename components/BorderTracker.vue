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
        timeout: 10000, // Максимальний час очікування відповіді (мс)
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
  <div>
    <h2>Відстеження часу проходження кордону</h2>
    <p v-if="status">{{ status }}</p>
    <p v-if="timeElapsed">Час проходження: {{ timeElapsed }} секунд</p>
    <p v-if="currentLocation">Теперішні координати: {{ currentLocation }}</p>
    <p v-if="accuracy">Точність: {{ accuracy }} метрів</p>
    <!-- Виводимо точність -->
  </div>
</template>

<style lang="scss"></style>
