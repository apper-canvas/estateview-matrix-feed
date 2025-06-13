import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import SavedPropertyService from '../services/api/SavedPropertyService';
import PropertyService from '../services/api/PropertyService';
import PropertyCard from '../components/PropertyCard';
import ApperIcon from '../components/ApperIcon';

const SavedProperties = () => {
  const [savedProperties, setSavedProperties] = useState([]);
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadSavedProperties = async () => {
      setLoading(true);
      setError(null);
      try {
        const savedResult = await SavedPropertyService.getAll();
        const allProperties = await PropertyService.getAll();
        
        // Match saved properties with full property data
        const matchedProperties = savedResult.map(saved => {
          const property = allProperties.find(p => p.id === saved.propertyId);
          return property ? { ...property, savedDate: saved.savedDate, notes: saved.notes } : null;
        }).filter(Boolean);
        
        setSavedProperties(savedResult);
        setProperties(matchedProperties);
      } catch (err) {
        setError(err.message || 'Failed to load saved properties');
        toast.error('Failed to load saved properties');
      } finally {
        setLoading(false);
      }
    };
    loadSavedProperties();
  }, []);

  const handleRemoveProperty = async (propertyId) => {
    try {
      await SavedPropertyService.removeByPropertyId(propertyId);
      setSavedProperties(prev => prev.filter(sp => sp.propertyId !== propertyId));
      setProperties(prev => prev.filter(p => p.id !== propertyId));
      toast.success('Property removed from saved');
    } catch (err) {
      toast.error('Failed to remove property');
    }
  };

  const handleAddNote = async (propertyId, note) => {
    try {
      const savedProperty = savedProperties.find(sp => sp.propertyId === propertyId);
      if (savedProperty) {
        await SavedPropertyService.update(savedProperty.id, { ...savedProperty, notes: note });
        setSavedProperties(prev => 
          prev.map(sp => sp.propertyId === propertyId ? { ...sp, notes: note } : sp)
        );
        setProperties(prev => 
          prev.map(p => p.id === propertyId ? { ...p, notes: note } : p)
        );
        toast.success('Note updated');
      }
    } catch (err) {
      toast.error('Failed to update note');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-soft-white">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="mb-8">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-2 animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded w-1/3 animate-pulse"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white rounded-xl shadow-card overflow-hidden animate-pulse">
                <div className="h-48 bg-gray-200"></div>
                <div className="p-4 space-y-3">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                </div>
              </div>
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
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Failed to Load</h2>
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

  if (properties.length === 0) {
    return (
      <div className="min-h-screen bg-soft-white">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-display font-bold text-primary mb-2">
              Saved Properties
            </h1>
            <p className="text-gray-600">
              Your favorite properties in one place
            </p>
          </div>

          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-center py-16"
          >
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ repeat: Infinity, duration: 3 }}
            >
              <ApperIcon name="Heart" className="w-24 h-24 text-gray-300 mx-auto mb-6" />
            </motion.div>
            <h3 className="text-2xl font-display font-semibold text-gray-900 mb-4">
              No Saved Properties Yet
            </h3>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              Start exploring properties and save your favorites to keep track of homes you love.
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => window.location.href = '/browse'}
              className="bg-accent text-white px-8 py-3 rounded-lg font-medium hover:shadow-lg transition-all duration-200"
            >
              Browse Properties
            </motion.button>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-soft-white">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-display font-bold text-primary mb-2">
            Saved Properties
          </h1>
          <p className="text-gray-600">
            {properties.length} {properties.length === 1 ? 'property' : 'properties'} saved
          </p>
        </div>

        {/* Properties Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {properties.map((property, index) => (
            <motion.div
              key={property.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="relative"
            >
              <PropertyCard 
                property={property} 
                showSavedDate={true}
                onRemove={() => handleRemoveProperty(property.id)}
                onAddNote={(note) => handleAddNote(property.id, note)}
                initialNote={property.notes}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SavedProperties;