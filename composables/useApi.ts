// Файл: ~/composables/useApi.ts
export async function useCreateSession(token: string) {
  const res = await fetch("http://border/api/create-session.php", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ session_token: token }),
  })
  return await res.json()
}

export async function useAddQueue({
  session_token,
  border_id,
  vehicle_type,
  queue_length,
  report_time,
}: {
  session_token: string
  border_id: number
  vehicle_type: string
  queue_length: number
  report_time: string
}) {
  const res = await fetch("http://border/api/add-queue.php", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      session_token,
      border_id,
      vehicle_type,
      queue_length,
      report_time,
    }),
  })
  return await res.json()
}
