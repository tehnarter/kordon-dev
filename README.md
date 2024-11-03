## Структура папок

<br/>

`assets`

Папка містить папку шрифтів `fonts` та стилів `styles`

---

`assets/styles`

Файли (не папка `utils`) містять загальні стилі для всього проекту

---

`assets/styles/utils`

Папка містить лише "функціональні" `.scss`файли. В них не містяться стилі, а лише функції, міксини, scss-змііні. **Ні в якому разі не задавайте будь-яких стилів в цих файлах!**

---

`components`

Папка компонентів проекту. Структуру комопнентів можна робитит різною на даний момент. Це значить, що можна класти всі компоненти прямо в цю папку, а можна їх розділяти по папках в залежності від потреб. наприклад, створювати папки для кожної із сторінок чи створити папку для загальних компонентів, які зустрічаються на різних сторінках в різних блоках

```
| components/
  | main/
     | Hero.vue
     | Contact.vue
     | blocks/
       | Type1.vue
  | about/
     | Hero.vue
     | Slider.vue
```

Якщо створюється така структура, то `nuxt 3` формує назви компонентів починаючи від назви корененовї папки, в якій знаходиться компонент. В показаній вище структурі комопненти матимуть назви `MainHero.vue`, `MainContact.vue`, `MainBlocksType1.vue`, `AboutHero.vue` та `AboutSlider.vue`.

---

`composables`

Папка для різних функцій, які перевикористовються на протязі розробки проекту, або для винесення якоїсь важкої логіки компонента в окремий файл. В цих файлах можна використовувати весь функціонал vue, тобто - використовувати інші `composables`, хуки, рефи та інше. Всі файли з цієї папки автоімортуються `nuxt`, але лише з кореневої папки.

---

`pages`

Папка сторінок (роутів) проекту

```
| pages
  | index.vue   // головна сторінка. роут '/'
  | about.vue   // роут '/about'
  | [id].vue    // будь-який роут, але не '/' та не '/about' та інші, які будуть мати
			          // осмислену назву.
			          // Приклад: '/dynamic-route', '/another-dynamic-route'
  | blog/
     | index.vue   // роут '/blog'
     | [slug].vue  // динамічний роут '/blog/first-article' чи то '/blog/blablabla'

```

---

`plugins`

Папка для плагінів

---

`public`

Папка для статичних файлів: зображень, відео, документів `.pdf`, та ін... `robots.txt` може лежати тут, якщо треба змінити індексацію сайта

---

`server/api`

Папка для створення кінцевих точок `api`, якщо таке потрібно. Більш детально на [офіційному сайті](https://nuxt.com/docs/guide/directory-structure/server#server-directory)

---

`utils`

Як і папка `composables` використовується для створення функціоналу, який можна перевикористовувати. Відмінність від `composables` в тому, що в цій папці можна створювати функціонал, який не використовує `vue` можливості, тобно нативний `js` код.

<br/>
<br/>
<br/>

## Коротко про деякі файли в шаблоні

<br/>

### Стилі

`assets/styles/_css-variables.scss` - файл, в якому описуються загальні змінні для проекту
`assets/styles/_fonts.scss` - піключення шрифтів
`assets/styles/_general.scss` - загальні стилі для проекту
`assets/styles/_hovers.scss` - загальні класи ля ховерів на елементи
`assets/styles/_typography.scss` - класи для текстових елементів
`assets/styles/_vue-transitions.scss` - класи для `vue <transition>`-анімацій

`assets/styles/main.scss` - підключення всіх файлів стилів. Цей файл підключається в файлі конфігурації `nuxt.config.ts`

```ts
  css: [
    "@/assets/styles/main.scss",
  ],
```

<br/>

##### папка `utils`

`assets/styles/utils/_breakpoints.scss` - в цьому файлі визначаютья брекпоінти для `@media` запросів в стилях

`assets/styles/utils/_functions.scss` - файл для `scss`- функцій
`assets/styles/utils/_mixins.scss` - файл для `scss`-міксінів
`assets/styles/utils/_placeholders.scss` - файл для шаблонів стилів
`assets/styles/utils/_vars.scss` - `scss`-змінні

`assets/styles/utils/index.scss` - файл імпорту `scss` функціоналу. Цей файл підключається в файлі конфігурації `nuxt.config.ts`

```ts
  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: '@import "@/assets/styles/utils";',
        },
      },
    },
  },
```

<br />

### `.editorconfig` Файл конфігурації `VS Code`

В файлі описані правила для форматування коду в редакторі `VS Code`. Для роботи треба встановити розширення для `VS Code` [EditorConfig for VS Code](https://marketplace.visualstudio.com/items?itemName=EditorConfig.EditorConfig)
<br/>

### `.env` Змінні середовища

`.env` - файл, в якому прописуються змінні середовища, такі як `api`-домен, секретні данні та інше.

Як їх використовувати можна прочитати на [сторінці](https://nuxt.com/docs/guide/going-further/runtime-config)
<br/>

### `.eslintrc.js` - файл лінтера `ESLint`

Файл конфігураціі `ESLint`. Для роботи в `VS Code` потрібно встановити розширення `ESLint`. Більш детально про роботу лінтера можна почитати [тут](https://eslint.org/)
<br/>

### `.gitignore`

Список файлів і папок, за якими не повинен слідкувати `git`
<br/>

### `.npmrc`

Файл налаштування `npm` менеджера. Зараз в ньому прописані дані для завантаження ліцензії `gsap`
<br/>

### `app.vue`

Стартова точка для `nuxt` проектів. Детальніше про [файл](https://nuxt.com/docs/guide/directory-structure/app)
<br/>

### `nuxt.config.ts`

Файл конфігурації `nuxt`. [Детальніше](https://nuxt.com/docs/guide/directory-structure/nuxt.config)
<br />

### `tsconfig.json`

Файл налаштування `TypeScript`
