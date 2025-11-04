Border Queue Tracker 🇺🇦

A Nuxt 3 application for real-time border queue tracking between Ukraine and neighboring countries.
Displays current queue lengths, estimated border crossing time, and supports both automatic and manual data input modes.

 Features

Real-time data from PHP API (MySQL backend)

Automatic location detection with fallback to Lviv

Queue statistics by vehicle type (cars, buses, TIR, pedestrians)

Dynamic modals for manual data submission

Session token tracking (one token = one trip)

Multi-language support (i18n)

Responsive UI with SCSS and GSAP animations

🧩 Tech Stack

Frontend: Nuxt 3, Vue 3, TypeScript

Styling: SCSS, GSAP animations

Backend: PHP 8 + MySQL (border_ua database)

Data Fetching: $fetch API

Localization: vue-i18n

⚙️ Setup
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build


Backend should be available locally at:
http://border/

 Project Structure
components/
  ├── AppHeader.vue
  ├── BorderTracker.vue
  ├── modals/
  └── ...
composables/
  ├── useMenu.ts
  └── useSessionToken.ts

 Notes

A new session_token is generated for each page reload.

Manual input modal opens if no border-key is set.

Data automatically updates every hour.

🪪 License

This project is licensed under the Creative Commons Attribution-NonCommercial 4.0 International License (CC BY-NC 4.0).

You may use, modify, and share this project for non-commercial purposes only.
Commercial use is strictly prohibited without the author’s permission.

Read more: https://creativecommons.org/licenses/by-nc/4.0/

🇺🇦 Ліцензія (українською)

Цей проєкт розповсюджується за умовами ліцензії CC BY-NC 4.0.
Ви можете вільно використовувати, змінювати та поширювати цей код тільки в некомерційних цілях
із збереженням авторського посилання.

Використання у комерційних продуктах без письмового дозволу автора заборонене.

