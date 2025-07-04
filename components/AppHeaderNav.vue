<script setup lang="ts">
import { ref, onMounted, nextTick } from "vue"
import gsap from "gsap"

const { menu } = useMenu()

const emit = defineEmits(["close"])

const activeSubmenu = ref<string | null>(null)
const activeBorder = ref<string | null>(null)
const selected = useBorder()

const setActiveBorder = (border: { key: string; label: string }) => {
  activeBorder.value = border.key
  selected.value = border // тепер selected містить і key, і label
  closeWithAnimation()
}

function closeWithAnimation() {
  if (process.client) {
    gsap.to(".nav", {
      x: "-100%",
      duration: 0.4,
      ease: "power2.in",
      onComplete: () => emit("close"),
    })
    gsap.to(".nav__overlay", {
      opacity: 0,
      pointerEvents: "none",
      duration: 0.3,
    })
  } else {
    emit("close")
  }
}

defineExpose({ closeWithAnimation })

async function toggleSubmenu(key: string) {
  if (activeSubmenu.value === key) {
    const submenu = document.querySelector(`[data-submenu="${key}"]`)
    if (submenu && process.client)
      gsap.to(submenu, { height: 0, opacity: 0, duration: 0.3 })
    setTimeout(() => (activeSubmenu.value = null), 300)
  } else {
    activeSubmenu.value = key
    await nextTick()
    const submenu = document.querySelector(
      `[data-submenu="${key}"]`
    )! as HTMLElement
    const h = submenu.scrollHeight
    gsap.fromTo(
      submenu,
      { height: 0, opacity: 0 },
      { height: h, opacity: 1, duration: 0.4 }
    )
  }
}

onMounted(() => {
  nextTick(() => {
    gsap.fromTo(
      ".nav",
      { x: "-100%" },
      { x: "0%", duration: 0.4, ease: "power2.out" }
    )
    gsap.to(".nav__overlay", {
      opacity: 1,
      pointerEvents: "auto",
      duration: 0.3,
    })
  })
})
</script>

<template>
  <div>
    <div class="nav__overlay" @click="closeWithAnimation"></div>
    <nav class="nav">
      <div class="nav__item-user">
        <div class="nav__item-login-img">
          <img src="/logo-img.svg" alt="" />
        </div>
        <div class="nav__item-name">Гість</div>
        <img src="/user_login.svg" alt="" class="nav__item-exit" />
      </div>
      <ul class="nav__item">
        <li v-for="item in menu" :key="item.key" class="nav__link">
          <div
            class="nav__link-item"
            :class="{ active: activeSubmenu === item.key }"
            @click="
              item.borders && item.borders.length
                ? toggleSubmenu(item.key)
                : closeWithAnimation()
            "
          >
            {{ item.name }}
          </div>
          <ul
            v-if="item.borders && item.borders.length"
            :data-submenu="item.key"
            class="nav__sublist"
            :style="{
              overflow: 'hidden',
              height: activeSubmenu === item.key ? 'auto' : '0',
              opacity: activeSubmenu === item.key ? 1 : 0,
            }"
          >
            <li
              v-for="border in item.borders"
              :key="border.key"
              class="nav__sublink"
              :class="{ active: activeBorder === border.key }"
              @click="setActiveBorder(border)"
            >
              {{ border.full }}
            </li>
          </ul>
        </li>
      </ul>
    </nav>
  </div>
</template>

<style scoped lang="scss">
.nav {
  position: fixed;
  top: 96px;
  left: 0;
  height: calc(100vh - 96px);
  width: 280px;
  background: var(--themes-bg-nav);
  border-radius: 0 12px 12px 0;
  box-shadow: 4px 0 20px rgba(0, 0, 0, 0.1);
  z-index: 999;
  padding: 24px 16px;
  overflow-y: auto;
  transition: transform 0.4s ease;
  transform: translateX(-100%);
}

.nav__overlay {
  position: fixed;
  inset: 0;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(8px);
  pointer-events: none;
  opacity: 0;
  z-index: 998;
  transition: opacity 0.3s ease;
}

.nav__item-user {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 5px 5px;
  border-bottom: 1px solid #e0e0e0;
  margin-bottom: 16px;
}

.nav__item-name {
  font-size: 18px;
  color: #1976d2;
  font-weight: 600;
}

.nav__item-exit {
  cursor: pointer;
  opacity: 0.6;
  transition: opacity 0.3s;
  &:hover {
    opacity: 1;
  }
}

.nav__item {
  display: flex;
  flex-direction: column;
}

.nav__link-item {
  padding: 10px 12px;
  font-size: 16px;
  font-weight: 500;
  border-radius: 8px;
  cursor: pointer;
  &.active {
    background-color: #bbdefb;
    color: #000;
    transition:
      background-color 0.3s,
      color 0.3s;
  }
}

.nav__sublist {
  margin-top: 8px;
  padding: 5px;
  border-radius: 8px;
  background: linear-gradient(135deg, #ddeeff 0%, #ccddee 100%);
  box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.05);
  overflow: hidden;
}

.nav__sublink {
  padding: 10px;
  font-size: 16px;
  background-color: var(--themes-bg-subnav);
  border-radius: 6px;
  margin-bottom: 6px;
  transition: background-color 0.3s;
  &.active {
    background: #1976d2;
    color: #fff;
  }
}
</style>
