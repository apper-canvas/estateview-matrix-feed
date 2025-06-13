import { useState } from 'react';
import { motion } from 'framer-motion';
import ApperIcon from './ApperIcon';

const SearchBar = ({ value, onChange, placeholder = "Search properties..." }) => {
  const [isFocused, setIsFocused] = useState(false);
  const [suggestions] = useState([
    'New York, NY',
    'Los Angeles, CA',
    'Chicago, IL',
    'Houston, TX',
    'Phoenix, AZ',
    'Philadelphia, PA'
  ]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const handleInputChange = (e) => {
    const newValue = e.target.value;
    onChange(newValue);
    setShowSuggestions(newValue.length > 0);
  };

  const handleSuggestionClick = (suggestion) => {
    onChange(suggestion);
    setShowSuggestions(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setShowSuggestions(false);
  };

  return (
    <div className="relative max-w-2xl mx-auto">
      <form onSubmit={handleSubmit}>
        <div className={`relative bg-white rounded-xl shadow-card transition-all duration-200 ${
          isFocused ? 'shadow-card-hover' : ''
        }`}>
          <div className="flex items-center">
            <div className="pl-4">
              <ApperIcon name="Search" className="w-5 h-5 text-gray-400" />
            </div>
            <input
              type="text"
              value={value}
              onChange={handleInputChange}
              onFocus={() => setIsFocused(true)}
              onBlur={() => {
                setIsFocused(false);
                // Delay hiding suggestions to allow for clicks
                setTimeout(() => setShowSuggestions(false), 200);
              }}
              placeholder={placeholder}
              className="flex-1 px-4 py-3 text-gray-900 placeholder-gray-500 bg-transparent rounded-xl focus:outline-none"
            />
            {value && (
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                type="button"
                onClick={() => {
                  onChange('');
                  setShowSuggestions(false);
                }}
                className="pr-4 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <ApperIcon name="X" className="w-4 h-4" />
              </motion.button>
            )}
          </div>
        </div>
      </form>

      {/* Search Suggestions */}
      {showSuggestions && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-lg z-50 max-h-60 overflow-y-auto"
        >
          {suggestions
            .filter(suggestion => 
              suggestion.toLowerCase().includes(value.toLowerCase())
            )
            .slice(0, 6)
            .map((suggestion, index) => (
              <motion.button
                key={suggestion}
                whileHover={{ backgroundColor: '#F5F2ED' }}
                onClick={() => handleSuggestionClick(suggestion)}
                className="w-full text-left px-4 py-3 hover:bg-surface transition-colors border-b border-gray-100 last:border-b-0 flex items-center space-x-3"
              >
                <ApperIcon name="MapPin" className="w-4 h-4 text-gray-400" />
                <span className="text-gray-700">{suggestion}</span>
              </motion.button>
            ))}
          
          {value && !suggestions.some(s => s.toLowerCase().includes(value.toLowerCase())) && (
            <div className="px-4 py-3 text-gray-500 text-sm">
              No suggestions found for "{value}"
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
};

export default SearchBar;