<script setup lang="ts">
import { ref, onMounted } from "vue"
import { useSessionToken } from "@/composables/useSessionToken"
import { useI18n } from "vue-i18n"
const { t } = useI18n()

const { time, borderLabel } = defineProps<{
  time?: number | null
  borderLabel: string
}>()

const emit = defineEmits<{
  (e: "close"): void
}>()

const { sessionToken, initToken } = useSessionToken()

const reportedAt = ref("")

// 🔹 Форматування часу
const formattedTime = computed(() => {
  if (!time || time <= 0) return " "


  const hours = Math.floor(time / 60)
  const minutes = time % 60

  if (hours > 0) {
    return minutes > 0 ? `${hours} ${t("tracker.hours")} ${minutes} ${t("tracker.minutes")}` : `${hours} ${t("tracker.hours")}`
  }
  return `${minutes} ${t("tracker.minutes")}`
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

const submitForm = async () => {
  if (!sessionToken.value) {
    console.error("❌ Немає активного токена. Надсилання заборонено.")
    return
  }

  if (typeof time !== "number" || time < 0) {
    console.error("❌ Час проходження некоректний або відсутній.")
    return
  }
  console.log(" Час фіксації (UTC):", reportedAt.value)
  try {
    const body = {
      session_token: sessionToken.value,
      crossing_time_minutes: time,
      reported_at: reportedAt.value,
    }
    const api_key = useRuntimeConfig().public.apiKey
    const api_url = useRuntimeConfig().public.apiBase
    const res = await fetch(
      `${api_url}/api/add-crossing-time.php?api_key=${api_key}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      }
    )

    const result = await res.json()

    if (!res.ok) {
      console.error(
        "❌ Сервер повернув помилку:",
        result.error || "Помилка відправки"
      )
    } else {
      console.log("✅ Час проходження успішно додано!")
    }
  } catch (e: any) {
    console.error("❌ Запит не вдався:", e.message || e)
  }
}

onMounted(() => {



    //  звук відкриття модального вікна
  const audio = new Audio("/sounds/notify-1.mp3")
  audio.play().catch(() => {
    console.warn("Автовідтворення заблоковане, зіграє після першого кліку по сайту")
  })
})

onMounted(() => {
  initToken()
  setReportedAtNowUTC()
  submitForm()
})
</script>

<template>
  <Teleport to="body">
    <div class="modal-overlay">
      <div class="modal-form">
        <button class="close-button" @click="emit('close')">×</button>

        <h3> {{ $t("modals.cross") }}</h3>

        <p class="modal-subtitle">
          <strong>{{ borderLabel }}</strong>
        </p>
        <p>
          {{ $t("modals.time") }}<strong>{{ formattedTime }}</strong>
        </p>

        <p>{{ $t("modals.road") }}</p>
      </div>
    </div>
  </Teleport>
</template>

<style scoped>
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(6px);
  display: grid;
  place-items: center;
  z-index: 9997;
}

.modal-form {
  background: var(--themes-bg-modal);
  padding: 24px 30px;
  border-radius: 12px;
  text-align: center;
  width: 90%;
  max-width: 450px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.25);
  position: relative;

  h3 {
    margin: 12px 0;
    font-size: 22px;
  }
  .modal-subtitle {
    font-size: 1.8rem;
    margin-bottom: 1rem;
    text-align: center;
    color: #4db6ac;
  }
  p {
    font-size: 20px;
    margin-bottom: 8px;
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
}

.close-button:hover {
  color: #000;
}
</style>
