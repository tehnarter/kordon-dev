export default function errorHandler(error: any) {
  console.error("🔥 SSR ERROR CAUGHT 🔥")
  console.error(error) // повний об’єкт/стек-трейс помилки
  throw error // передаємо далі, щоб Nitro показав подробиці у консолі
}
