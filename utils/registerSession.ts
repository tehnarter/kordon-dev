export async function registerSession() {
  if (typeof window === "undefined") return null // SSR захист

  const name = localStorage.getItem("name") ?? "Гість"
  const auth_provider =
    name === "Гість"
      ? "guest"
      : (localStorage.getItem("auth_provider") ?? "custom")
  const auth_id =
    name === "Гість"
      ? "guest_" + Math.random().toString(36).substring(2, 12)
      : (localStorage.getItem("auth_id") ?? "custom_" + name)

  const session_token = crypto.randomUUID()

  try {
    const res = await fetch("http://border/api/register-session.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ session_token, name, auth_provider, auth_id }),
    })

    const result = await res.json()
    if (!res.ok) {
      console.error("❌ Помилка реєстрації сесії:", result)
      return null
    }

    // Зберігаємо в sessionStorage тільки після успішної реєстрації
    sessionStorage.setItem("active_token", session_token)
    console.log("✅ Токен збережено:", session_token)
    return session_token
  } catch (e) {
    console.error("❌ Запит не вдався", e)
    return null
  }
}
