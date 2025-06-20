<script setup>
import { ref, onMounted } from "vue"

const currentTime = ref("")
const currentDate = ref("")

function formatTime(date) {
  return date.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  })
}

function updateTime() {
  const now = new Date()
  currentTime.value = formatTime(now)
  currentDate.value = now.toLocaleDateString()
}

onMounted(() => {
  updateTime() // Початкове встановлення
  setInterval(updateTime, 1000) // Оновлення щосекунди
})
</script>

<template>
  <client-only>
    <div class="time-data">
      <div class="data">{{ currentDate }}</div>
      <div class="time">{{ currentTime }}</div>
    </div>
  </client-only>
</template>

<style lang="scss" scoped>
.time-data {
  display: flex;
  column-gap: 20px;
}
.time,
.data {
  font-weight: 500;
  font-size: 14px;
  line-height: 1.25;
  text-align: center;
  color: #141fec;
}
</style>
