<script setup lang="ts">
import { ref, computed } from "vue"
import { useMenu } from "~/composables/useMenu"

import { useCookie } from "#app"

const emit = defineEmits<{
  (e: "confirm", direction: string): void
  (e: "reloadBorders"): void
}>()

const { menu } = useMenu()

const selected = ref<string | null>(null)
const dropdownOpen = ref(false)

const directionCookie = useCookie("user_direction", { maxAge: 60 * 60 * 24 })

const directionOptions = computed(() =>
  menu.value.map((item) => ({
    key: item.key,
    name: item.name,
  }))
)

const selectedLabel = computed(() => {
  const found = directionOptions.value.find((d) => d.key === selected.value)
  return found ? found.name : "— Оберіть —"
})

const toggleDropdown = () => {
  dropdownOpen.value = !dropdownOpen.value
}

const selectOption = (key: string) => {
  selected.value = key
  dropdownOpen.value = false
}

const confirm = () => {
  if (!selected.value) return
  directionCookie.value = selected.value
  emit("confirm", selected.value)
  emit("reloadBorders")
}
</script>

<template>
  <template>
    <Teleport to="body">
      <div class="modal-overlay">
        <div class="modal">
          <h3>Оберіть напрям руху</h3>

          <div class="custom-select" @click="toggleDropdown">
            <div class="custom-select__selected">
              {{ selectedLabel }}
              <span class="arrow" :class="{ open: dropdownOpen }">▼</span>
            </div>
            <ul v-if="dropdownOpen" class="custom-select__dropdown">
              <li
                v-for="item in directionOptions"
                :key="item.key"
                @click.stop="selectOption(item.key)"
              >
                {{ item.name }}
              </li>
            </ul>
          </div>

          <button :disabled="!selected" @click="confirm">✅ Підтвердити</button>
        </div>
      </div>
    </Teleport>
  </template>
</template>

<style scoped lang="scss">
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(255, 255, 255, 0.1);
  -webkit-backdrop-filter: blur(8px);
  backdrop-filter: blur(8px);
  display: grid;
  place-items: center;
  z-index: 9999;
}

.modal {
  background: var(--themes-bg-modal);
  padding: 24px 30px;
  border-radius: 12px;
  text-align: center;
  width: 90%;
  max-width: 400px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);

  h3 {
    margin-bottom: 16px;
  }

  .custom-select {
    position: relative;
    width: 100%;
    margin-bottom: 20px;
    cursor: pointer;
    user-select: none;

    &__selected {
      padding: 10px;
      border: 1px solid #ccc;
      border-radius: 6px;
      background-color: rgba(255, 255, 255, 0.15);
      font-size: 16px;
      text-align: left;
      position: relative;

      .arrow {
        position: absolute;
        right: 10px;
        top: 50%;
        transform: translateY(-50%);
        transition: 0.3s;

        &.open {
          transform: translateY(-50%) rotate(180deg);
        }
      }
    }

    &__dropdown {
      position: absolute;
      top: calc(100% + 5px);
      left: 0;
      width: 100%;
      border: 1px solid #ccc;
      border-radius: 6px;
      background-color: var(--themes-bg-modal);
      z-index: 10;
      box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
      max-height: 300px;
      overflow-y: auto;
      scrollbar-width: thin;
      scrollbar-color: #ccc transparent;

      &::-webkit-scrollbar {
        width: 6px;
      }

      &::-webkit-scrollbar-thumb {
        background: #ccc;
        border-radius: 4px;
      }

      &::-webkit-scrollbar-track {
        background: transparent;
      }

      li {
        padding: 10px;
        font-size: 16px;
        cursor: pointer;

        &:hover {
          background: #f0f0f0;
        }
      }
    }
  }

  button {
    padding: 10px 20px;
    background: #0084ff;
    border: none;
    border-radius: 6px;

    cursor: pointer;

    &:disabled {
      background: #aaa;
      cursor: not-allowed;
    }
  }
}
</style>
