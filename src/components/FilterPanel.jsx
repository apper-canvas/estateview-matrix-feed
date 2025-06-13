import { useState } from 'react';
import { motion } from 'framer-motion';
import ApperIcon from './ApperIcon';

const FilterPanel = ({ filters, onChange, onClose }) => {
  const [localFilters, setLocalFilters] = useState(filters);

  const propertyTypes = [
    'House',
    'Apartment',
    'Condo',
    'Townhouse',
    'Duplex',
    'Land'
  ];

  const features = [
    'Garage',
    'Pool',
    'Fireplace',
    'Hardwood Floors',
    'Updated Kitchen',
    'Walk-in Closet',
    'Laundry Room',
    'Basement',
    'Balcony',
    'Garden',
    'Air Conditioning',
    'Dishwasher'
  ];

  const handlePriceChange = (field, value) => {
    const numValue = value === '' ? null : parseInt(value.replace(/,/g, ''));
    setLocalFilters(prev => ({
      ...prev,
      [field]: numValue
    }));
  };

  const handleNumberChange = (field, value) => {
    const numValue = value === '' ? null : parseInt(value);
    setLocalFilters(prev => ({
      ...prev,
      [field]: numValue
    }));
  };

  const handleArrayToggle = (field, value) => {
    setLocalFilters(prev => ({
      ...prev,
      [field]: prev[field].includes(value)
        ? prev[field].filter(item => item !== value)
        : [...prev[field], value]
    }));
  };

  const handleApplyFilters = () => {
    onChange(localFilters);
    onClose();
  };

  const handleResetFilters = () => {
    const resetFilters = {
      priceMin: null,
      priceMax: null,
      bedroomsMin: null,
      bathroomsMin: null,
      squareFeetMin: null,
      propertyTypes: [],
      features: []
    };
    setLocalFilters(resetFilters);
    onChange(resetFilters);
  };

  const formatNumber = (value) => {
    if (!value) return '';
    return new Intl.NumberFormat('en-US').format(value);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="bg-white rounded-xl shadow-card p-6"
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-display font-semibold text-primary">
          Filter Properties
        </h3>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onClose}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ApperIcon name="X" className="w-5 h-5" />
        </motion.button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Price Range */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Price Range
          </label>
          <div className="space-y-3">
            <div>
              <label className="block text-xs text-gray-500 mb-1">Minimum</label>
              <input
                type="text"
                value={formatNumber(localFilters.priceMin)}
                onChange={(e) => handlePriceChange('priceMin', e.target.value)}
                placeholder="$0"
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">Maximum</label>
              <input
                type="text"
                value={formatNumber(localFilters.priceMax)}
                onChange={(e) => handlePriceChange('priceMax', e.target.value)}
                placeholder="No limit"
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm"
              />
            </div>
          </div>
        </div>

        {/* Bedrooms & Bathrooms */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Minimum Bedrooms & Bathrooms
          </label>
          <div className="space-y-3">
            <div>
              <label className="block text-xs text-gray-500 mb-1">Bedrooms</label>
              <select
                value={localFilters.bedroomsMin || ''}
                onChange={(e) => handleNumberChange('bedroomsMin', e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm"
              >
                <option value="">Any</option>
                {[1, 2, 3, 4, 5, 6].map(num => (
                  <option key={num} value={num}>{num}+</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">Bathrooms</label>
              <select
                value={localFilters.bathroomsMin || ''}
                onChange={(e) => handleNumberChange('bathroomsMin', e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm"
              >
                <option value="">Any</option>
                {[1, 1.5, 2, 2.5, 3, 3.5, 4].map(num => (
                  <option key={num} value={num}>{num}+</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Square Footage */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Minimum Square Feet
          </label>
          <input
            type="text"
            value={formatNumber(localFilters.squareFeetMin)}
            onChange={(e) => handleNumberChange('squareFeetMin', e.target.value.replace(/,/g, ''))}
            placeholder="Any size"
            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm"
          />
        </div>
      </div>

      {/* Property Types */}
      <div className="mt-6">
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Property Type
        </label>
        <div className="flex flex-wrap gap-2">
          {propertyTypes.map(type => (
            <motion.button
              key={type}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleArrayToggle('propertyTypes', type)}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                localFilters.propertyTypes.includes(type)
                  ? 'bg-primary text-white'
                  : 'bg-surface text-gray-700 hover:bg-gray-200'
              }`}
            >
              {type}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Features */}
      <div className="mt-6">
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Features & Amenities
        </label>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
          {features.map(feature => (
            <motion.button
              key={feature}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleArrayToggle('features', feature)}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 text-left ${
                localFilters.features.includes(feature)
                  ? 'bg-primary text-white'
                  : 'bg-surface text-gray-700 hover:bg-gray-200'
              }`}
            >
              {feature}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 mt-8">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleApplyFilters}
          className="flex-1 bg-accent text-white py-3 rounded-lg font-medium hover:shadow-lg transition-all duration-200"
        >
          Apply Filters
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleResetFilters}
          className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-300 transition-all duration-200"
        >
          Reset All
        </motion.button>
      </div>
    </motion.div>
  );
};

export default FilterPanel;