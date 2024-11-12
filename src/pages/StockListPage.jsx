import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { fetchStockList, fetchStockPrices } from "../services/api_mock";
import { formatBigNumber } from "../utils/formatters";

const StockListPage = () => {
  const navigate = useNavigate();
  const [stocks, setStocks] = useState([]);
  const [stockPrices, setStockPrices] = useState({});
  const [searchTerm, setSearchTerm] = useState("");

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
          <div className="grid grid-cols-7 gap-4 p-4 font-semibold text-gray-600 border-b">
            <div>Symbol</div>
            <div className="col-span-2">Name</div>
            <div>Daily Change</div>
            <div>Latest Price</div>
            <div>Volume</div>
            <div>Market Cap</div>
          </div>

          {stocks
            .filter(
              (stock) =>
                stock[0].toLowerCase().includes(searchTerm.toLowerCase()) ||
                stock[1].toLowerCase().includes(searchTerm.toLowerCase())
            )
            .map((stock) => {
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
      </main>
    </div>
  );
};

export default StockListPage;
