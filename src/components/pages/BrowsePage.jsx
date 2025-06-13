import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import PropertyService from '@/services/api/PropertyService';
import SearchBar from '@/components/organisms/SearchBar';
import FilterPanel from '@/components/organisms/FilterPanel';
import HeroSection from '@/components/organisms/HeroSection';
import ControlsBar from '@/components/organisms/ControlsBar';
import PropertyListLayout from '@/components/organisms/PropertyListLayout';
import EmptyErrorLoadingState from '@/components/organisms/EmptyErrorLoadingState';

const BrowsePage = () => {
  const navigate = useNavigate();
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
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState('price-low');

const fetchProperties = async (search = searchQuery, currentFilters = filters) => {
    setLoading(true);
    setError(null);
    try {
      let result = await PropertyService.getAll(); // Fetch all first
      
      // Apply search locally
      if (search) {
        const searchLower = search.toLowerCase();
        result = result.filter(p => 
          p.address.toLowerCase().includes(searchLower) ||
          p.city.toLowerCase().includes(searchLower) ||
          p.zip_code.toLowerCase().includes(searchLower)
        );
      }

      // Apply filters locally (since database filter supports all types)
      result = result.filter(p => {
        const priceMatch = (currentFilters.priceMin === null || p.price >= currentFilters.priceMin) &&
                           (currentFilters.priceMax === null || p.price <= currentFilters.priceMax);
        const bedroomsMatch = currentFilters.bedroomsMin === null || p.bedrooms >= currentFilters.bedroomsMin;
        const bathroomsMatch = currentFilters.bathroomsMin === null || p.bathrooms >= currentFilters.bathroomsMin;
        const squareFeetMatch = currentFilters.squareFeetMin === null || p.square_feet >= currentFilters.squareFeetMin;
        
        const propertyTypeMatch = currentFilters.propertyTypes.length === 0 || 
                                  currentFilters.propertyTypes.includes(p.property_type);

        const featuresMatch = currentFilters.features.length === 0 || 
                              currentFilters.features.every(f => p.features && p.features.includes(f));
        
        return priceMatch && bedroomsMatch && bathroomsMatch && squareFeetMatch && propertyTypeMatch && featuresMatch;
      });

      setProperties(result);
    } catch (err) {
      setError(err.message || 'Failed to load properties');
      toast.error('Failed to load properties');
    } finally {
      setLoading(false);
    }
};

  useEffect(() => {
    fetchProperties(searchQuery, filters);
  }, [searchQuery, filters]); // Re-fetch when search query or filters change

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

const sortProperties = (propertiesArray) => {
    const sorted = [...propertiesArray];
    switch (sortBy) {
      case 'price-low':
        return sorted.sort((a, b) => a.price - b.price);
      case 'price-high':
        return sorted.sort((a, b) => b.price - a.price);
      case 'newest':
        return sorted.sort((a, b) => new Date(b.listing_date) - new Date(a.listing_date));
      case 'size-large':
        return sorted.sort((a, b) => b.square_feet - a.square_feet);
      case 'bedrooms':
        return sorted.sort((a, b) => b.bedrooms - a.bedrooms);
      default:
        return sorted;
    }
  };

const sortedProperties = sortProperties(properties);

  if (loading) {
    return <EmptyErrorLoadingState type="loading" />;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-soft-white px-4">
        <EmptyErrorLoadingState 
          type="error"
          icon="AlertCircle"
          title="Something went wrong"
          message={error}
          onAction={() => window.location.reload()}
          actionText="Try Again"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-soft-white">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <HeroSection 
          title="Find Your Perfect Home" 
          subtitle="Discover exceptional properties with our comprehensive search and detailed listings" 
        />

        <div className="mb-8">
          <SearchBar 
            value={searchQuery}
            onChange={handleSearch}
            placeholder="Search by address, city, or zip code..."
          />
        </div>

        <ControlsBar 
          propertyCount={sortedProperties.length}
          showFilters={showFilters}
          onToggleFilters={() => setShowFilters(!showFilters)}
          sortBy={sortBy}
          onSortChange={setSortBy}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
        />

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
                onChange={handleFilterChange}
                onClose={() => setShowFilters(false)}
              />
            </motion.div>
          )}
        </AnimatePresence>

        <PropertyListLayout
          properties={sortedProperties}
          viewMode={viewMode}
          onCardClick={(id) => navigate(`/property/${id}`)}
          onRemoveProperty={() => fetchProperties(searchQuery, filters)} // Re-fetch to update saved status if removed
          onAddNote={(id, note) => { /* SavedPropertyService handle note logic here if needed, or rely on PropertyCard internal update */ }}
        />
      </div>
    </div>
  );
};

export default BrowsePage;