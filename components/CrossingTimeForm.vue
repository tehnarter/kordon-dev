<template>
  <div>
    <h2>🧪 Час проходження (тестова форма)</h2>

    <form @submit.prevent="submitForm" v-if="sessionToken">
      <label>
        Час проходження (хвилини):
        <input
          type="number"
          v-model.number="form.crossing_time_minutes"
          required
          min="0"
        />
      </label>
      <br />

      <label>
        Час фіксації:
        <input type="datetime-local" v-model="form.reported_at" required />
      </label>
      <br />

      <button type="submit">Надіслати</button>
    </form>

    <p v-else style="color: red">
      ❌ Немає активного `session_token` — відправка недоступна.
    </p>

    <p v-if="error" style="color: red">{{ error }}</p>
    <p v-if="success" style="color: green">{{ success }}</p>
  </div>
</template>

<script setup lang="ts">
import { ref, watchEffect, onMounted } from "vue"
import { useSessionToken } from "@/composables/useSessionToken"

const { sessionToken, clearToken, initToken } = useSessionToken()

const form = ref({
  crossing_time_minutes: null as number | null,
  reported_at: "",
})

const error = ref("")
const success = ref("")

onMounted(() => {
  initToken()
})

const submitForm = async () => {
  error.value = ""
  success.value = ""

  if (!sessionToken.value) {
    error.value = "❌ Немає активного токена. Надсилання заборонено."
    return
  }

  try {
    const body = {
      session_token: sessionToken.value,
      crossing_time_minutes: form.value.crossing_time_minutes,
      reported_at: form.value.reported_at,
    }

    const res = await fetch("http://border/api/add-crossing-time.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    })

    const result = await res.json()

    if (!res.ok) {
      error.value = result.error || "Помилка відправки"
    } else {
      success.value = "✅ Час проходження успішно додано!"
      clearToken()
      form.value.crossing_time_minutes = null
      form.value.reported_at = ""
    }
  } catch (e) {
    error.value = "❌ Запит не вдався: " + e.message
  }
}
</script>
