<script setup>
const weather = ref("")
const usdRate = ref("")
const plnRate = ref("")
const euroRate = ref("")

onMounted(() => {
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
    weather.value = `${cityName}: ${weatherDescription}, ${temperature}°C`
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
        usdRate.value = `USD  ${rate},`
      } else if (currencyCode === "PLN") {
        plnRate.value = `PLN  ${rate} `
      } else if (currencyCode === "EUR") {
        euroRate.value = `EUR  ${rate}, `
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
  <div class="geo">
    <div class="weather">{{ weather }}</div>
    <div class="rate">{{ euroRate }} {{ usdRate }} {{ plnRate }}</div>
  </div>
</template>
<style lang="scss">
.geo {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.weather {
  font-family: var(--font-family);
  font-weight: 500;
  font-size: 14px;
  line-height: 1.25;
  text-align: center;
  color: var(--redkost-armeyskie);
}
.rate {
  font-family: var(--font-family);
  font-weight: 500;
  font-size: 14px;
  line-height: 1.25;
  text-align: center;
  color: var(--redkost-armeyskie);
}
</style>
