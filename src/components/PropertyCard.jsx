import { useState } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import ApperIcon from './ApperIcon';
import SavedPropertyService from '../services/api/SavedPropertyService';

const PropertyCard = ({ 
  property, 
  layout = 'grid', 
  compact = false, 
  showMapPin = false, 
  showSavedDate = false,
  onRemove,
  onAddNote,
  initialNote = '',
  onClick 
}) => {
  const [isSaved, setIsSaved] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showNoteModal, setShowNoteModal] = useState(false);
  const [note, setNote] = useState(initialNote);

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

  const handleSaveProperty = async (e) => {
    e.stopPropagation();
    try {
      if (isSaved) {
        await SavedPropertyService.removeByPropertyId(property.id);
        setIsSaved(false);
        toast.success('Property removed from saved');
        if (onRemove) onRemove();
      } else {
        await SavedPropertyService.create({
          propertyId: property.id,
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

  const handleImageNavigation = (e, direction) => {
    e.stopPropagation();
    if (direction === 'next') {
      setCurrentImageIndex(prev => 
        prev === property.images.length - 1 ? 0 : prev + 1
      );
    } else {
      setCurrentImageIndex(prev => 
        prev === 0 ? property.images.length - 1 : prev - 1
      );
    }
  };

  const handleNoteSubmit = (e) => {
    e.preventDefault();
    if (onAddNote) {
      onAddNote(note);
    }
    setShowNoteModal(false);
  };

  if (layout === 'list' && !compact) {
    return (
      <motion.div
        whileHover={{ scale: 1.01 }}
        className="bg-white rounded-xl shadow-card hover:shadow-card-hover transition-all duration-200 overflow-hidden cursor-pointer"
        onClick={onClick}
      >
        <div className="flex">
          {/* Image */}
          <div className="relative w-64 h-48 flex-shrink-0">
            <img
              src={property.images[currentImageIndex]}
              alt={property.address}
              className="w-full h-full object-cover"
            />
            
            {/* Image Navigation */}
            {property.images.length > 1 && (
              <>
                <button
                  onClick={(e) => handleImageNavigation(e, 'prev')}
                  className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/90 p-1.5 rounded-full shadow-lg hover:bg-white transition-colors"
                >
                  <ApperIcon name="ChevronLeft" className="w-3 h-3" />
                </button>
                <button
                  onClick={(e) => handleImageNavigation(e, 'next')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/90 p-1.5 rounded-full shadow-lg hover:bg-white transition-colors"
                >
                  <ApperIcon name="ChevronRight" className="w-3 h-3" />
                </button>
              </>
            )}

            {/* Price Badge */}
            <div className="absolute bottom-2 left-2 bg-accent text-white px-3 py-1 rounded-lg font-semibold text-sm">
              {formatPrice(property.price)}
            </div>

            {/* Save Button */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleSaveProperty}
              className="absolute top-2 right-2 bg-white/90 p-2 rounded-full shadow-lg hover:bg-white transition-colors"
            >
              <ApperIcon
                name="Heart"
                className={`w-4 h-4 ${isSaved ? 'text-error fill-current' : 'text-gray-600'}`}
              />
            </motion.button>
          </div>

          {/* Details */}
          <div className="flex-1 p-4">
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-display font-semibold text-lg text-primary line-clamp-1">
                {property.address}
              </h3>
              {showMapPin && (
                <ApperIcon name="MapPin" className="w-4 h-4 text-accent flex-shrink-0 ml-2" />
              )}
            </div>
            
            <p className="text-gray-600 text-sm mb-3">
              {property.city}, {property.state} {property.zipCode}
            </p>

            <div className="flex flex-wrap gap-4 text-sm text-gray-700 mb-3">
              <div className="flex items-center space-x-1">
                <ApperIcon name="Bed" className="w-4 h-4" />
                <span>{property.bedrooms} bed</span>
              </div>
              <div className="flex items-center space-x-1">
                <ApperIcon name="Bath" className="w-4 h-4" />
                <span>{property.bathrooms} bath</span>
              </div>
              <div className="flex items-center space-x-1">
                <ApperIcon name="Square" className="w-4 h-4" />
                <span>{formatSquareFeet(property.squareFeet)} sq ft</span>
              </div>
            </div>

            <p className="text-gray-600 text-sm line-clamp-2">
              {property.description}
            </p>

            {showSavedDate && property.savedDate && (
              <div className="mt-3 pt-3 border-t">
                <p className="text-xs text-gray-500">
                  Saved {new Date(property.savedDate).toLocaleDateString()}
                </p>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      whileHover={{ scale: compact ? 1.01 : 1.02 }}
      className={`bg-white rounded-xl shadow-card hover:shadow-card-hover transition-all duration-200 overflow-hidden cursor-pointer ${
        compact ? 'max-w-sm' : ''
      }`}
      onClick={onClick}
    >
      {/* Image */}
      <div className={`relative ${compact ? 'h-32' : 'h-48'}`}>
        <img
          src={property.images[currentImageIndex]}
          alt={property.address}
          className="w-full h-full object-cover"
        />
        
        {/* Image Navigation */}
        {property.images.length > 1 && !compact && (
          <>
            <button
              onClick={(e) => handleImageNavigation(e, 'prev')}
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/90 p-1.5 rounded-full shadow-lg hover:bg-white transition-colors"
            >
              <ApperIcon name="ChevronLeft" className="w-3 h-3" />
            </button>
            <button
              onClick={(e) => handleImageNavigation(e, 'next')}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/90 p-1.5 rounded-full shadow-lg hover:bg-white transition-colors"
            >
              <ApperIcon name="ChevronRight" className="w-3 h-3" />
            </button>
          </>
        )}

        {/* Price Badge */}
        <div className={`absolute bottom-2 left-2 bg-accent text-white px-3 py-1 rounded-lg font-semibold ${
          compact ? 'text-xs' : 'text-sm'
        }`}>
          {formatPrice(property.price)}
        </div>

        {/* Save Button */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={handleSaveProperty}
          className="absolute top-2 right-2 bg-white/90 p-2 rounded-full shadow-lg hover:bg-white transition-colors"
        >
          <ApperIcon
            name="Heart"
            className={`w-4 h-4 ${isSaved ? 'text-error fill-current' : 'text-gray-600'}`}
          />
        </motion.button>

        {showMapPin && (
          <div className="absolute top-2 left-2">
            <ApperIcon name="MapPin" className="w-4 h-4 text-accent" />
          </div>
        )}

        {/* Image Dots */}
        {property.images.length > 1 && (
          <div className="absolute bottom-2 right-2 flex space-x-1">
            {property.images.map((_, index) => (
              <div
                key={index}
                className={`w-1.5 h-1.5 rounded-full ${
                  index === currentImageIndex ? 'bg-white' : 'bg-white/50'
                }`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Details */}
      <div className={`${compact ? 'p-3' : 'p-4'}`}>
        <div className="flex justify-between items-start mb-2">
          <h3 className={`font-display font-semibold text-primary line-clamp-1 ${
            compact ? 'text-sm' : 'text-lg'
          }`}>
            {property.address}
          </h3>
          {onRemove && (
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={(e) => {
                e.stopPropagation();
                onRemove();
              }}
              className="text-gray-400 hover:text-error transition-colors"
            >
              <ApperIcon name="X" className="w-4 h-4" />
            </motion.button>
          )}
        </div>
        
        <p className={`text-gray-600 mb-3 ${compact ? 'text-xs' : 'text-sm'}`}>
          {property.city}, {property.state} {property.zipCode}
        </p>

        <div className={`flex flex-wrap gap-3 text-gray-700 ${compact ? 'text-xs' : 'text-sm'}`}>
          <div className="flex items-center space-x-1">
            <ApperIcon name="Bed" className="w-4 h-4" />
            <span>{property.bedrooms} bed</span>
          </div>
          <div className="flex items-center space-x-1">
            <ApperIcon name="Bath" className="w-4 h-4" />
            <span>{property.bathrooms} bath</span>
          </div>
          <div className="flex items-center space-x-1">
            <ApperIcon name="Square" className="w-4 h-4" />
            <span>{formatSquareFeet(property.squareFeet)} sq ft</span>
          </div>
        </div>

        {showSavedDate && property.savedDate && (
          <div className="mt-3 pt-3 border-t flex justify-between items-center">
            <p className="text-xs text-gray-500">
              Saved {new Date(property.savedDate).toLocaleDateString()}
            </p>
            {onAddNote && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={(e) => {
                  e.stopPropagation();
                  setShowNoteModal(true);
                }}
                className="text-xs text-primary hover:text-secondary transition-colors"
              >
                {note ? 'Edit Note' : 'Add Note'}
              </motion.button>
            )}
          </div>
        )}

        {note && (
          <div className="mt-2 p-2 bg-surface rounded text-xs text-gray-600">
            {note}
          </div>
        )}
      </div>

      {/* Note Modal */}
      {showNoteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-lg p-6 max-w-md w-full"
          >
            <h3 className="text-lg font-semibold mb-4">Add Note</h3>
            <form onSubmit={handleNoteSubmit}>
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Add your thoughts about this property..."
                className="w-full h-24 p-3 border border-gray-200 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <div className="flex space-x-3 mt-4">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  type="submit"
                  className="flex-1 bg-primary text-white py-2 rounded-lg font-medium"
                >
                  Save Note
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  type="button"
                  onClick={() => setShowNoteModal(false)}
                  className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-lg font-medium"
                >
                  Cancel
                </motion.button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
};

export default PropertyCard;