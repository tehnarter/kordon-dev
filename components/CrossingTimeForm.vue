<script setup lang="ts">
// ...код скрипта без змін (той самий, що попередній)...
import { ref, onMounted, computed } from "vue"
import { useSessionToken } from "@/composables/useSessionToken"

const { sessionToken, clearToken, initToken } = useSessionToken()

const form = ref({
  crossing_time_minutes: null as number | null,
})

const error = ref("")
const success = ref("")
const reportedAt = ref("")

onMounted(() => {
  initToken()
  setReportedAtNowUTC()
})

function setReportedAtNowUTC() {
  const now = new Date()
  const pad = (n: number) => n.toString().padStart(2, "0")
  const year = now.getUTCFullYear()
  const month = pad(now.getUTCMonth() + 1)
  const day = pad(now.getUTCDate())
  const hours = pad(now.getUTCHours())
  const minutes = pad(now.getUTCMinutes())
  const seconds = pad(now.getUTCSeconds())

  reportedAt.value = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
}

const formattedReportedAt = computed(() => reportedAt.value)

const submitForm = async () => {
  error.value = ""
  success.value = ""

  if (!sessionToken.value) {
    error.value = "❌ Немає активного токена. Надсилання заборонено."
    return
  }

  if (
    form.value.crossing_time_minutes === null ||
    form.value.crossing_time_minutes < 0
  ) {
    error.value =
      "Будь ласка, введіть коректний час проходження (0 або більше хвилин)."
    return
  }

  try {
    const body = {
      session_token: sessionToken.value,
      crossing_time_minutes: form.value.crossing_time_minutes,
      reported_at: reportedAt.value,
    }

    const res = await fetch("http://192.168.0.107/api/add-crossing-time.php", {
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
      setReportedAtNowUTC()
    }
  } catch (e: any) {
    error.value = "❌ Запит не вдався: " + (e.message || e)
  }
}
</script>

<template>
  <div class="crossing-time-container">
    <h2>Час проходження</h2>

    <form
      @submit.prevent="submitForm"
      v-if="sessionToken"
      class="crossing-form"
    >
      <label class="form-label">
        Час проходження (хвилини):
        <input
          type="number"
          v-model.number="form.crossing_time_minutes"
          required
          min="0"
          class="form-input"
          placeholder="Введіть час у хвилинах"
        />
      </label>

      <p class="reported-at">
        Час фіксації: <span>{{ formattedReportedAt }}</span> (UTC)
      </p>

      <button type="submit" class="submit-btn">Надіслати</button>
    </form>

    <p v-else class="error-message">
      ❌ Немає активного <code>session_token</code> — відправка недоступна.
    </p>

    <p v-if="error" class="error-message">{{ error }}</p>
    <p v-if="success" class="success-message">{{ success }}</p>
  </div>
</template>

<style scoped>
.crossing-time-container {
  max-width: 400px;
  margin: 2rem auto;
  padding: 1.5rem 2rem;
  border-radius: 10px;
  box-shadow: 0 4px 12px rgb(0 0 0 / 0.1);
  background-color: #ffffff;
  font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
}

h2 {
  text-align: center;
  color: #2c3e50;
  margin-bottom: 1.5rem;
}

.crossing-form {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.form-label {
  font-weight: 600;
  color: #34495e;
  display: flex;
  flex-direction: column;
  font-size: 1rem;
}

.form-input {
  margin-top: 0.4rem;
  padding: 0.5rem 0.75rem;
  font-size: 1rem;
  border: 1.8px solid #b0bec5;
  border-radius: 6px;
  transition: border-color 0.3s ease;
}

.form-input:focus {
  border-color: #26a69a;
  outline: none;
  box-shadow: 0 0 5px #26a69aaa;
}

.reported-at {
  font-size: 0.95rem;
  color: #607d8b;
  font-style: italic;
  margin-bottom: 0.5rem;
}

.reported-at span {
  font-weight: 700;
  color: #00796b;
}

.submit-btn {
  padding: 0.75rem;
  font-size: 1.1rem;
  font-weight: 700;
  color: #fff;
  background-color: #26a69a;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.25s ease;
}

.submit-btn:hover {
  background-color: #1e897b;
}

.error-message {
  margin-top: 1rem;
  font-weight: 600;
  color: #d32f2f;
  text-align: center;
}

.success-message {
  margin-top: 1rem;
  font-weight: 600;
  color: #388e3c;
  text-align: center;
}

@media (max-width: 480px) {
  .crossing-time-container {
    padding: 1rem;
    margin: 1rem;
  }

  .submit-btn {
    font-size: 1rem;
  }
}
</style>
