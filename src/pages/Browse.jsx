import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import MainFeature from '../components/MainFeature';
import PropertyService from '../services/api/PropertyService';

const Browse = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    priceMin: null,
    priceMax: null,
    bedroomsMin: null,
    bathroomsMin: null,
    squareFeetMin: null,
    propertyTypes: [],
    features: []
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState('grid');

  useEffect(() => {
    const loadProperties = async () => {
      setLoading(true);
      setError(null);
      try {
        const result = await PropertyService.getAll();
        setProperties(result);
      } catch (err) {
        setError(err.message || 'Failed to load properties');
        toast.error('Failed to load properties');
      } finally {
        setLoading(false);
      }
    };
    loadProperties();
  }, []);

  const handleSearch = async (query) => {
    setSearchQuery(query);
    setLoading(true);
    try {
      const result = await PropertyService.search(query);
      setProperties(result);
    } catch (err) {
      toast.error('Search failed');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = async (newFilters) => {
    setFilters(newFilters);
    setLoading(true);
    try {
      const result = await PropertyService.filter(newFilters);
      setProperties(result);
    } catch (err) {
      toast.error('Filter failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-soft-white">
      <MainFeature 
        properties={properties}
        loading={loading}
        error={error}
        filters={filters}
        searchQuery={searchQuery}
        viewMode={viewMode}
        onSearch={handleSearch}
        onFilterChange={handleFilterChange}
        onViewModeChange={setViewMode}
      />
    </div>
  );
};

export default Browse;