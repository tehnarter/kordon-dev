export function useCrossing() {
  const session = useSession()

  const sendCrossing = async (
    border_id: number,
    vehicle_type: string,
    crossing_time_minutes: number,
    reported_at: string
  ) => {
    return await apiFetch("/add-crossing.php", {
      method: "POST",
      body: JSON.stringify({
        session_token: session.value,
        border_id,
        vehicle_type,
        crossing_time_minutes,
        reported_at,
      }),
    })
  }

  return { sendCrossing }
}
