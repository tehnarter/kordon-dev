<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from "vue"
const { isMenuOpen, isSocialOpen, gestureLock } = usePanels()
const open = ref(false)
const threshold = 50
let startX = 0
let validSwipe = false

function openSidebar() {
  if (isMenuOpen.value) return
  open.value = true
  isSocialOpen.value = true
}
function closeSidebar() {
  open.value = false
  isSocialOpen.value = false
}

// Нове: перевірка, чи початок свайпу всередині кнопок
function isInsideButton(touch: Touch) {
  const el = document.elementFromPoint(touch.clientX, touch.clientY)
  return el?.closest?.(".direction-buttons, .sort-buttons") != null
}

function startDrag(e: TouchEvent) {
  if (isMenuOpen.value) return

  const touch = e.touches[0]

  // Ігноруємо свайп, якщо почався у кнопках
  if (isInsideButton(touch)) {
    validSwipe = false
    return
  }

  startX = touch.clientX
  validSwipe = false

  // свайп активний тільки з правого краю (100px від краю)
  if (startX > window.innerWidth - 100 || open.value) {
    validSwipe = true
  }
}

function onDrag(e: TouchEvent) {
  if (!validSwipe) return
  if (isMenuOpen.value || gestureLock.value === "menu") return

  const diff = startX - e.touches[0].clientX

  // свайп вліво → відкриття
  if (diff > threshold && !open.value) {
    gestureLock.value = "social"
    openSidebar()
  }

  // свайп вправо → закриття
  if (diff < -threshold && open.value) {
    gestureLock.value = "social"
    closeSidebar()
  }
}
function onToggleClick() {
  if (open.value) {
    closeSidebar()
  } else {
    openSidebar()
  }
}
onMounted(() => {
  window.addEventListener("touchstart", startDrag, { passive: true })
  window.addEventListener("touchmove", onDrag, { passive: false })
  window.addEventListener("touchend", () => {
    gestureLock.value = null
  })
})
onBeforeUnmount(() => {
  window.removeEventListener("touchstart", startDrag)
  window.removeEventListener("touchmove", onDrag)
  window.removeEventListener("touchend", () => {
    gestureLock.value = null
  })
})
</script>

<template>
  <div class="sidebar" :class="{ open }" @click="onToggleClick">
    <!-- Іконки -->
    <transition name="slide">
      <div v-show="open" class="icons">
        <a
          href="https://facebook.com/groups/814788924738349"
          target="_blank"
          class="icon fb"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="30"
            height="30"
            fill="currentColor"
            viewBox="0 0 16 16"
          >
            <path
              d="M16 8.049c0-4.446-3.582-8.05-8-8.05C3.58 0-.002 3.603-.002 8.05c0 4.017 2.926 7.347 6.75 7.951v-5.625h-2.03V8.05H6.75V6.275c0-2.017 1.195-3.131 3.022-3.131.876 0 1.791.157 1.791.157v1.98h-1.009c-.993 0-1.303.621-1.303 1.258v1.51h2.218l-.354 2.326H9.25V16c3.824-.604 6.75-3.934 6.75-7.951"
            />
          </svg>
        </a>
        <a
          href="https://instagram.com/kordon.pp.ua"
          target="_blank"
          class="icon ig"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="30"
            height="30"
            fill="currentColor"
            class="bi bi-instagram"
            viewBox="0 0 16 16"
          >
            <path
              d="M8 0C5.829 0 5.556.01 4.703.048 3.85.088 3.269.222 2.76.42a3.9 3.9 0 0 0-1.417.923A3.9 3.9 0 0 0 .42 2.76C.222 3.268.087 3.85.048 4.7.01 5.555 0 5.827 0 8.001c0 2.172.01 2.444.048 3.297.04.852.174 1.433.372 1.942.205.526.478.972.923 1.417.444.445.89.719 1.416.923.51.198 1.09.333 1.942.372C5.555 15.99 5.827 16 8 16s2.444-.01 3.298-.048c.851-.04 1.434-.174 1.943-.372a3.9 3.9 0 0 0 1.416-.923c.445-.445.718-.891.923-1.417.197-.509.332-1.09.372-1.942C15.99 10.445 16 10.173 16 8s-.01-2.445-.048-3.299c-.04-.851-.175-1.433-.372-1.941a3.9 3.9 0 0 0-.923-1.417A3.9 3.9 0 0 0 13.24.42c-.51-.198-1.092-.333-1.943-.372C10.443.01 10.172 0 7.998 0zm-.717 1.442h.718c2.136 0 2.389.007 3.232.046.78.035 1.204.166 1.486.275.373.145.64.319.92.599s.453.546.598.92c.11.281.24.705.275 1.485.039.843.047 1.096.047 3.231s-.008 2.389-.047 3.232c-.035.78-.166 1.203-.275 1.485a2.5 2.5 0 0 1-.599.919c-.28.28-.546.453-.92.598-.28.11-.704.24-1.485.276-.843.038-1.096.047-3.232.047s-2.39-.009-3.233-.047c-.78-.036-1.203-.166-1.485-.276a2.5 2.5 0 0 1-.92-.598 2.5 2.5 0 0 1-.6-.92c-.109-.281-.24-.705-.275-1.485-.038-.843-.046-1.096-.046-3.233s.008-2.388.046-3.231c.036-.78.166-1.204.276-1.486.145-.373.319-.64.599-.92s.546-.453.92-.598c.282-.11.705-.24 1.485-.276.738-.034 1.024-.044 2.515-.045zm4.988 1.328a.96.96 0 1 0 0 1.92.96.96 0 0 0 0-1.92m-4.27 1.122a4.109 4.109 0 1 0 0 8.217 4.109 4.109 0 0 0 0-8.217m0 1.441a2.667 2.667 0 1 1 0 5.334 2.667 2.667 0 0 1 0-5.334"
            />
          </svg>
        </a>
        <a
          href="https://t.me/+IO0hlqWYkPUxYzg6"
          target="_blank"
          class="icon tg"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="30"
            height="30"
            fill="currentColor"
            viewBox="0 0 16 16"
          >
            <path
              d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M8.287 5.906q-1.168.486-4.666 2.01-.567.225-.595.442c-.03.243.275.339.69.47l.175.055c.408.133.958.288 1.243.294q.39.01.868-.32 3.269-2.206 3.374-2.23c.05-.012.12-.026.166.016s.042.12.037.141c-.03.129-1.227 1.241-1.846 1.817-.193.18-.33.307-.358.336a8 8 0 0 1-.188.186c-.38.366-.664.64.015 1.088.327.216.589.393.85.571.284.194.568.387.936.629q.14.092.27.187c.331.236.63.448.997.414.214-.02.435-.22.547-.82.265-1.417.786-4.486.906-5.751a1.4 1.4 0 0 0-.013-.315.34.34 0 0 0-.114-.217.53.53 0 0 0-.31-.093c-.3.005-.763.166-2.984 1.09"
            />
          </svg>
        </a>
        <a
          href="http://tiktok.com/@kordon.pp.ua"
          target="_blank"
          class="icon tt"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="30"
            height="30"
            fill="currentColor"
            viewBox="0 0 16 16"
          >
            <path
              d="M9 0h1.98c.144.715.54 1.617 1.235 2.512C12.895 3.389 13.797 4 15 4v2c-1.753 0-3.07-.814-4-1.829V11a5 5 0 1 1-5-5v2a3 3 0 1 0 3 3z"
            />
          </svg>
        </a>
      </div>
    </transition>
  </div>
</template>

<style lang="scss">
.sidebar {
  position: fixed;
  top: 50%;
  right: 0;
  height: 200px;
  display: flex;
  align-items: center;

  border-radius: 15px 0 0 15px;
  box-shadow: -2px 0 6px rgba(0, 0, 0, 0.1);
  overflow: visible;

  // кнопка
  &::after {
    content: "";
    position: absolute;
    left: -35px;
    top: 50%;
    transform: translateY(-50%);
    width: 30px;
    height: 60px;

    border-radius: 10px 0 0 10px;
    cursor: pointer;
    z-index: 2;
  }

  // стрілочка
  &::before {
    content: "";
    position: absolute;
    left: -35px;
    top: 50%;
    transform: translateY(-50%) rotate(0deg);
    width: 35px;
    height: 35px;
    background: no-repeat center/contain
      url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='35' height='35' fill='%234db6ac' viewBox='0 0 16 16'%3E%3Cpath fill-rule='evenodd' d='M8.354 1.646a.5.5 0 0 1 0 .708L2.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0'/%3E%3Cpath fill-rule='evenodd' d='M12.354 1.646a.5.5 0 0 1 0 .708L6.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0'/%3E%3C/svg%3E");
    transition: transform 0.5s;
    pointer-events: none;
    z-index: 3;
  }

  &.open::before {
    transform: translateY(-50%) rotate(180deg);
  }

  .icons {
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 20px;
    padding: 0 10px;
    overflow: hidden;
  }

  .icon {
    width: 30px;
    height: 30px;

    &.fb {
      color: #1877f2;
    }
    &.ig {
      color: #e1306c;
    }
    &.tg {
      color: #0088cc;
    }
    &.tt {
      color: #000;
    }
  }
}

/* анімація */
.slide-enter-active,
.slide-leave-active {
  transition: transform 0.5s ease;
}
.slide-enter-from,
.slide-leave-to {
  transform: translateX(100%);
}
</style>
