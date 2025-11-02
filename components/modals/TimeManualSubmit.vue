<script setup lang="ts">
import { ref, computed, onMounted } from "vue"
import { useSessionToken } from "@/composables/useSessionToken"
import { useBorderTracker } from "@/composables/useBorderTracker"
import { useI18n } from "vue-i18n"
import { useRuntimeConfig } from "#app"

const { t } = useI18n()
const config = useRuntimeConfig()

const emit = defineEmits<{ (e: "close"): void }>()
const { sessionToken, clearToken } = useSessionToken()
const { resetStartTime } = useBorderTracker()

//  Назва пункту збережена раніше
const borderLabelFull = ref<string | null>(null)

//  Поля введення користувача
const hours = ref<number | null>(null)
const minutes = ref<number | null>(null)

//  Поточна UTC-дата
const reportedAt = ref("")
const loading = ref(false)
const message = ref<string | null>(null)

//  Отримуємо збережену назву пункту
function getSavedBorderName() {
  const saved = localStorage.getItem("border-label-full")
  if (!saved) return null
  try {
    const data = JSON.parse(saved)
    if (Date.now() > data.expiresAt) {
      localStorage.removeItem("border-label-full")
      return null
    }
    return data.value
  } catch {
    localStorage.removeItem("border-label-full")
    return null
  }
}

// Формуємо поточний UTC-час
function setReportedAtNowUTC() {
  const now = new Date()
  const pad = (n: number) => n.toString().padStart(2, "0")
  reportedAt.value = `${now.getUTCFullYear()}-${pad(now.getUTCMonth() + 1)}-${pad(now.getUTCDate())} ${pad(
    now.getUTCHours()
  )}:${pad(now.getUTCMinutes())}:${pad(now.getUTCSeconds())}`
}

//  Загальний час у хвилинах
const totalMinutes = computed(() => {
  const h = hours.value || 0
  const m = minutes.value || 0
  return h * 60 + m
})

//  Відправка часу
const submitForm = async () => {
  if (!sessionToken.value) {
    message.value = t("message.token")
    return
  }
  if (totalMinutes.value <= 0) {
    message.value = t("message.time")
    return
  }

  loading.value = true
  message.value = null

  try {
    const body = {
      session_token: sessionToken.value,
      crossing_time_minutes: totalMinutes.value,
      reported_at: reportedAt.value,
    }

    const api_key = config.public.apiKey
    const api_url = config.public.apiBase

    const res = await fetch(`${api_url}/api/add-crossing-time.php?api_key=${api_key}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    })

    const result = await res.json()

    if (!res.ok) {
      message.value = t("message.err")
    } else {
      message.value = t("message.ok")

      //  Очищаємо все після успіху
      localStorage.removeItem("border-label-full")
      resetStartTime()
      clearToken()
      setTimeout(() => emit("close"), 1500)
    }
  } catch {
    message.value = " Помилка з'єднання із сервером"
  } finally {
    loading.value = false
  }
}

//  Звук при відкритті
onMounted(() => {
  setReportedAtNowUTC()
  borderLabelFull.value = getSavedBorderName()
  const audio = new Audio("/sounds/notify-1.mp3")
  audio.play().catch(() => {})
})
</script>


<template>
  <Teleport to="body">
    <div class="modal-overlay">
      <div class="modal">
        <button class="close-button" @click="emit('close')">×</button>

        <h3>{{ t("manual.cross") }}</h3>
        <p class="modal-subtitle" v-if="borderLabelFull">
          <strong>{{ borderLabelFull }}</strong>
        </p>

        <form class="queue-form" @submit.prevent="submitForm">
          <label>{{ t("manual.time-input") }}:</label>
          <div class="time-inputs">
            <input
              type="number"
              min="0"
              max="24"
              :placeholder= "t('manual.hours')"
              v-model.number="hours"
            />
            <span>:</span>
            <input
              type="number"
              min="0"
              max="59"
              :placeholder= "t('manual.minutes')"
              v-model.number="minutes"
            />
          </div>

          <button type="submit" :disabled="loading">
            {{ loading ?  t("manual.time-input")  :  t("manual.time-input")  }}
          </button>

          <p v-if="message" class="status">{{ message }}</p>
        </form>
      </div>
    </div>
  </Teleport>
</template>

<style scoped lang="scss">
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(6px);
  display: grid;
  place-items: center;
  z-index: 9997;
}
.modal {
  background: var(--themes-bg-modal);
  padding: 24px 30px;
  border-radius: 12px;
  text-align: center;
  width: 90%;
  max-width: 450px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.25);
  position: relative;
}
h3 {
  margin: 12px 0;
  font-size: 22px;
}
.modal-subtitle {
  font-size: 1.8rem;
  margin-bottom: 1rem;
  color: #4db6ac;
}
.queue-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  label {
    font-weight: 600;
  }
  .time-inputs {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 0.25rem;
    input {
      width: 80px;
      text-align: center;
      font-size: 1.2rem;
      padding: 0.4rem;
      border-radius: 6px;
      border: 1px solid #ccc;
      background-color: rgba(255, 255, 255, 0.15);
    }
    span {
      font-size: 1.5rem;
      color: #333;
    }
  }
  button {
    padding: 0.75rem;
    background-color: #4db6ac;
    color: white;
    font-weight: 700;
    border: none;
    border-radius: 0.5rem;
    cursor: pointer;
    transition: background-color 0.3s ease;
    &:hover {
      background-color: #3c958c;
    }
    &:disabled {
      opacity: 0.7;
      cursor: default;
    }
  }
  .status {
    font-weight: 600;
    color: #4db6ac;
  }
}
.close-button {
  position: absolute;
  top: 10px;
  right: 12px;
  font-size: 22px;
  background: transparent;
  border: none;
  cursor: pointer;
  color: #333;
  &:hover {
    color: #000;
  }
}
</style>
