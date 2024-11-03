<script setup>
const currentTime = ref(new Date().toLocaleTimeString())
const currentDate = ref(new Date().toLocaleDateString())
const weather = ref("")
const usdRate = ref("")
const plnRate = ref("")
const euroRate = ref("")
// Функція для форматування часу

// Функція для оновлення часу
function updateTime() {
  const now = new Date()
  currentTime.value = now.toLocaleTimeString()
  currentDate.value = now.toLocaleDateString() // Дата залишається без змін
  // Перевірка, чи досягнуто 00:00:00
  if (
    now.getHours() === 0 &&
    now.getMinutes() === 0 &&
    now.getSeconds() === 0
  ) {
    currentDate.value = now.toLocaleDateString() // Оновлення дати
  }
}
// Ініціалізація дати
currentDate.value = new Date().toLocaleDateString()

onMounted(() => {
  // Оновлення часу кожну хвилину
  updateTime() // Викликати один раз для ініціалізації
  setInterval(updateTime, 1000)

  // Функція для отримання координат
  const getCoordinates = async () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords
          await fetchWeather(latitude, longitude)
          const today = new Date()
          const formattedDate = today
            .toISOString()
            .slice(0, 10)
            .replace(/-/g, "")
          await fetchExchangeRate("USD", formattedDate)
          await fetchExchangeRate("PLN", formattedDate)
          await fetchExchangeRate("EUR", formattedDate)
        },
        async () => {
          // Використовуємо дефолтні координати Львова
          await fetchWeather(49.8397, 24.0297)
          const today = new Date()
          const formattedDate = today
            .toISOString()
            .slice(0, 10)
            .replace(/-/g, "")
          await fetchExchangeRate("USD", formattedDate)
          await fetchExchangeRate("PLN", formattedDate)
          await fetchExchangeRate("EUR", formattedDate)
        }
      )
    } else {
      // Якщо геолокація недоступна, використовуємо дефолтні координати Львова
      await fetchWeather(49.8397, 24.0297)
    }
  }

  // Отримуємо координати користувача
  getCoordinates()

  // Оновлюємо погоду кожну годину
  setInterval(() => {
    const now = new Date()
    // Отримуємо координати знову перед оновленням погоди
    getCoordinates()
  }, 3600000) // 3600000 мс = 1 година
})

// Функція для отримання погоди
async function fetchWeather(lat, lon) {
  try {
    const apiKey = "759916e1b82682818d6bab4555fc2340"
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric&lang=ua`
    )

    // Перевірка, чи відповідь успішна
    if (!response.ok) {
      throw new Error(`HTTP помилка! Статус: ${response.status}`)
    }

    const data = await response.json()

    const cityName = data.name // Назва міста
    const weatherDescription = data.weather[0].description // Опис погоди
    const temperature = data.main.temp // Температура
    // console.log("Отримані дані Погоди:", data)
    // Формування рядка для відображення
    weather.value = `Погода в ${cityName}: ${weatherDescription}, ${temperature}°C`
  } catch (error) {
    console.error("Помилка отримання погоди:", error)
    weather.value = "Не вдалося отримати дані про погоду"
  }
}

// Функція для отримання курсу валют
async function fetchExchangeRate(currencyCode, dateFormat) {
  try {
    const response = await fetch(
      `/api/exchangeRate?currencyCode=${currencyCode}&dateFormat=${dateFormat}`
    )

    if (!response.ok) {
      throw new Error(`Помилка отримання курсу: ${response.status}`)
    }

    const data = await response.json()
    // console.log("Отримані дані Курсу :", data)

    if (data.length) {
      const rate = data[0].rate
      if (currencyCode === "USD") {
        usdRate.value = `USD : ${rate},`
      } else if (currencyCode === "PLN") {
        plnRate.value = `PLN : ${rate} `
      } else if (currencyCode === "EUR") {
        euroRate.value = `EUR : ${rate}, `
      }
    } else {
      console.error(`Курс для ${currencyCode} не знайдено.`)
    }
  } catch (error) {
    console.error("Помилка:", error.message)
    euroRate.value = ""
    usdRate.value = ""
    plnRate.value = ""
  }
}
</script>
<template>
  <div>
    <p>Час: {{ currentTime }}</p>
    <p>Дата: {{ currentDate }}</p>
    <p>{{ weather }}</p>
    <p>{{ euroRate }} {{ usdRate }} {{ plnRate }}</p>
  </div>
</template>
