import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import Input from '@/components/atoms/Input';
import Text from '@/components/atoms/Text';

const ControlsBar = ({ 
  propertyCount, 
  showFilters, 
  onToggleFilters, 
  sortBy, 
  onSortChange, 
  viewMode, 
  onViewModeChange 
}) => {
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
      <div className="flex items-center space-x-4">
        <Button
          onClick={onToggleFilters}
          className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium ${
            showFilters 
              ? 'bg-primary text-white' 
              : 'bg-white text-gray-700 hover:bg-surface border'
          }`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <ApperIcon name="Filter" className="w-4 h-4" />
          <Text as="span">Filters</Text>
        </Button>

        <Text className="text-sm text-gray-600">
          {propertyCount} {propertyCount === 1 ? 'property' : 'properties'} found
        </Text>
      </div>

      <div className="flex items-center space-x-4">
        {/* Sort Dropdown */}
        <Input
          as="select"
          value={sortBy}
          onChange={(e) => onSortChange(e.target.value)}
          className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary !py-2 !px-3"
        >
          <option value="price-low">Price: Low to High</option>
          <option value="price-high">Price: High to Low</option>
          <option value="newest">Newest First</option>
          <option value="size-large">Largest First</option>
          <option value="bedrooms">Most Bedrooms</option>
        </Input>

        {/* View Mode Toggle */}
        <div className="flex bg-white border rounded-lg p-1">
          <Button
            onClick={() => onViewModeChange('grid')}
            className={`p-2 rounded ${
              viewMode === 'grid' ? 'bg-primary text-white' : 'text-gray-600 !bg-transparent'
            } !px-0 !py-0`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <ApperIcon name="Grid3X3" className="w-4 h-4" />
          </Button>
          <Button
            onClick={() => onViewModeChange('list')}
            className={`p-2 rounded ${
              viewMode === 'list' ? 'bg-primary text-white' : 'text-gray-600 !bg-transparent'
            } !px-0 !py-0`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <ApperIcon name="List" className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ControlsBar;