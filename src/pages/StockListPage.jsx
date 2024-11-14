import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { fetchStockList, fetchStockPrices } from "../services/api_mock";
import { formatBigNumber } from "../utils/formatters";
import StockFilter from "../components/StockFilter";

const StockListPage = () => {
  const navigate = useNavigate();
  const [stocks, setStocks] = useState([]);
  const [stockPrices, setStockPrices] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(20);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    sector: '',
    priceRange: '',
    marketCapRange: '',
    changeRange: '',
  });

  // Get unique sectors from stocks
  const sectors = [...new Set(stocks.map(stock => stock[3]))];

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    setCurrentPage(1); // Reset to first page when filters change
  };

  const applyFilters = (stock) => {
    const prices = stockPrices[stock[0]];
    const latestPrice = prices?.[prices.length - 1]?.[5] || 0;
    const marketCap = parseFloat(stock[5]);
    const dailyChange = getDailyChange(prices).change;

    // Sector Filter
    if (filters.sector && stock[3] !== filters.sector) return false;

    // Price Range Filter
    if (filters.priceRange) {
      if (filters.priceRange === '500+') {
        if (latestPrice < 500) return false;
      } else {
        const [min, max] = filters.priceRange.split('-').map(Number);
        if (latestPrice < min || latestPrice > max) return false;
      }
    }

    // Market Cap Filter
    if (filters.marketCapRange) {
      switch (filters.marketCapRange) {
        case 'small':
          if (marketCap >= 2e9) return false;
          break;
        case 'mid':
          if (marketCap < 2e9 || marketCap >= 10e9) return false;
          break;
        case 'large':
          if (marketCap < 10e9) return false;
          break;
      }
    }

    // Daily Change Filter
    if (filters.changeRange) {
      if (filters.changeRange === 'positive' && dailyChange < 0) return false;
      if (filters.changeRange === 'negative' && dailyChange >= 0) return false;
    }

    return true;
  };

  useEffect(() => {
    const loadStocks = async () => {
      try {
        setLoading(true);
        const data = await fetchStockList();
        setStocks(data);

        // Fetch prices for all stocks
        const pricePromises = data.map(async (stock) => {
          const prices = await fetchStockPrices(stock[0]);
          return [stock[0], prices];
        });

        const pricesData = await Promise.all(pricePromises);
        const pricesMap = Object.fromEntries(pricesData);
        setStockPrices(pricesMap);
      } catch (err) {
        console.error("Failed to fetch stocks: ", err);
      } finally {
        setLoading(false);
      }
    };

    loadStocks();
  }, []);

  const getDailyChange = (prices) => {
    if (!prices || prices.length < 2)
      return { change: 0, changeStr: "$0.00", percentStr: "0.00%" };

    const currentPrice = prices[prices.length - 1][5];
    const previousClose = prices[prices.length - 2][5];
    const change = currentPrice - previousClose;
    const percentChange = (change / previousClose) * 100;

    return {
      change,
      changeStr: `$${change.toFixed(2)}`,
      percentStr: `${percentChange.toFixed(2)}%`,
    };
  };

  const getLatestPrice = (prices) => {
    if (!prices || !prices.length) return "$0.00";
    return `$${prices[prices.length - 1][5].toFixed(2)}`;
  };

  const getLatestVolume = (prices) => {
    if (!prices || !prices.length) return "0";
    return formatBigNumber(prices[prices.length - 1][6]);
  };

  const getFilteredAndSearchedStocks = () => {
    // First apply filters
    const filteredStocks = stocks.filter(stock => applyFilters(stock));
    
    // Then apply search
    if (!searchTerm) return filteredStocks;
    
    const searchLower = searchTerm.toLowerCase();
    return filteredStocks.filter(
      stock =>
        stock[0].toLowerCase().includes(searchLower) ||
        stock[1].toLowerCase().includes(searchLower)
    );
  };

  const filteredStocks = getFilteredAndSearchedStocks();

  // Calculate pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentStocks = filteredStocks.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredStocks.length / itemsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-gray-900">Stock Market</h1>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6">
        {/* Search and Page Size Controls */}
        <div className="mb-6 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <input
              type="text"
              placeholder="Search in filtered results..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1); // Reset to first page on search
              }}
              className="w-96 px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {searchTerm && (
              <button
                onClick={() => {
                  setSearchTerm('');
                  setCurrentPage(1);
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                Clear search
              </button>
            )}
          </div>
          
          <div className="flex items-center gap-2">
            <span className="text-gray-600">Items per page:</span>
            <select
              value={itemsPerPage}
              onChange={(e) => {
                setItemsPerPage(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={20}>20</option>
            </select>
          </div>
        </div>

        {/* Filter Component */}
        <StockFilter 
          onFilterChange={handleFilterChange}
          sectors={sectors}
        />

        {/* Results count */}
        <div className="mb-4 text-gray-600">
          {filteredStocks.length} results found
          {searchTerm && ` for "${searchTerm}"`}
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="text-center py-8">
            <p className="text-gray-600">Loading stocks...</p>
          </div>
        ) : (
          <>
            {/* Stock List */}
            <div className="bg-white shadow rounded-lg">
              <div className="grid grid-cols-7 gap-4 p-4 font-semibold text-gray-600 border-b">
                <div>Symbol</div>
                <div className="col-span-2">Name</div>
                <div>Daily Change</div>
                <div>Latest Price</div>
                <div>Volume</div>
                <div>Market Cap</div>
              </div>

              {currentStocks.length > 0 ? (
                currentStocks.map((stock) => {
                  const prices = stockPrices[stock[0]];
                  const dailyChange = getDailyChange(prices);

                  return (
                    <div
                      key={stock[0]}
                      onClick={() => navigate(`/stock/${stock[0]}`)}
                      className="grid grid-cols-7 gap-4 p-4 hover:bg-gray-50 cursor-pointer border-b last:border-b-0"
                    >
                      <div className="font-medium text-blue-600">{stock[0]}</div>
                      <div className="col-span-2 text-gray-900">{stock[1]}</div>
                      <div
                        className={
                          dailyChange.change >= 0
                            ? "text-green-600"
                            : "text-red-600"
                        }
                      >
                        {dailyChange.changeStr} ({dailyChange.percentStr})
                      </div>
                      <div className="text-gray-900">{getLatestPrice(prices)}</div>
                      <div className="text-gray-900">{getLatestVolume(prices)}</div>
                      <div className="text-gray-900">
                        {formatBigNumber(stock[5])} {stock[6]}
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="text-center py-8 text-gray-500">
                  No stocks found matching your criteria.
                </div>
              )}
            </div>

            {/* Pagination Controls - Only show if we have stocks */}
            {currentStocks.length > 0 && (
              <div className="mt-6 flex justify-between items-center">
                <div className="text-gray-600">
                  Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredStocks.length)} of{" "}
                  {filteredStocks.length} entries
                </div>
                
                <div className="flex gap-2">
                  <button
                    onClick={() => paginate(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="px-4 py-2 rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                  >
                    Previous
                  </button>
                  
                  {[...Array(totalPages)].map((_, index) => (
                    <button
                      key={index + 1}
                      onClick={() => paginate(index + 1)}
                      className={`px-4 py-2 rounded-lg border ${
                        currentPage === index + 1
                          ? "bg-blue-500 text-white border-blue-500"
                          : "border-gray-300 hover:bg-gray-50"
                      }`}
                    >
                      {index + 1}
                    </button>
                  ))}
                  
                  <button
                    onClick={() => paginate(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
};

export default StockListPage;
