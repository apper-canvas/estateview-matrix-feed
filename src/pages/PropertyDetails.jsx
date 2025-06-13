import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import PropertyService from '../services/api/PropertyService';
import SavedPropertyService from '../services/api/SavedPropertyService';
import ApperIcon from '../components/ApperIcon';

const PropertyDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSaved, setIsSaved] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const loadProperty = async () => {
      setLoading(true);
      setError(null);
      try {
        const result = await PropertyService.getById(id);
        if (!result) {
          navigate('/not-found');
          return;
        }
        setProperty(result);
        
        // Check if property is saved
        const savedProperties = await SavedPropertyService.getAll();
        setIsSaved(savedProperties.some(sp => sp.propertyId === id));
      } catch (err) {
        setError(err.message || 'Failed to load property');
        toast.error('Failed to load property');
      } finally {
        setLoading(false);
      }
    };
    loadProperty();
  }, [id, navigate]);

  const handleSaveProperty = async () => {
    try {
      if (isSaved) {
        await SavedPropertyService.removeByPropertyId(id);
        setIsSaved(false);
        toast.success('Property removed from saved');
      } else {
        await SavedPropertyService.create({
          propertyId: id,
          savedDate: new Date().toISOString(),
          notes: ''
        });
        setIsSaved(true);
        toast.success('Property saved!');
      }
    } catch (err) {
      toast.error('Failed to update saved properties');
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const formatSquareFeet = (sqft) => {
    return new Intl.NumberFormat('en-US').format(sqft);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-soft-white">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="animate-pulse space-y-8">
            <div className="h-8 bg-gray-200 rounded w-1/4"></div>
            <div className="h-96 bg-gray-200 rounded-lg"></div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-6">
                <div className="h-8 bg-gray-200 rounded w-3/4"></div>
                <div className="space-y-3">
                  <div className="h-4 bg-gray-200 rounded"></div>
                  <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                  <div className="h-4 bg-gray-200 rounded w-4/6"></div>
                </div>
              </div>
              <div className="space-y-4">
                <div className="h-32 bg-gray-200 rounded-lg"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !property) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-soft-white px-4">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center"
        >
          <ApperIcon name="AlertCircle" className="w-16 h-16 text-error mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Property Not Found</h2>
          <p className="text-gray-600 mb-6">The property you're looking for doesn't exist.</p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/browse')}
            className="bg-primary text-white px-6 py-3 rounded-lg font-medium"
          >
            Back to Browse
          </motion.button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-soft-white pb-8">
      {/* Back Button */}
      <div className="bg-white border-b">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate(-1)}
            className="flex items-center space-x-2 text-gray-600 hover:text-primary transition-colors"
          >
            <ApperIcon name="ArrowLeft" className="w-5 h-5" />
            <span>Back to Results</span>
          </motion.button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Image Gallery */}
        <div className="mb-8">
          <div className="relative h-96 md:h-[500px] rounded-xl overflow-hidden mb-4">
            <img
              src={property.images[currentImageIndex]}
              alt={`${property.address} - Image ${currentImageIndex + 1}`}
              className="w-full h-full object-cover"
            />
            
            {/* Image Navigation */}
            {property.images.length > 1 && (
              <>
                <button
                  onClick={() => setCurrentImageIndex(prev => 
                    prev === 0 ? property.images.length - 1 : prev - 1
                  )}
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 p-2 rounded-full shadow-lg hover:bg-white transition-colors"
                >
                  <ApperIcon name="ChevronLeft" className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setCurrentImageIndex(prev => 
                    prev === property.images.length - 1 ? 0 : prev + 1
                  )}
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 p-2 rounded-full shadow-lg hover:bg-white transition-colors"
                >
                  <ApperIcon name="ChevronRight" className="w-5 h-5" />
                </button>
              </>
            )}

            {/* Save Button */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleSaveProperty}
              className="absolute top-4 right-4 bg-white/90 p-3 rounded-full shadow-lg hover:bg-white transition-colors"
            >
              <ApperIcon
                name="Heart"
                className={`w-6 h-6 ${isSaved ? 'text-error fill-current' : 'text-gray-600'}`}
              />
            </motion.button>
          </div>

          {/* Thumbnail Strip */}
          {property.images.length > 1 && (
            <div className="flex space-x-2 overflow-x-auto pb-2">
              {property.images.map((image, index) => (
                <motion.button
                  key={index}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`flex-shrink-0 w-20 h-16 rounded-lg overflow-hidden border-2 transition-colors ${
                    index === currentImageIndex ? 'border-primary' : 'border-transparent'
                  }`}
                >
                  <img
                    src={image}
                    alt={`Thumbnail ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </motion.button>
              ))}
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Property Header */}
            <div className="mb-6">
              <h1 className="text-3xl md:text-4xl font-display font-bold text-primary mb-2">
                {property.address}
              </h1>
              <p className="text-lg text-gray-600 mb-4">
                {property.city}, {property.state} {property.zipCode}
              </p>
              <div className="text-3xl font-bold text-accent mb-4">
                {formatPrice(property.price)}
              </div>
              
              {/* Key Stats */}
              <div className="flex flex-wrap gap-6 text-gray-700">
                <div className="flex items-center space-x-2">
                  <ApperIcon name="Bed" className="w-5 h-5" />
                  <span>{property.bedrooms} {property.bedrooms === 1 ? 'Bedroom' : 'Bedrooms'}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <ApperIcon name="Bath" className="w-5 h-5" />
                  <span>{property.bathrooms} {property.bathrooms === 1 ? 'Bathroom' : 'Bathrooms'}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <ApperIcon name="Square" className="w-5 h-5" />
                  <span>{formatSquareFeet(property.squareFeet)} sq ft</span>
                </div>
                <div className="flex items-center space-x-2">
                  <ApperIcon name="Calendar" className="w-5 h-5" />
                  <span>Built {property.yearBuilt}</span>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="mb-8">
              <h2 className="text-2xl font-display font-semibold text-primary mb-4">
                About This Property
              </h2>
              <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                {property.description}
              </p>
            </div>

            {/* Features */}
            {property.features && property.features.length > 0 && (
              <div className="mb-8">
                <h2 className="text-2xl font-display font-semibold text-primary mb-4">
                  Features & Amenities
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {property.features.map((feature, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <ApperIcon name="Check" className="w-4 h-4 text-success" />
                      <span className="text-gray-700">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-card p-6 sticky top-24">
              <h3 className="text-xl font-display font-semibold text-primary mb-4">
                Property Details
              </h3>
              
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Property Type</span>
                  <span className="font-medium">{property.propertyType}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Year Built</span>
                  <span className="font-medium">{property.yearBuilt}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Square Feet</span>
                  <span className="font-medium">{formatSquareFeet(property.squareFeet)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Status</span>
                  <span className={`font-medium px-2 py-1 rounded text-sm ${
                    property.status === 'For Sale' 
                      ? 'bg-success/10 text-success'
                      : 'bg-warning/10 text-warning'
                  }`}>
                    {property.status}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Listed</span>
                  <span className="font-medium">
                    {new Date(property.listingDate).toLocaleDateString()}
                  </span>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full bg-accent text-white py-3 rounded-lg font-medium hover:shadow-lg transition-all duration-200 mb-3"
                >
                  Schedule Viewing
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full bg-primary text-white py-3 rounded-lg font-medium hover:shadow-lg transition-all duration-200"
                >
                  Contact Agent
                </motion.button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyDetails;