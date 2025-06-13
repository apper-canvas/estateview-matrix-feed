import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import PropertyService from '@/services/api/PropertyService';
import ApperIcon from '@/components/ApperIcon';
import PropertyCard from '@/components/organisms/PropertyCard';
import EmptyErrorLoadingState from '@/components/organisms/EmptyErrorLoadingState';
import Button from '@/components/atoms/Button';
import PriceDisplay from '@/components/molecules/PriceDisplay';

const MapViewPage = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [mapCenter, setMapCenter] = useState({ lat: 40.7128, lng: -74.0060 }); // Default NYC
  const [showSidebar, setShowSidebar] = useState(true);

  useEffect(() => {
    const loadProperties = async () => {
      setLoading(true);
      setError(null);
      try {
        const result = await PropertyService.getAll();
        setProperties(result);
        
        if (result.length > 0 && result[0].coordinates) {
          setMapCenter(result[0].coordinates);
        }
      } catch (err) {
        setError(err.message || 'Failed to load properties');
        toast.error('Failed to load properties');
      } finally {
        setLoading(false);
      }
    };
    loadProperties();
  }, []);

  if (loading) {
    return (
      <div className="h-screen flex">
        <div className="flex-1 bg-gray-200 animate-pulse"></div>
        <div className="w-96 bg-white p-4 space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-32 bg-gray-200 rounded-lg animate-pulse"></div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-screen flex items-center justify-center bg-soft-white px-4">
        <EmptyErrorLoadingState 
          type="error"
          icon="AlertCircle"
          title="Map Loading Error"
          message={error}
          onAction={() => window.location.reload()}
          actionText="Retry"
        />
      </div>
    );
  }

  return (
    <div className="h-screen flex overflow-hidden">
      {/* Map Container */}
      <div className="flex-1 relative">
        {/* Mock Map Background */}
        <div 
          className="w-full h-full bg-gradient-to-br from-blue-100 to-green-100 relative overflow-hidden"
          style={{
            backgroundImage: `
              radial-gradient(circle at 25% 25%, rgba(44, 85, 48, 0.1) 0%, transparent 50%),
              radial-gradient(circle at 75% 75%, rgba(139, 115, 85, 0.1) 0%, transparent 50%),
              linear-gradient(45deg, rgba(212, 175, 55, 0.05) 0%, transparent 100%)
            `
          }}
        >
          {/* Mock Map Grid */}
          <div className="absolute inset-0">
            {[...Array(20)].map((_, i) => (
              <div
                key={`v-${i}`}
                className="absolute w-px bg-gray-300/30 h-full"
                style={{ left: `${i * 5}%` }}
              />
            ))}
            {[...Array(20)].map((_, i) => (
              <div
                key={`h-${i}`}
                className="absolute h-px bg-gray-300/30 w-full"
                style={{ top: `${i * 5}%` }}
              />
            ))}
          </div>

          {/* Property Markers */}
          {properties.map((property, index) => (
            <motion.div
              key={property.id}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: index * 0.1 }}
              className={`absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer ${
                selectedProperty?.id === property.id ? 'z-30' : 'z-20'
              }`}
              style={{
                left: `${30 + (index % 5) * 15}%`,
                top: `${20 + Math.floor(index / 5) * 20}%`
              }}
              onClick={() => setSelectedProperty(property)}
            >
              <Button
                className={`bg-accent text-white px-3 py-2 rounded-lg shadow-lg text-sm font-medium min-w-max !px-3 !py-2 !shadow-lg ${
                  selectedProperty?.id === property.id ? 'ring-2 ring-primary' : ''
                }`}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <PriceDisplay price={property.price} />
              </Button>
              <div className="w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-accent mx-auto"></div>
            </motion.div>
          ))}

          {/* Map Controls */}
          <div className="absolute top-4 left-4 flex flex-col space-y-2">
            <Button
              onClick={() => setShowSidebar(!showSidebar)}
              className="bg-white p-3 rounded-lg shadow-lg hover:shadow-xl !px-0 !py-0"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <ApperIcon name={showSidebar ? "PanelRightClose" : "PanelRightOpen"} className="w-5 h-5" />
            </Button>
            
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <Button
                className="block w-full p-3 hover:bg-gray-50 !px-0 !py-0 !bg-transparent"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <ApperIcon name="Plus" className="w-5 h-5" />
              </Button>
              <Button
                className="block w-full p-3 hover:bg-gray-50 border-t !px-0 !py-0 !bg-transparent"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <ApperIcon name="Minus" className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Sidebar */}
      <motion.div
        initial={false}
        animate={{ x: showSidebar ? 0 : '100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className="w-96 bg-white shadow-xl overflow-hidden flex flex-col"
      >
        {/* Sidebar Header */}
        <div className="p-4 border-b bg-surface">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-display font-semibold text-primary">
              Properties ({properties.length})
            </h2>
            <Button
              onClick={() => setShowSidebar(false)}
              className="p-2 hover:bg-white rounded-lg md:hidden !px-0 !py-0 !bg-transparent"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <ApperIcon name="X" className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Property List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {properties.length === 0 ? (
            <EmptyErrorLoadingState 
              type="empty"
              icon="MapPin"
              title="No Properties Found"
              message="Try adjusting your search criteria"
            />
          ) : (
            properties.map((property, index) => (
              <motion.div
                key={property.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                onClick={() => setSelectedProperty(property)}
                className={`cursor-pointer transition-all duration-200 ${
                  selectedProperty?.id === property.id 
                    ? 'ring-2 ring-primary rounded-lg' 
                    : ''
                }`}
              >
                <PropertyCard 
                  property={property} 
                  compact={true}
                  showMapPin={true}
                />
              </motion.div>
            ))
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default MapViewPage;