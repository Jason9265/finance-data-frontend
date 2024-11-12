import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { fetchStockList, fetchStockPrices } from "../services/api_mock";
import { formatBigNumber } from "../utils/formatters";

const StockListPage = () => {
  const navigate = useNavigate();
  const [stocks, setStocks] = useState([]);
  const [stockPrices, setStockPrices] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(20);

  useEffect(() => {
    const loadStocks = async () => {
      try {
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
        console.log("Failed to fetch stocks: ", err);
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

  const filteredStocks = stocks.filter(
    (stock) =>
      stock[0].toLowerCase().includes(searchTerm.toLowerCase()) ||
      stock[1].toLowerCase().includes(searchTerm.toLowerCase())
  );

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
          <input
            type="text"
            placeholder="Search stocks..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1); // Reset to first page on search
            }}
            className="w-96 px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          
          <div className="flex items-center gap-2">
            <span className="text-gray-600">Items per page:</span>
            <select
              value={itemsPerPage}
              onChange={(e) => {
                setItemsPerPage(Number(e.target.value));
                setCurrentPage(1); // Reset to first page when changing items per page
              }}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={20}>20</option>
            </select>
          </div>
        </div>

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

          {currentStocks.map((stock) => {
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
          })}
        </div>

        {/* Pagination Controls */}
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
      </main>
    </div>
  );
};

export default StockListPage;
