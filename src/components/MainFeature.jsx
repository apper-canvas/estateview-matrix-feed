import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import ApperIcon from './ApperIcon';
import PropertyCard from './PropertyCard';
import SearchBar from './SearchBar';
import FilterPanel from './FilterPanel';

const MainFeature = ({ 
  properties = [], 
  loading, 
  error, 
  filters, 
  searchQuery, 
  viewMode,
  onSearch, 
  onFilterChange, 
  onViewModeChange 
}) => {
  const navigate = useNavigate();
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState('price-low');

  const sortProperties = (properties, sortBy) => {
    const sorted = [...properties];
    switch (sortBy) {
      case 'price-low':
        return sorted.sort((a, b) => a.price - b.price);
      case 'price-high':
        return sorted.sort((a, b) => b.price - a.price);
      case 'newest':
        return sorted.sort((a, b) => new Date(b.listingDate) - new Date(a.listingDate));
      case 'size-large':
        return sorted.sort((a, b) => b.squareFeet - a.squareFeet);
      case 'bedrooms':
        return sorted.sort((a, b) => b.bedrooms - a.bedrooms);
      default:
        return sorted;
    }
  };

  const sortedProperties = sortProperties(properties, sortBy);

  if (loading) {
    return (
      <div className="min-h-screen bg-soft-white">
        <div className="max-w-7xl mx-auto px-4 py-8">
          {/* Search Bar Skeleton */}
          <div className="mb-8">
            <div className="h-12 bg-gray-200 rounded-lg animate-pulse mb-4"></div>
            <div className="flex space-x-4">
              <div className="h-10 bg-gray-200 rounded w-32 animate-pulse"></div>
              <div className="h-10 bg-gray-200 rounded w-24 animate-pulse"></div>
            </div>
          </div>
          
          {/* Properties Grid Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(9)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="bg-white rounded-xl shadow-card overflow-hidden animate-pulse"
              >
                <div className="h-48 bg-gray-200"></div>
                <div className="p-4 space-y-3">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-soft-white px-4">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center"
        >
          <ApperIcon name="AlertCircle" className="w-16 h-16 text-error mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Something went wrong</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => window.location.reload()}
            className="bg-primary text-white px-6 py-3 rounded-lg font-medium"
          >
            Try Again
          </motion.button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-soft-white">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-display font-bold text-primary mb-4">
            Find Your Perfect Home
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover exceptional properties with our comprehensive search and detailed listings
          </p>
        </div>

        {/* Search Section */}
        <div className="mb-8">
          <SearchBar 
            value={searchQuery}
            onChange={onSearch}
            placeholder="Search by address, city, or zip code..."
          />
        </div>

        {/* Controls Bar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div className="flex items-center space-x-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                showFilters 
                  ? 'bg-primary text-white' 
                  : 'bg-white text-gray-700 hover:bg-surface border'
              }`}
            >
              <ApperIcon name="Filter" className="w-4 h-4" />
              <span>Filters</span>
            </motion.button>

            <div className="text-sm text-gray-600">
              {sortedProperties.length} {sortedProperties.length === 1 ? 'property' : 'properties'} found
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {/* Sort Dropdown */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="newest">Newest First</option>
              <option value="size-large">Largest First</option>
              <option value="bedrooms">Most Bedrooms</option>
            </select>

            {/* View Mode Toggle */}
            <div className="flex bg-white border rounded-lg p-1">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => onViewModeChange('grid')}
                className={`p-2 rounded transition-colors ${
                  viewMode === 'grid' ? 'bg-primary text-white' : 'text-gray-600'
                }`}
              >
                <ApperIcon name="Grid3X3" className="w-4 h-4" />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => onViewModeChange('list')}
                className={`p-2 rounded transition-colors ${
                  viewMode === 'list' ? 'bg-primary text-white' : 'text-gray-600'
                }`}
              >
                <ApperIcon name="List" className="w-4 h-4" />
              </motion.button>
            </div>
          </div>
        </div>

        {/* Filter Panel */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-6 overflow-hidden"
            >
              <FilterPanel 
                filters={filters}
                onChange={onFilterChange}
                onClose={() => setShowFilters(false)}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Results */}
        {sortedProperties.length === 0 ? (
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-center py-16"
          >
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ repeat: Infinity, duration: 3 }}
            >
              <ApperIcon name="Search" className="w-24 h-24 text-gray-300 mx-auto mb-6" />
            </motion.div>
            <h3 className="text-2xl font-display font-semibold text-gray-900 mb-4">
              No Properties Found
            </h3>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              We couldn't find any properties matching your criteria. Try adjusting your filters or search terms.
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                onFilterChange({
                  priceMin: null,
                  priceMax: null,
                  bedroomsMin: null,
                  bathroomsMin: null,
                  squareFeetMin: null,
                  propertyTypes: [],
                  features: []
                });
                onSearch('');
              }}
              className="bg-accent text-white px-8 py-3 rounded-lg font-medium hover:shadow-lg transition-all duration-200"
            >
              Clear All Filters
            </motion.button>
          </motion.div>
        ) : (
          <div className={viewMode === 'grid' 
            ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
            : 'space-y-6'
          }>
            {sortedProperties.map((property, index) => (
              <motion.div
                key={property.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <PropertyCard 
                  property={property} 
                  layout={viewMode}
                  onClick={() => navigate(`/property/${property.id}`)}
                />
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MainFeature;