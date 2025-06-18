<script setup>
import { ref, onMounted } from "vue"
import { useFetch } from "#app"

const borderPointName = ref("Назва кордону")
const queueData = ref({
  buses: "Завантаження...",
  cars: "Завантаження...",
  tir: "Завантаження...",
  foot: "Завантаження...",
})
const waitTimeData = ref({
  buses: "Завантаження...",
  cars: "Завантаження...",
  tir: "Завантаження...",
  foot: "Завантаження...",
})

// Функція для отримання даних про чергу з бази даних
async function fetchQueueData() {
  try {
    console.log("Виклик fetchQueueData")

    const { data, error } = await $fetch(
      "http://localhost:1337/api/border-queues"
    )

    if (error || !data) {
      // Якщо немає даних або сталася помилка
      queueData.value = {
        buses: "Дані відсутні",
        cars: "Дані відсутні",
        tir: "Дані відсутні",
        foot: "Дані відсутні",
      }
      waitTimeData.value = {
        buses: "Дані відсутні",
        cars: "Дані відсутні",
        tir: "Дані відсутні",
        foot: "Дані відсутні",
      }
      return
    }

    // Перевірка наявності даних і обчислення середнього значення для кожного кордону
    let busesQueue = []
    let carsQueue = []
    let tirQueue = []
    let footQueue = []

    // Перебираємо всі записи в масиві data
    data.forEach((entry) => {
      if (entry.buses !== null) busesQueue.push(entry.buses)
      if (entry.cars !== null) carsQueue.push(entry.cars)
      if (entry.tir !== null) tirQueue.push(entry.tir)
      if (entry.foot !== null) footQueue.push(entry.foot)
    })

    // Обчислюємо середні значення
    queueData.value = {
      buses:
        busesQueue.length > 0
          ? calculateAverageQueue(busesQueue)
          : "Дані відсутні",
      cars:
        carsQueue.length > 0
          ? calculateAverageQueue(carsQueue)
          : "Дані відсутні",
      tir:
        tirQueue.length > 0 ? calculateAverageQueue(tirQueue) : "Дані відсутні",
      foot:
        footQueue.length > 0
          ? calculateAverageQueue(footQueue)
          : "Дані відсутні",
    }

    // Для часу очікування, якщо такі дані є
    waitTimeData.value = {
      buses:
        busesQueue.length > 0
          ? calculateAverageTime(busesQueue)
          : "Дані відсутні",
      cars:
        carsQueue.length > 0
          ? calculateAverageTime(carsQueue)
          : "Дані відсутні",
      tir:
        tirQueue.length > 0 ? calculateAverageTime(tirQueue) : "Дані відсутні",
      foot:
        footQueue.length > 0
          ? calculateAverageTime(footQueue)
          : "Дані відсутні",
    }
  } catch (error) {
    console.error("Помилка отримання даних:", error)
    queueData.value = {
      buses: "Дані відсутні",
      cars: "Дані відсутні",
      tir: "Дані відсутні",
      foot: "Дані відсутні",
    }
    waitTimeData.value = {
      buses: "Дані відсутні",
      cars: "Дані відсутні",
      tir: "Дані відсутні",
      foot: "Дані відсутні",
    }
  }
}

// Функція для обчислення середнього значення черги
function calculateAverageQueue(queue) {
  const total = queue.reduce((acc, curr) => acc + curr, 0)
  return total / queue.length
}

// Функція для обчислення середнього часу (для прикладу, якщо дані є)
function calculateAverageTime(waitTimes) {
  const total = waitTimes.reduce((acc, curr) => acc + curr, 0)
  return total / waitTimes.length
}

// Запуск запиту при монтуванні компонента
onMounted(() => {
  fetchQueueData()
  setInterval(fetchQueueData, 3600000) // Оновлення щогодини
})
</script>

<template>
  <div class="border-queue">
    <h2>{{ borderPointName }}</h2>
    <p><strong>Черга для автобусів:</strong> {{ queueData.buses }}</p>
    <p>
      <strong>Час проходження для автобусів:</strong>
      {{ waitTimeData.buses }} хвилин
    </p>

    <p><strong>Черга для легкових машин:</strong> {{ queueData.cars }}</p>
    <p>
      <strong>Час проходження для легкових машин:</strong>
      {{ waitTimeData.cars }} хвилин
    </p>

    <p><strong>Черга для TIR:</strong> {{ queueData.tir }}</p>
    <p>
      <strong>Час проходження для TIR:</strong> {{ waitTimeData.tir }} хвилин
    </p>

    <p v-if="queueData.foot !== 'Дані відсутні'">
      <strong>Черга для пішого переходу:</strong> {{ queueData.foot }}
    </p>
    <p v-else>Піший перехід відсутній</p>

    <p v-if="waitTimeData.foot !== 'Дані відсутні'">
      <strong>Час проходження для пішого переходу:</strong>
      {{ waitTimeData.foot }} хвилин
    </p>
  </div>
</template>

<style scoped>
.border-queue {
  display: flex;
  flex-direction: column;
  align-items: center;
  font-family: Arial, sans-serif;
  color: #333;
}
h2 {
  color: #2e6da4;
}
</style>
