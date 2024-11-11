const BASE_URL = 'http://127.0.0.1:8000/api'

export const fetchStockList = async () => {
  try {
    const response = await fetch(`${BASE_URL}/stocks`)
    if (!response.ok) throw new Error('Network response was not ok')
    return await response.json()
  } catch (error) {
    console.error('Error fetching stock list:', error)
    throw error
  }
}

export const fetchStockDetail = async (symbol) => {
  try {
    const response = await fetch(`${BASE_URL}/stocks/${symbol}`)
    if (!response.ok) throw new Error('Network response was not ok')
    const data = await response.json()
    return {
      ...data,
      price_history: data.price_history || []
    }
  } catch (error) {
    console.error('Error fetching stock detail:', error)
    throw error
  }
}