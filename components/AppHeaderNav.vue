<script setup lang="ts">
import { ref, onMounted, nextTick, computed } from "vue"
import gsap from "gsap"
import { useMenu } from "@/composables/useMenu"
import { useBorder } from "@/composables/useBorder"
import { useI18n } from "vue-i18n"
const { t } = useI18n()
const { menu } = useMenu()
const selected = useBorder()
const { sessionToken, initToken } = useSessionToken()
const emit = defineEmits(["close", "openModal"])

const activeSubmenu = ref<string | null>(null)
const activeChildSubmenu = ref<string | null>(null)
const activeBorder = ref<string | null>(null)
// Дані користувача
const userName = ref(t("nav.guest"))
const userPhoto = ref("/logo-img.svg")
const { isMuted, toggleSound } = useSound()
onMounted(() => {
  if (window.Telegram?.WebApp) {
    const tg = window.Telegram.WebApp
    const user = tg.initDataUnsafe?.user

    if (user?.first_name) userName.value = user.first_name
    else if (user?.username) userName.value = user.username

    if (user?.photo_url) userPhoto.value = user.photo_url
  }

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
  initToken()
})

// Головне меню
const fullMenu = computed(() => [
  { key: "directions", name: t("nav.directions"), children: menu.value },
  {
    key: "borderAction",

    name: sessionToken.value ? t("manual.time") : t("manual.queue"),
    modal: sessionToken.value ? "timeSubmit" : "queueSubmit",
  },
  { key: "news", name: t("nav.news"), modal: "newsBlock" },
  { key: "info", name: t("nav.info"), modal: "infoBlock" },
  {
    key: "settings",
    name: t("nav.settings"),
    children: [
      { key: "reset", name: t("nav.reset"), action: "reset" },
      {
        key: "mute",
        name: isMuted.value ? t("nav.mute-on") : t("nav.mute-off"),
        action: "mute",
      },
    ],
  },
  {
    key: "contacts",
    name: t("nav.contacts"),
    children: [
      {
        key: "telegram",
        name: "Telegram",
        link: "https://t.me/kordon_u_a",
        icon: "/telegram.svg",
      },
      {
        key: "facebook",
        name: "Facebook",
        link: "https://facebook.com/kordon.online",
        icon: "/facebook.svg",
      },
      {
        key: "email",
        name: "Email",
        link: "mailto:tehnarpol@gmail.com",
        icon: "/mail.svg",
      },
    ],
  },
])

function setActiveBorder(border: { key: string; label: string }) {
  activeBorder.value = border.key
  selected.value = border
  closeWithAnimation()
}

function openModal(modalKey: string) {
  activeSubmenu.value = null
  activeChildSubmenu.value = null
  closeWithAnimation()
  emit("openModal", modalKey)
}

function closeWithAnimation() {
  if (import.meta.client) {
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

function toggleSubmenu(key: string) {
  activeSubmenu.value = activeSubmenu.value === key ? null : key
  if (activeSubmenu.value !== key) activeChildSubmenu.value = null
}

function toggleChildSubmenu(key: string) {
  activeChildSubmenu.value = activeChildSubmenu.value === key ? null : key
}

// Скидання додатку
function resetApp() {
  const colorMode = localStorage.getItem("nuxt-color-mode")
  ;[
    "direction",
    "lastNearbyBorderKey",
    "lastNearbyBorderKeyTimestamp",
    "queue_token",
    "border-key",
  ].forEach((k) => localStorage.removeItem(k))
  sessionStorage.clear()
  if (indexedDB.databases) {
    indexedDB
      .databases()
      .then((r) => r.forEach((db) => indexedDB.deleteDatabase(db.name!)))
  }
  if (colorMode) localStorage.setItem("nuxt-color-mode", colorMode)
  location.reload()
}
function handleChildClick(child: any) {
  if (child.borders) toggleChildSubmenu(child.key)
  else if (child.action === "reset") resetApp()
  else if (child.action === "mute") {
    const wasMuted = isMuted.value
    toggleSound()
    if (wasMuted && !isMuted.value) {
      const audio = new Audio("/sounds/notify-3.mp3")
      audio.play().catch(() => {})
    }
  } else {
    setActiveBorder(child)
  }
}
</script>

<template>
  <div>
    <div class="nav__overlay" @click="closeWithAnimation"></div>
    <nav class="nav">
      <!-- Користувач -->
      <div class="nav__item-user">
        <div class="nav__item-login-img">
          <img :src="userPhoto" alt="user avatar" class="nav__avatar" />
        </div>
        <div class="nav__item-name">{{ `${t("nav.hello")}, ${userName}` }}</div>
      </div>

      <!-- Меню -->
      <ul class="nav__item">
        <li v-for="item in fullMenu" :key="item.key" class="nav__link">
          <div
            class="nav__link-item"
            :class="{ active: activeSubmenu === item.key }"
            @click="
              item.children ? toggleSubmenu(item.key) : openModal(item.modal)
            "
          >
            {{ item.name }}
          </div>

          <!-- Підменю 2 рівня -->
          <ul v-if="activeSubmenu === item.key" class="nav__listsub">
            <li
              v-for="child in item.children"
              :key="child.key"
              class="nav__link"
            >
              <!-- Контакти -->
              <a
                v-if="item.key === 'contacts'"
                class="nav__contact-link"
                :href="child.link"
                target="_blank"
                rel="noopener"
              >
                <img :src="child.icon" class="nav__icon" alt="icon" />
                {{ child.name }}
              </a>

              <!-- Напрямки / налаштування -->
              <div
                v-else
                class="nav__item-link"
                @click="handleChildClick(child)"
              >
                {{ child.name }}
              </div>

              <!-- Підменю 3 рівня (кордони) -->
              <ul
                v-if="child.borders && activeChildSubmenu === child.key"
                class="nav__listsub-child"
              >
                <li
                  v-for="border in child.borders"
                  :key="border.key"
                  class="nav__sublink"
                  @click="setActiveBorder(border)"
                >
                  {{ border.full }}
                </li>
              </ul>
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
  column-gap: 16px;
  padding: 5px 0;
  border-bottom: 1px solid #e0e0e0;
  margin-bottom: 16px;
}

.nav__item-login-img {
  width: 42px;
  height: 42px;
  border-radius: 50%;
  overflow: hidden;
}

.nav__avatar {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.nav__item-name {
  font-size: 18px;
  color: #1976d2;
  font-weight: 600;
}

.nav__item {
  display: flex;
  flex-direction: column;
}

.nav__link-item {
  padding: 10px 12px;
  font-size: 18px;
  font-weight: 500;
  border-radius: 8px;
  cursor: pointer;
  &.active {
    background-color: #a1cff8;
    color: #000;
    transition: 0.3s;
  }
}

.nav__item-link {
  padding: 10px 12px;
  font-size: 16px;
  border-radius: 8px;
  margin-top: 4px;
  background-color: var(--themes-bg-itemlink);
  cursor: pointer;
}

.nav__listsub {
  margin-top: 8px;
  padding: 5px;
  border-radius: 8px;
  background: linear-gradient(135deg, #e6f0ff 0%, #cce0ff 100%);
  box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.05);
  overflow: hidden;
}

.nav__listsub-child {
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
.nav__contact-link {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 12px;
  font-size: 16px;
  text-decoration: none;
  color: inherit;
  background-color: var(--themes-bg-itemlink);
}
.nav__icon {
  width: 20px;
  height: 20px;
}
</style>
