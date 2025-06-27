export function useQueue() {
  const session = useSession()

  const sendQueue = async (
    border_id: number,
    vehicle_type: string,
    queue_length: number,
    report_time: string
  ) => {
    return await apiFetch("/add-queue.php", {
      method: "POST",
      body: JSON.stringify({
        session_token: session.value,
        border_id,
        vehicle_type,
        queue_length,
        report_time,
      }),
    })
  }

  return { sendQueue }
}
