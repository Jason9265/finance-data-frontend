import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, LineChart, CandlestickChart } from "lucide-react";
import { Card, CardHeader, CardContent } from "../components/ui/card";
import { fetchStockDetail, fetchStockPrices } from "../services/api_mock";
import {
  ChartCanvas,
  Chart,
  CandlestickSeries,
  LineSeries,
  XAxis,
  YAxis,
  CrossHairCursor,
  MouseCoordinateX,
  MouseCoordinateY,
  EdgeIndicator,
  OHLCTooltip,
} from "react-financial-charts";
import { format } from "d3-format";
import { timeFormat } from "d3-time-format";
import { scaleTime } from "d3-scale";

const StockDetailPage = () => {
  const { symbol } = useParams();
  const navigate = useNavigate();
  const [stockData, setStockData] = useState([]);
  const [priceData, setPriceData] = useState([]);
  const [dimensions, setDimensions] = useState({ width: 1200, height: 600 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [chartType, setChartType] = useState('line');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [stockDetails, prices] = await Promise.all([
          fetchStockDetail(symbol),
          fetchStockPrices(symbol)
        ]);
        setStockData(stockDetails);
        const formattedPrices = prices.map(price => ({
          date: new Date(price[1]),
          open: price[2],
          high: price[3],
          low: price[4],
          close: price[5],
          volume: price[6],
        }));
        setPriceData(formattedPrices);
      } catch (err) {
        setError("Failed to fetch stock data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [symbol]);

  const xAccessor = d => d.date;

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return <div className="text-center text-red-600 mt-8">{error}</div>;
  }

  // Only calculate xExtents if we have data
  if (!priceData.length) {
    return <div>No price data available</div>;
  }

  const xExtents = [
    xAccessor(priceData[0]),
    xAccessor(priceData[priceData.length - 1])
  ];

  const renderChart = () => {
    return (
      <Chart id={1} yExtents={d => [d.high, d.low]}>
        <XAxis />
        <YAxis />
        {chartType === 'line' ? (
          <LineSeries yAccessor={d => d.close} />
        ) : (
          <CandlestickSeries />
        )}
        <OHLCTooltip origin={[-40, 0]}/>
        <MouseCoordinateX
          at="bottom"
          orient="bottom"
          displayFormat={timeFormat("%Y-%m-%d")}
        />
        <MouseCoordinateY
          at="right"
          orient="right"
          displayFormat={format(".2f")}
        />
        <EdgeIndicator
          itemType="last"
          orient="right"
          edgeAt="right"
          yAccessor={d => d.close}
          fill={d => d.close > d.open ? "#26a69a" : "#ef5350"}
        />
      </Chart>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center">
            <button
              onClick={() => navigate(-1)}
              className="mr-4 p-2 rounded-full hover:bg-gray-100"
            >
              <ArrowLeft className="h-6 w-6" />
            </button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{symbol}</h1>
              <p className="text-gray-500">{stockData?.[1]}</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6">
        <Card className="mb-6">
          <CardHeader>
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Price History</h2>
              <div className="flex gap-2">
                <button
                  onClick={() => setChartType('line')}
                  className={`p-2 rounded-lg ${
                    chartType === 'line' 
                      ? 'bg-blue-100 text-blue-600' 
                      : 'hover:bg-gray-100'
                  }`}
                  title="Line Chart"
                >
                  <LineChart className="h-5 w-5" />
                </button>
                <button
                  onClick={() => setChartType('candlestick')}
                  className={`p-2 rounded-lg ${
                    chartType === 'candlestick' 
                      ? 'bg-blue-100 text-blue-600' 
                      : 'hover:bg-gray-100'
                  }`}
                  title="Candlestick Chart"
                >
                  <CandlestickChart className="h-5 w-5" />
                </button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-[600px]">
              <ChartCanvas
                height={dimensions.height}
                width={dimensions.width}
                ratio={1}
                margin={{ left: 50, right: 50, top: 10, bottom: 30 }}
                data={priceData}
                xAccessor={xAccessor}
                xScale={scaleTime()}
                xExtents={xExtents}
              >
                {renderChart()}
                <CrossHairCursor />
              </ChartCanvas>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <h2 className="text-xl font-semibold">Stock Details</h2>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Latest Price</p>
                <p className="text-lg font-medium">
                  ${priceData[priceData.length - 1]?.close.toFixed(2)}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Market Cap</p>
                <p className="text-lg font-medium">{stockData?.[5]} {stockData?.[6]}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Sector</p>
                <p className="text-lg font-medium">{stockData?.[3]}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Industry</p>
                <p className="text-lg font-medium">{stockData?.[4]}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default StockDetailPage;