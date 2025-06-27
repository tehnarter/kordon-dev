export function useSession() {
  const token = useCookie("session_token", { maxAge: 60 * 60 * 24 * 30 })
  if (!token.value) {
    token.value = crypto.randomUUID()
    apiFetch("/create-session.php", {
      method: "POST",
      body: JSON.stringify({ session_token: token.value }),
    })
  }
  return token
}
