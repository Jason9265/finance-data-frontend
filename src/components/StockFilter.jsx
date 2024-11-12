import { useState } from 'react';

const StockFilter = ({ onFilterChange, sectors }) => {
  const [filters, setFilters] = useState({
    sector: '',
    priceRange: '',
    marketCapRange: '',
    changeRange: '',
  });

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow mb-6">
      <h2 className="text-lg font-semibold mb-4">Filters</h2>
      <div className="grid grid-cols-4 gap-4">
        {/* Sector Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Sector
          </label>
          <select
            value={filters.sector}
            onChange={(e) => handleFilterChange('sector', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Sectors</option>
            {sectors.map((sector) => (
              <option key={sector} value={sector}>
                {sector}
              </option>
            ))}
          </select>
        </div>

        {/* Price Range Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Price Range
          </label>
          <select
            value={filters.priceRange}
            onChange={(e) => handleFilterChange('priceRange', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Prices</option>
            <option value="0-50">$0 - $50</option>
            <option value="50-100">$50 - $100</option>
            <option value="100-500">$100 - $500</option>
            <option value="500+">$500+</option>
          </select>
        </div>

        {/* Market Cap Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Market Cap
          </label>
          <select
            value={filters.marketCapRange}
            onChange={(e) => handleFilterChange('marketCapRange', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Market Caps</option>
            <option value="small">Small Cap (Less than $2B)</option>
            <option value="mid">Mid Cap ($2B - $10B)</option>
            <option value="large">Large Cap (Over $10B)</option>
          </select>
        </div>

        {/* Daily Change Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Daily Change
          </label>
          <select
            value={filters.changeRange}
            onChange={(e) => handleFilterChange('changeRange', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Changes</option>
            <option value="positive">Positive Change</option>
            <option value="negative">Negative Change</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default StockFilter; 