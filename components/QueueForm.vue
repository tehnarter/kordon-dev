<template>
  <form @submit.prevent="submitQueue">
    <div>
      <label>Назва кордону:</label>
      <select v-model="border_id" required>
        <option value="">— оберіть кордон —</option>
        <option v-for="b in borders" :key="b.id" :value="b.id">
          {{ b.name }}
        </option>
      </select>
    </div>

    <div>
      <label>Тип транспорту:</label>
      <select v-model="vehicle_type" required>
        <option value="car">Легковий</option>
        <option value="bus">Автобус</option>
        <option value="tir">TIR</option>
        <option value="pedestrian">Пішохід</option>
      </select>
    </div>

    <div>
      <label>Кількість в черзі:</label>
      <input type="number" v-model.number="queue_length" min="0" required />
    </div>

    <div>
      <label>Час черги:</label>
      <input type="datetime-local" v-model="report_time" required />
    </div>

    <button type="submit">Надіслати</button>
    <p v-if="message" :style="{ color: messageColor }">{{ message }}</p>
  </form>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue"
import { useSessionToken } from "@/composables/useSessionToken"
import { registerSession } from "@/utils/registerSession" // 🔹 Імпорт з утилс

const border_id = ref<string>("")
const vehicle_type = ref<string>("car")
const queue_length = ref<number>(0)
const report_time = ref<string>("")
const message = ref<string>("")
const messageColor = ref<string>("green")
const borders = ref<Array<{ id: number; name: string }>>([])

const { setToken } = useSessionToken()

onMounted(async () => {
  try {
    const res = await fetch("http://border/api/get-borders.php")
    borders.value = await res.json()
  } catch (e) {
    console.error("Помилка при отриманні кордонів", e)
    message.value = "Помилка завантаження кордонів"
    messageColor.value = "red"
  }
})

const submitQueue = async () => {
  message.value = ""
  messageColor.value = "green"

  if (queue_length.value < 0) {
    message.value = "Кількість не може бути від’ємною"
    messageColor.value = "red"
    return
  }

  if (!border_id.value) {
    message.value = "Будь ласка, оберіть кордон"
    messageColor.value = "red"
    return
  }

  try {
    // 🔸 Реєстрація сесії через утиліту
    const token = await registerSession()
    if (!token) {
      message.value = "❌ Не вдалося створити сесію"
      messageColor.value = "red"
      return
    }

    setToken(token) // для реактивності

    const body = {
      session_token: token,
      user_name: localStorage.getItem("name") || "Гість",
      border_id: Number(border_id.value),
      vehicle_type: vehicle_type.value,
      queue_length: queue_length.value,
      report_time: report_time.value.replace("T", " ") + ":00",
    }

    const res = await fetch("http://border/api/add-queue.php", {
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
    }
  } catch (err) {
    console.error(err)
    message.value = "Помилка відправки"
    messageColor.value = "red"
    setToken(null)
  }
}
</script>
