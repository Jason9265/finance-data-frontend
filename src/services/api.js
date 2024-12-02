const BASE_URL = 'http://127.0.0.1:8000/api/stocks'

export const fetchStockList = async () => {
  try {
    const response = await fetch(`${BASE_URL}/stock_list`)
    if (!response.ok) throw new Error('Network response was not ok')
    return await response.json()
  } catch (error) {
    console.error('Error fetching stock list:', error)
    throw error
  }
}

export const fetchStockDetail = async (symbol) => {
  try {
    const response = await fetch(`${BASE_URL}/stock-detail?symbol=${symbol}`)
    if (!response.ok) throw new Error('Network response was not ok')
    return await response.json()
  } catch (error) {
    console.error('Error fetching stock detail:', error)
    throw error
  }
}

export const fetchStockPrices = async (symbol, period = 30, startDate, endDate) => {
  try {
    const url = new URL(`${BASE_URL}/price-data`)
    url.searchParams.append('symbol', symbol)
    url.searchParams.append('period', period)
    if (startDate) url.searchParams.append('start_date', startDate)
    if (endDate) url.searchParams.append('end_date', endDate)

    const response = await fetch(url)
    if (!response.ok) throw new Error('Network response was not ok')
    return await response.json()
  } catch (error) {
    console.error('Error fetching stock prices:', error)
    throw error
  }
}