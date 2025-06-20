<script setup lang="ts">
import { ref, nextTick, onMounted } from "vue"
import gsap from "gsap"

const isClickedBurger = ref(false)
const activeSubmenu = ref<string | null>(null)
const activeBorder = ref<string | null>(null)

const openMenu = () => {
  isClickedBurger.value = true
  if (process.client) {
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
  }
}

const closeMenu = () => {
  if (process.client) {
    gsap.to(".nav", {
      x: "-100%",
      duration: 0.4,
      ease: "power2.in",
      onComplete: () => (isClickedBurger.value = false),
    })
    gsap.to(".nav__overlay", {
      opacity: 0,
      pointerEvents: "none",
      duration: 0.3,
    })
  } else {
    isClickedBurger.value = false
  }
}

const toggleSubmenu = async (name: string) => {
  if (activeSubmenu.value === name) {
    const submenu = document.querySelector(`[data-submenu="${name}"]`)
    if (submenu && process.client) {
      gsap.to(submenu, { height: 0, opacity: 0, duration: 0.3 })
    }
    setTimeout(() => (activeSubmenu.value = null), 300)
  } else {
    activeSubmenu.value = name
    await nextTick()
    const submenu = document.querySelector(`[data-submenu="${name}"]`)
    if (submenu && process.client) {
      const h = (submenu as HTMLElement).scrollHeight
      gsap.fromTo(
        submenu,
        { height: 0, opacity: 0 },
        { height: h, opacity: 1, duration: 0.4 }
      )
    }
  }
}

const setActiveBorder = (name: string) => {
  activeBorder.value = name
  closeMenu()
}

// Свайпи для відкриття і закриття меню
onMounted(() => {
  if (!process.client) return

  let startX = 0
  let endX = 0

  // Початок свайпу
  document.addEventListener("touchstart", (e) => {
    startX = e.touches[0].clientX
  })

  // Кінець свайпу
  document.addEventListener("touchend", (e) => {
    endX = e.changedTouches[0].clientX
    const diff = endX - startX

    if (diff > 100 && !isClickedBurger.value) {
      // свайп справа наліво - відкриваємо меню
      openMenu()
    } else if (diff < -100 && isClickedBurger.value) {
      // свайп зліва направо - закриваємо меню
      closeMenu()
    }
  })
})

// Меню з підменю
const menu = [
  {
    name: "Україна-Польща",
    borders: [
      "Краківець-Корчова",
      "Рава-Руська-Гребенне",
      "Шегині-Медика",
      "Устилуг-Зосін",
      "Ягодин-Дорогуськ",
      "Грушів-Будомєж",
      "Смільниця-Кросценко",
    ],
  },
  {
    name: "Польща-Україна",
    borders: [
      "Корчова-Краківець",
      "Гребенне-Рава-Руська",
      "Медика-Шегині",
      "Зосін-Устилуг",
      "Дорогуськ-Ягодин",
      "Будомєж-Грушів",
      "Кросценко-Смільниця",
    ],
  },
  {
    name: "Україна-Словаччина",
    borders: ["Ужгород-Вишнє Нємецьке", "Малі Селменці-Вельке Селменце"],
  },
  {
    name: "Словаччина-Україна",
    borders: ["Вишнє Нємецьке-Ужгород", "Вельке Селменце-Малі Селменці"],
  },
  {
    name: "Україна-Угорщина",
    borders: ["Чоп-Захонь", "Лужанка-Берегдароц", "Дзвінкове-Астей"],
  },
  {
    name: "Угорщина-Україна",
    borders: ["Захонь-Чоп", "Берегдароц-Лужанка", "Астей-Дзвінкове"],
  },
  {
    name: "Україна-Румунія",
    borders: ["Порубне-Сірет", "Дякове-Халмеу", "Солотвино-Сігет"],
  },
  {
    name: "Румунія-Україна",
    borders: ["Сірет-Порубне", "Халмеу-Дякове", "Сігет-Солотвино"],
  },
  {
    name: "Україна-Молдова",
    borders: ["Могилів-Подільський-Отач", "Мамалига-Крива", "Росошани-Бричени"],
  },
  {
    name: "Молдова-Україна",
    borders: ["Отач-Могилів-Подільський", "Крива-Мамалига", "Бричени-Росошани"],
  },
  {
    name: "Контакти",
  },
]
</script>

<template>
  <header class="header">
    <div class="header__nav-1 nav-1">
      <div class="nav-1__container nav-1-content">
        <div class="header__logo">
          <img src="/ukraine.svg" alt="" class="header__logo-img" />
        </div>

        <ThemeSwitcher />
        <LanguageSwitcher />
      </div>
    </div>
    <div class="header__nav-2 nav-2">
      <div class="nav-2__container nav-2-content">
        <div class="header__burger">
          <Burger :class="{ active: isClickedBurger }" @click="openMenu" />
          <div
            v-show="isClickedBurger"
            class="nav__overlay"
            @click="closeMenu"
          ></div>

          <!-- Навігація -->
          <nav class="nav" v-show="isClickedBurger">
            <div class="nav__item-user">
              <div class="nav__item-login-img">
                <img src="/logo-img.svg" alt="" />
              </div>
              <div class="nav__item-name">Привіт, <span>Гість</span></div>
              <img src="/user_login.svg" alt="" class="nav__item-exit" />
            </div>
            <ul class="nav__item">
              <li v-for="nav in menu" :key="nav.name" class="nav__link">
                <div
                  class="nav__link-item"
                  :class="{ active: activeSubmenu === nav.name }"
                  @click="nav.borders ? toggleSubmenu(nav.name) : closeMenu()"
                >
                  {{ nav.name }}
                </div>

                <ul
                  v-if="nav.borders"
                  :data-submenu="nav.name"
                  class="nav__sublist"
                  :style="{
                    overflow: 'hidden',
                    height: activeSubmenu === nav.name ? 'auto' : '0',
                    opacity: activeSubmenu === nav.name ? 1 : 0,
                  }"
                >
                  <li
                    v-for="border in nav.borders"
                    :key="border"
                    class="nav__sublink"
                    :class="{ active: activeBorder === border }"
                    @click="setActiveBorder(border)"
                  >
                    {{ border }}
                  </li>
                </ul>
              </li>
            </ul>
          </nav>
        </div>
        <Geo />
      </div>
    </div>
  </header>
</template>

<style lang="scss" scoped>
.header {
  &__nav-1 {
    padding: 12px 0px;
    width: 100%;
    height: 48px;
    background-color: var(--themes-bg-header);
    transition: background-color 3s ease;
  }

  &__logo {
    display: flex;
    align-items: center;
    column-gap: 20px;
    flex-basis: 100%;
  }

  &__long-ua {
    font-family: Rubik-Medium;
    font-size: 14px;
    line-height: 1.16667;
    color: var(--tekst-i-elementy-na-temnom-fone);
  }

  &__user {
  }

  &__logo-img {
    width: 50px;
  }

  &__nav-2 {
    padding: 12px 0px;
    width: 100%;
    height: 48px;
    background-color: var(--themes-bg-footer);
    transition: background-color 3s ease;
  }
}

.nav-1-content {
  height: 100%;
  display: flex;
  column-gap: 20px;
  align-items: center;
}

.nav-2-content {
  height: 100%;
  display: flex;
  justify-content: flex-start;
  column-gap: 15px;
  align-items: center;
}
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

  &.active {
    transform: translateX(0);
  }
  &__overlay {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.8);
    pointer-events: none;
    opacity: 0;
    z-index: 998;
    transition: opacity 0.3s ease;
  }
  &__item-user {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 5px 5px;
    border-bottom: 1px solid #e0e0e0;
    margin-bottom: 16px;
  }

  &__item-name {
    font-size: 18px;

    span {
      color: #1976d2;
      font-weight: 600;
    }
  }

  &__item-exit {
    cursor: pointer;
    opacity: 0.6;
    transition: opacity 0.3s;

    &:hover {
      opacity: 1;
    }
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

  // &:hover {
  //   background: #bbdefb;
  //   color: #000;
  //   transition:
  //     background 1s,
  //     color 1s;
  // }

  &.active {
    background-color: #bbdefb;
    color: #000;
    transition:
      background-color 1s,
      color 1s;
  }
}

.nav__item {
  display: flex;
  flex-direction: column;
}

.nav__sublist {
  margin-top: 8px;
  padding: 5px;
  border-radius: 8px;
  background: linear-gradient(135deg, #ddeeff 0%, #ccddee 100%);
  box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.05);
  overflow: hidden;

  .nav__sublink {
    padding: 10px;
    font-size: 16px;
    background-color: var(--themes-bg-subnav);
    border-radius: 6px;
    margin-bottom: 6px;

    transition: background-color 0.3s;

    // &:hover {
    //   background: #bbdefb;
    //   color: #000;
    // }
    &.active {
      background: #1976d2;
      color: #fff;
    }
  }
}
.nav__overlay {
  position: fixed;
  inset: 0;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  pointer-events: none;
  opacity: 0;
  z-index: 998;
  transition: opacity 0.3s ease;
}
</style>
