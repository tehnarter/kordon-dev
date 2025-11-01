<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from "vue"
import { useI18n } from "vue-i18n"
import { useRuntimeConfig } from "#app"
import { useSessionToken } from "@/composables/useSessionToken"
import { useBorderTracker } from "@/composables/useBorderTracker"
import { useNearbyBorder } from "@/composables/useNearbyBorder"
import { registerSession } from "@/utils/registerSession"

// 🌐 i18n + config
const { t } = useI18n()
const config = useRuntimeConfig()

// 🪶 Emits
const emit = defineEmits<{ (e: "close"): void }>()

// 🧮 Стан форми
const queue_length = ref<number>(0)
const vehicle_type = ref<string>("car")
const message = ref<string>("")
const messageColor = ref<string>("green")
const dropdownOpen = ref<boolean>(false)

// 🎫 Сесія
const { setToken } = useSessionToken()

// 🚗 Варіанти транспорту
const vehicleOptions = computed(() => [
  { key: "car", label: t("modals.car") },
  { key: "bus", label: t("modals.bus") },
  { key: "tir", label: t("modals.tir") },
  { key: "pedestrian", label: t("modals.pedestrian") },
])

const selectedLabel = computed(
  () => vehicleOptions.value.find((v) => v.key === vehicle_type.value)?.label || t("modals.select")
)

// 🎧 UI події
const toggleDropdown = () => (dropdownOpen.value = !dropdownOpen.value)
const selectOption = (key: string) => {
  vehicle_type.value = key
  dropdownOpen.value = false
}
const handleClickOutside = (e: MouseEvent) => {
  const target = e.target as HTMLElement
  if (!target.closest(".custom-select")) dropdownOpen.value = false
}

// 🔊 Звук при знаходженні пункту
const playFoundSound = () => {
  const sound = new Audio("/sounds/notify.mp3")
  sound.volume = 0.6
  sound.play().catch(() => {
    console.warn("🔇 Не вдалося відтворити звук (можливо, браузер блокує автоплей).")
  })
}

// 🕓 Поточний час UTC
const getCurrentUTCTimeString = (): string => {
  const now = new Date()
  const pad = (n: number) => n.toString().padStart(2, "0")
  return `${now.getUTCFullYear()}-${pad(now.getUTCMonth() + 1)}-${pad(now.getUTCDate())} ${pad(
    now.getUTCHours()
  )}:${pad(now.getUTCMinutes())}:00`
}

// 🧭 Геолокація
const { currentCoords } = useBorderTracker()
const { nearbyBorder, nearbyLabel,nearbyLabelFull } = useNearbyBorder(currentCoords)

const isChecking = ref<boolean>(true)
const foundBorder = ref<string | null>(null)
const foundLabel = ref<string | null>(null)

// 🔁 Реакція на координати
watch(
  currentCoords,
  async (val) => {
    if (!val) return
    isChecking.value = true
    await new Promise((r) => setTimeout(r, 800))
    isChecking.value = false

    if (nearbyBorder.value) {
      foundBorder.value = nearbyBorder.value
      foundLabel.value = nearbyLabel.value
    }
  },
  { immediate: true }
)

// 🔔 Звук при першому знаходженні
watch(foundBorder, (newVal, oldVal) => {
  if (newVal && !oldVal) playFoundSound()
})
// 🕓 Збереження назви пункту на 24 години
watch(nearbyLabelFull, (newVal) => {
  if (newVal) {
    const expiresAt = Date.now() + 24 * 60 * 60 * 1000 // 24 години
    const data = { value: newVal, expiresAt }
    localStorage.setItem("border-label-full", JSON.stringify(data))
  }
})

// 🧹 Події життєвого циклу
onMounted(() => {
  document.addEventListener("click", handleClickOutside)
})
onUnmounted(() => {
  document.removeEventListener("click", handleClickOutside)
})

// ❌ Закрити модалку
const closeQueueSubmit = () => emit("close")

// 📤 Відправка черги
const submitQueue = async () => {
  message.value = ""
  messageColor.value = "green"

  if (queue_length.value < 0) {
    message.value = t("message.invalid") || "Кількість не може бути від’ємною"
    messageColor.value = "red"
    return
  }

  try {
    const token = await registerSession()
    if (!token) {
      message.value = t("message.sessionFail") || "❌ Не вдалося створити сесію"
      messageColor.value = "red"
      return
    }

    setToken(token)

    const body = {
      session_token: token,
      user_name: localStorage.getItem("name") || "Гість",
      border_name: nearbyBorder.value,
      vehicle_type: vehicle_type.value,
      queue_length: queue_length.value,
      report_time: getCurrentUTCTimeString(),
    }

    const res = await fetch(
      `${config.public.apiBase}/api/add-queue.php?api_key=${config.public.apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      }
    )

    const result = await res.json()

    if (!res.ok) {
      message.value = result.error || t("message.error")
      messageColor.value = "red"
      setToken(null)
    } else {
      message.value = t("message.ok")
      messageColor.value = "green"
      queue_length.value = 0
      vehicle_type.value = "car"
      setTimeout(() => emit("close"), 1500)
    }
  } catch (err) {
    console.error(err)
    message.value = t("message.err")
    messageColor.value = "red"
    setToken(null)
  }
}
</script>


<template>
  <teleport to="body">
    <div class="modal-overlay">
      <div class="modal">
        <button class="close-button" @click="closeQueueSubmit">×</button>

        <!-- 🔍 Стан перевірки -->
        <p v-if="isChecking && !foundBorder">🔍 {{ $t('modals.searching') }}</p>

        <!-- ✅ Якщо пункт знайдено -->
        <template v-else-if="foundBorder">
          <h3 class="modal-title">Подайте чергу для</h3>
          <p class="modal-subtitle"><strong>{{ foundLabel }}</strong></p>

          <form @submit.prevent="submitQueue" class="queue-form">
            <div>
              <label>{{ $t("modals.type") }}</label>
              <div class="custom-select" @click="toggleDropdown">
                <div class="custom-select__selected">
                  {{ selectedLabel }}
                  <span class="arrow" :class="{ open: dropdownOpen }">▼</span>
                </div>
                <ul v-if="dropdownOpen" class="custom-select__dropdown">
                  <li
                    v-for="option in vehicleOptions"
                    :key="option.key"
                    @click.stop="selectOption(option.key)"
                  >
                    {{ option.label }}
                  </li>
                </ul>
              </div>
            </div>

            <div>
              <label for="queue_length">{{ $t("modals.queue") }}</label>
              <input id="queue_length" type="number" v-model.number="queue_length" min="0" required />
            </div>

            <button type="submit">{{ $t("modals.confirm") }}</button>

            <p v-if="message" :style="{ color: messageColor }">{{ message }}</p>
          </form>
        </template>

        <!-- ⚠️ Якщо пункт не знайдено -->
        <template v-else>
          <p>⚠️ Ви не біля жодного пункту</p>
        </template>
      </div>
    </div>
  </teleport>
</template>

<style scoped lang="scss">
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(255, 255, 255, 0.15);
  z-index: 9998;
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal {
  background: var(--themes-bg-modal);
  border-radius: 1rem;
  padding: 2rem;
  max-width: 500px;
  width: 100%;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  position: relative;
}

.close-button {
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: transparent;
  border: none;
  cursor: pointer;
  font-size: 1.5rem;
}

.modal-title {
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 0.25rem;
  text-align: center;
}

.modal-subtitle {
  font-size: 1.8rem;
  margin-bottom: 1.5rem;
  text-align: center;
  color: #4db6ac;
}

.queue-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.queue-form label {
  font-weight: 600;
}

.queue-form input {
  background-color: rgba(255, 255, 255, 0.15);
  padding: 0.5rem;
  font-size: 1rem;
  border-radius: 6px;
  border: 1px solid #ccc;
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

/* ==== custom select ==== */
.custom-select {
  position: relative;
  user-select: none;

  &__selected {
    padding: 0.5rem;
    border: 1px solid #ccc;
    border-radius: 6px;
    background-color: rgba(255, 255, 255, 0.15);
    cursor: pointer;
    position: relative;
  }

  .arrow {
    position: absolute;
    right: 10px;
    top: 50%;
    transform: translateY(-50%);
    transition: 0.3s;
  }

  .arrow.open {
    transform: translateY(-50%) rotate(180deg);
  }

  &__dropdown {
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    margin-top: 4px;
    background: var(--themes-bg-modal);
    border: 1px solid #ccc;
    border-radius: 6px;
    z-index: 100;
    max-height: 150px;
    overflow-y: auto;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);

    li {
      padding: 0.5rem;
      cursor: pointer;
    }

    li:hover {
      background: #f0f0f0;
    }
  }
}
</style>
