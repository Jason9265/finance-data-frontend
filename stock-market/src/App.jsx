import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import StockListPage from './pages/StockListPage'
import StockDetailPage from './pages/StockDetailPage'

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Routes>
          <Route path="/" element={<StockListPage />} />
          <Route path="/stock/:symbol" element={<StockDetailPage />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App