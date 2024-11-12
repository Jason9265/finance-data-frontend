// This is a mock API for the stocks data
const MOCK_STOCKS = [
  [
    "AAPL",
    "Apple Inc.",
    "Apple Inc.",
    "Technology",
    "Consumer Electronics",
    "3430681935872",
    "USD",
    "NMS",
    "EQUITY",
    "2024-11-11 05:33:12.803444",
  ],
  [
    "MSFT",
    "Microsoft",
    "Microsoft Corporation",
    "Technology",
    "Software",
    "2890681935872",
    "USD",
    "NMS",
    "EQUITY",
    "2024-11-11 05:33:12.803444",
  ],
  [
    "GOOGL",
    "Alphabet",
    "Alphabet Inc.",
    "Technology",
    "Internet Services",
    "1890681935872",
    "USD",
    "NMS",
    "EQUITY",
    "2024-11-11 05:33:12.803444",
  ],
  [
    "AMZN",
    "Amazon",
    "Amazon.com Inc.",
    "Consumer Cyclical",
    "Internet Retail",
    "1590681935872",
    "USD",
    "NMS",
    "EQUITY",
    "2024-11-11 05:33:12.803444",
  ],
  [
    "META",
    "Meta",
    "Meta Platforms Inc.",
    "Technology",
    "Internet Services",
    "890681935872",
    "USD",
    "NMS",
    "EQUITY",
    "2024-11-11 05:33:12.803444",
  ],
  [
    "NVDA",
    "NVIDIA",
    "NVIDIA Corporation",
    "Technology",
    "Semiconductors",
    "1120681935872",
    "USD",
    "NMS",
    "EQUITY",
    "2024-11-11 05:33:12.803444",
  ],
  [
    "WMT",
    "Walmart",
    "Walmart Inc.",
    "Consumer Defensive",
    "Retail",
    "420681935872",
    "USD",
    "NYSE",
    "EQUITY",
    "2024-11-11 05:33:12.803444",
  ],
  [
    "JPM",
    "JPMorgan",
    "JPMorgan Chase & Co.",
    "Financial",
    "Banks",
    "510681935872",
    "USD",
    "NYSE",
    "EQUITY",
    "2024-11-11 05:33:12.803444",
  ],
  [
    "V",
    "Visa",
    "Visa Inc.",
    "Financial",
    "Credit Services",
    "495681935872",
    "USD",
    "NYSE",
    "EQUITY",
    "2024-11-11 05:33:12.803444",
  ],
  [
    "JNJ",
    "Johnson & Johnson",
    "Johnson & Johnson",
    "Healthcare",
    "Drug Manufacturers",
    "380681935872",
    "USD",
    "NYSE",
    "EQUITY",
    "2024-11-11 05:33:12.803444",
  ],
  [
    "UNH",
    "UnitedHealth",
    "UnitedHealth Group Inc.",
    "Healthcare",
    "Healthcare Plans",
    "445681935872",
    "USD",
    "NYSE",
    "EQUITY",
    "2024-11-11 05:33:12.803444",
  ],
  [
    "XOM",
    "ExxonMobil",
    "Exxon Mobil Corporation",
    "Energy",
    "Oil & Gas",
    "468681935872",
    "USD",
    "NYSE",
    "EQUITY",
    "2024-11-11 05:33:12.803444",
  ],
  [
    "NFLX",
    "Netflix",
    "Netflix Inc.",
    "Communication Services",
    "Entertainment",
    "215681935872",
    "USD",
    "NMS",
    "EQUITY",
    "2024-11-11 05:33:12.803444",
  ],
  [
    "DIS",
    "Disney",
    "The Walt Disney Company",
    "Communication Services",
    "Entertainment",
    "198681935872",
    "USD",
    "NYSE",
    "EQUITY",
    "2024-11-11 05:33:12.803444",
  ],
  [
    "TSLA",
    "Tesla",
    "Tesla Inc.",
    "Consumer Cyclical",
    "Auto Manufacturers",
    "856681935872",
    "USD",
    "NMS",
    "EQUITY",
    "2024-11-11 05:33:12.803444",
  ],
];

// Helper function to generate realistic price movements
const generatePriceHistory = (basePrice, days = 30) => {
  const prices = [];
  let currentPrice = basePrice;
  const volatility = basePrice * 0.02; // 2% volatility

  for (let i = 0; i < days; i++) {
    const date = new Date(2024, 9, i + 1); // Starting from Oct 1, 2024
    const dailyChange = (Math.random() - 0.5) * volatility;
    const open = currentPrice;
    const close = currentPrice + dailyChange;
    const high = Math.max(open, close) + Math.random() * volatility * 0.5;
    const low = Math.min(open, close) - Math.random() * volatility * 0.5;
    const volume = Math.floor(Math.random() * 20000000) + 10000000;

    prices.push([
      i + 1,
      date.toISOString().replace('T', ' ').split('.')[0],
      Number(open.toFixed(2)),
      Number(high.toFixed(2)),
      Number(low.toFixed(2)),
      Number(close.toFixed(2)),
      volume,
      0,
      0,
      currentPrice > open ? 1 : -1, // Trend indicator
    ]);

    currentPrice = close;
  }

  return prices;
};

const MOCK_PRICE_HISTORY = {
  'AAPL': generatePriceHistory(225.50),
  'MSFT': generatePriceHistory(335.75),
  'GOOGL': generatePriceHistory(140.25),
  'AMZN': generatePriceHistory(145.80),
  'META': generatePriceHistory(325.90),
  'NVDA': generatePriceHistory(485.90),
  'WMT': generatePriceHistory(169.50),
  'JPM': generatePriceHistory(152.75),
  'V': generatePriceHistory(245.30),
  'JNJ': generatePriceHistory(158.90),
  'UNH': generatePriceHistory(528.40),
  'XOM': generatePriceHistory(105.80),
  'NFLX': generatePriceHistory(435.60),
  'DIS': generatePriceHistory(92.75),
  'TSLA': generatePriceHistory(238.45),
};

// Test the data
console.log('Sample AAPL data:', MOCK_PRICE_HISTORY['AAPL'].slice(0, 5));

export const fetchStockList = async () => {
  return MOCK_STOCKS;
};

export const fetchStockDetail = async (symbol) => {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 500));

  const stock = MOCK_STOCKS.find((stock) => stock[0] === symbol);
  if (!stock) {
    throw new Error("Stock not found");
  }

  return stock;
};

const parsePriceData = (priceArray) => {
  return {
    id: priceArray[0],
    datetime: priceArray[1],
    open: priceArray[2],
    high: priceArray[3],
    low: priceArray[4],
    close: priceArray[5],
    volume: priceArray[6],
    value1: priceArray[7],
    value2: priceArray[8],
    symbol: priceArray[9],
  };
};
export const fetchStockPrices = async (symbol) => {
  await new Promise((resolve) => setTimeout(resolve, 500));

  const prices = MOCK_PRICE_HISTORY[symbol];
  if (!prices) {
    throw new Error("Stock price history not found");
  }

  return prices;
};
export const fetchStockPricesAsObjects = async (symbol) => {
  const prices = await fetchStockPrices(symbol);
  return prices.map((price) => parsePriceData(price));
};
