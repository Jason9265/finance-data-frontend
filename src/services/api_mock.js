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
];
const MOCK_PRICE_HISTORY = {
  AAPL: [
    [
      1,
      "2024-10-09 04:00:00.000000",
      224.98,
      229.5,
      224.58,
      229.29,
      33591100,
      0,
      0,
      "AAPL",
    ],
    [
      2,
      "2024-10-10 04:00:00.000000",
      227.53,
      229.25,
      226.92,
      228.79,
      28183500,
      0,
      0,
      "AAPL",
    ],
    [
      3,
      "2024-10-11 04:00:00.000000",
      228.12,
      230.5,
      227.81,
      229.98,
      29876500,
      0,
      0,
      "AAPL",
    ],
    [
      4,
      "2024-10-12 04:00:00.000000",
      229.45,
      231.2,
      228.9,
      230.45,
      31245600,
      0,
      0,
      "AAPL",
    ],
    [
      5,
      "2024-10-13 04:00:00.000000",
      230.01,
      232.5,
      229.75,
      231.89,
      30157800,
      0,
      0,
      "AAPL",
    ],
  ],
  MSFT: [
    [
      1,
      "2024-10-09 04:00:00.000000",
      334.98,
      339.5,
      334.58,
      339.29,
      23591100,
      0,
      0,
      "MSFT",
    ],
    [
      2,
      "2024-10-10 04:00:00.000000",
      337.53,
      339.25,
      336.92,
      338.79,
      18183500,
      0,
      0,
      "MSFT",
    ],
    [
      3,
      "2024-10-11 04:00:00.000000",
      338.12,
      340.5,
      337.81,
      339.98,
      19876500,
      0,
      0,
      "MSFT",
    ],
    [
      4,
      "2024-10-12 04:00:00.000000",
      339.45,
      341.2,
      338.9,
      340.45,
      21245600,
      0,
      0,
      "MSFT",
    ],
    [
      5,
      "2024-10-13 04:00:00.000000",
      340.01,
      342.5,
      339.75,
      341.89,
      20157800,
      0,
      0,
      "MSFT",
    ],
  ],
};

export const fetchStockList = async () => {
  return MOCK_STOCKS;
};

// Helper function to convert array to object format if needed
const getStockObject = (stockArray) => {
  return {
    symbol: stockArray[0],
    shortName: stockArray[1],
    longName: stockArray[2],
    sector: stockArray[3],
    industry: stockArray[4],
    marketCap: stockArray[5],
    currency: stockArray[6],
    exchange: stockArray[7],
    type: stockArray[8],
    lastUpdated: stockArray[9],
  };
};

export const fetchStockDetail = async (symbol) => {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 500));

  const stock = MOCK_STOCKS.find((stock) => stock[0] === symbol);
  if (!stock) {
    throw new Error("Stock not found");
  }

  return getStockObject(stock);
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
