import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { fetchStockList } from '../services/api'

const StockListPage = () => {
  const navigate = useNavigate()
  const [stocks, setStocks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    const loadStocks = async () => {
      try {
        const data = await fetchStockList()
        setStocks(data)
      } catch (err) {
        setError('Failed to fetch stocks')
      } finally {
        setLoading(false)
      }
    }

    loadStocks()
  }, [])

  const filteredStocks = stocks.filter(stock => 
    stock.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
    stock.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center text-red-600 mt-8">
        {error}
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-gray-900">Stock Market</h1>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6">
        {/* Search Bar */}
        <div className="mb-6">
          <input
            type="text"
            placeholder="Search stocks..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Stock List */}
        <div className="bg-white shadow rounded-lg">
          <div className="grid grid-cols-4 gap-4 p-4 font-semibold text-gray-600 border-b">
            <div>Symbol</div>
            <div>Name</div>
            <div>Price</div>
            <div>Change</div>
          </div>
          
          {filteredStocks.map((stock) => (
            <div
              key={stock.symbol}
              onClick={() => navigate(`/stock/${stock.symbol}`)}
              className="grid grid-cols-4 gap-4 p-4 hover:bg-gray-50 cursor-pointer border-b last:border-b-0"
            >
              <div className="font-medium text-blue-600">{stock.symbol}</div>
              <div className="text-gray-900">{stock.name}</div>
              <div className="text-gray-900">${stock.current_price}</div>
              <div className={`${
                stock.price_change >= 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                {stock.price_change >= 0 ? '+' : ''}{stock.price_change}%
              </div>
            </div>
          ))}

          {filteredStocks.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No stocks found matching your search.
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

export default StockListPage