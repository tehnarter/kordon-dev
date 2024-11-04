<script setup>
const currentTime = ref(new Date().toLocaleTimeString())
const currentDate = ref(new Date().toLocaleDateString())

// Функція для оновлення часу
function updateTime() {
  const now = new Date()
  currentTime.value = formatTime(now)
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

// Функція для форматування часу
function formatTime(date) {
  return date.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  })
}
onMounted(() => {
  // Оновлення часу кожну хвилину
  updateTime() // Викликати один раз для ініціалізації
  setInterval(updateTime, 1000)
})
</script>

<template>
  <div class="time-data">
    <div class="data">{{ currentDate }}</div>
    <div class="time">{{ currentTime }}</div>
  </div>
</template>
<style lang="scss">
.time-data {
  display: flex;
  column-gap: 20px;
}
.time {
  font-family: var(--font-family);
  font-size: 14px;
  line-height: 1.25;
  text-align: center;
  color: var(--tekst-i-elementy-na-temnom-fone);
}
.data {
  font-family: var(--font-family);
  font-weight: 500;
  font-size: 14px;
  line-height: 1.25;
  text-align: center;
  color: var(--tekst-i-elementy-na-temnom-fone);
}
</style>
