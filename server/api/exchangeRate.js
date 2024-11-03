export default defineEventHandler(async (event) => {
  // Отримуємо параметри запиту
  const { currencyCode, dateFormat } = getQuery(event)

  try {
    // Виконуємо запит до зовнішнього API
    const response = await fetch(
      `https://bank.gov.ua/NBU_Exchange/exchange_site?start=${dateFormat}&end=${dateFormat}&valcode=${currencyCode.toLowerCase()}&sort=exchangedate&order=desc&json`
    )

    if (!response.ok) {
      throw new Error(`Помилка отримання курсу: ${response.status}`)
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error("Помилка на сервері:", error.message)
    return { error: "Помилка отримання даних з API" }
  }
})
