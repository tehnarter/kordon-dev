<script setup lang="ts">
import { ref } from "vue"
import { useSessionToken } from "@/composables/useSessionToken"
import { registerSession } from "@/utils/registerSession"

const border_name = ref<string>("")
const vehicle_type = ref<string>("car")
const queue_length = ref<number>(0)
const message = ref<string>("")
const messageColor = ref<string>("green")

const { setToken } = useSessionToken()

function getCurrentUTCTimeString() {
  const now = new Date()
  const pad = (n: number) => n.toString().padStart(2, "0")
  return (
    now.getUTCFullYear() +
    "-" +
    pad(now.getUTCMonth() + 1) +
    "-" +
    pad(now.getUTCDate()) +
    " " +
    pad(now.getUTCHours()) +
    ":" +
    pad(now.getUTCMinutes()) +
    ":00"
  )
}

const submitQueue = async () => {
  message.value = ""
  messageColor.value = "green"

  if (!border_name.value.trim()) {
    message.value = "Будь ласка, введіть назву кордону"
    messageColor.value = "red"
    return
  }

  if (queue_length.value < 0) {
    message.value = "Кількість не може бути від’ємною"
    messageColor.value = "red"
    return
  }

  try {
    const token = await registerSession()
    if (!token) {
      message.value = "❌ Не вдалося створити сесію"
      messageColor.value = "red"
      return
    }

    setToken(token)

    const body = {
      session_token: token,
      user_name: localStorage.getItem("name") || "Гість",
      border_name: border_name.value.trim(),
      vehicle_type: vehicle_type.value,
      queue_length: queue_length.value,
      report_time: getCurrentUTCTimeString(),
    }

    const res = await fetch("http://192.168.0.107/api/add-queue.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    })

    const result = await res.json()

    if (!res.ok) {
      message.value = result.error || "Помилка відправки черги"
      messageColor.value = "red"
      setToken(null)
    } else {
      message.value = "✅ Успішно відправлено!"
      messageColor.value = "green"
      // Очищаємо форму
      border_name.value = ""
      vehicle_type.value = "car"
      queue_length.value = 0
    }
  } catch (err) {
    console.error(err)
    message.value = "Помилка відправки"
    messageColor.value = "red"
    setToken(null)
  }
}
</script>

<template>
  <form @submit.prevent="submitQueue" class="queue-form">
    <div>
      <label for="border_name">Назва кордону:</label>
      <input
        id="border_name"
        type="text"
        v-model.trim="border_name"
        placeholder="Введіть назву кордону"
        required
      />
    </div>

    <div>
      <label for="vehicle">Тип транспорту:</label>
      <select id="vehicle" v-model="vehicle_type" required>
        <option value="car">Легковий</option>
        <option value="bus">Автобус</option>
        <option value="tir">TIR</option>
        <option value="pedestrian">Пішохід</option>
      </select>
    </div>

    <div>
      <label for="queue_length">Кількість в черзі:</label>
      <input
        id="queue_length"
        type="number"
        v-model.number="queue_length"
        min="0"
        required
      />
    </div>

    <button type="submit">Надіслати</button>

    <p v-if="message" :style="{ color: messageColor }">{{ message }}</p>
  </form>
</template>

<style scoped>
.queue-form {
  max-width: 400px;
  margin: auto;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
.queue-form div {
  display: flex;
  flex-direction: column;
}
.queue-form label {
  font-weight: 600;
  margin-bottom: 0.25rem;
}
.queue-form input,
.queue-form select {
  padding: 0.5rem;
  font-size: 1rem;
}
.queue-form button {
  padding: 0.75rem;
  background-color: #4db6ac;
  color: white;
  font-weight: 700;
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: background-color 0.3s ease;
}
.queue-form button:hover {
  background-color: #409389;
}
</style>
