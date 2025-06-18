<script setup>
import { ref } from "vue"
const isClickedBurger = ref(false)
const activeBurger = () => {
  isClickedBurger.value = !isClickedBurger.value
}
const closeBurger = () => {
  isClickedBurger.value = false
}
const menu = [
  { name: "Польща" },
  { name: "Словаччина" },
  { name: "Угорщина" },
  { name: "Румунія " },
  { name: "Молдова" },
  { name: "Контакти" },
]
</script>

<template>
  <header class="header">
    <div class="header__nav-1">
      <div class="header__logo">
        <img src="/ukraine.svg" alt="" class="header__logo-img" />
      </div>

      <ThemeSwitcher />
      <LanguageSwitcher />
    </div>
    <div class="header__nav-2">
      <div class="header__burger">
        <Burger :class="{ active: isClickedBurger }" @click="activeBurger" />
        <nav class="nav" :class="{ active: isClickedBurger }">
          <div class="nav__item-user">
            <div class="nav__item-login-img">
              <img src="/logo-img.svg" alt="" />
            </div>
            <div class="nav__item-name">Привіт, <span>Гість</span></div>
            <img src="/user_login-exit.svg" alt="" class="nav__item-exit" />
          </div>
          <ul class="nav__item">
            <li v-for="nav in menu" :key="nav.name" class="nav__link">
              <div class="nav__link-item" @click="closeBurger">
                {{ nav.name }}
              </div>
            </li>
          </ul>
        </nav>
        <!-- <div v-for="(nav, index) in menu" :key="nav.name" class="long">
					<div
						class="long__link"
						@click="toggleClass"
						v-if="index === menu.length - 1"
					>
						{{ nav.name }}
						<ul
							:class="{ column: isClicked }"
							@click="toggleClass"
							v-if="nav.dropdown"
							class="long__item"
						>
							<li v-for="dd in nav.dropdown" :key="dd.name">
								<NuxtLink :to="dd.path">
									{{ dd.name }}
								</NuxtLink>
							</li>
						</ul>
					</div>
				</div> -->
      </div>
      <Geo />
    </div>
  </header>
</template>

<style lang="scss" scoped>
.header {
  // .header__nav-1

  &__nav-1 {
    padding: 12px 16px;
    width: 100%;
    height: 48px;
    background-color: var(--themes-bg-header);
    display: flex;
    column-gap: 20px;
    align-items: center;
    transition: background-color 3s ease;
  }

  // .header__logo

  &__logo {
    display: flex;
    align-items: center;
    column-gap: 20px;
    flex-basis: 100%;
  }

  // .header__long

  &__long-ua {
    font-family: Rubik-Medium;
    font-size: 14px;
    line-height: 1.16667;
    color: var(--tekst-i-elementy-na-temnom-fone);
  }
  // .header__user

  &__user {
  }
  &__logo-img {
    width: 50px;
  }

  // .header__nav-2

  &__nav-2 {
    padding: 12px 16px;
    width: 100%;
    height: 48px;
    background-color: var(--themes-bg-footer);
    transition: background-color 3s ease;
    display: flex;
    justify-content: flex-start;
    column-gap: 15px;
    align-items: center;
  }

  // .header__burger

  &__burger {
  }

  // .header__time

  &__time {
  }

  // .header__money

  &__money {
  }
}
.burger {
}
.nav {
  display: none;
  &.active {
    padding: 0px 16px 24px 16px;
    width: 100%;
    background: #272e3b;
    display: flex;
    flex-direction: column;
    position: absolute;
    top: 96px;
    left: 0;
    border-radius: 0 0 16px 16px;

    visibility: visible;
    opacity: 1;
  }

  // .nav__item-user

  &__item-user {
    padding: 16px 0;
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-bottom: 1px solid var(--razdeliteli);
  }

  // .nav__item-login-img

  &__item-login-img {
  }

  // .nav__item-name

  &__item-name {
    font-family: var(--font-family);

    font-size: 14px;
    line-height: 1.14286;
    color: var(--vtorostepennyy-tekst);
    span {
      font-family: var(--font-family);

      color: var(--akcentnyy);
    }
  }

  // .nav__item-exit

  &__item-exit {
  }
}

.nav__item {
  display: flex;
  flex-direction: column;
}
.nav__link-item {
  padding: 16px 0;
  font-family: Rubik-Regular;
  font-size: 14px;
  line-height: 1.14286;
  color: var(--tekst-i-elementy-na-temnom-fone);
  border-bottom: 1px solid var(--razdeliteli);
  white-space: nowrap;
  transition: all 0.5s ease-in;

  cursor: pointer;

  &:hover {
    color: rgba(206, 206, 248, 0.7);
  }
}
</style>
