import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import ApperIcon from '@/components/ApperIcon';
import SavedPropertyService from '@/services/api/SavedPropertyService';
import ImageCarousel from '@/components/molecules/ImageCarousel';
import PriceDisplay from '@/components/molecules/PriceDisplay';
import PropertyMetric from '@/components/molecules/PropertyMetric';
import NoteModal from '@/components/molecules/NoteModal';
import Button from '@/components/atoms/Button';
import Text from '@/components/atoms/Text';

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
  const [showNoteModal, setShowNoteModal] = useState(false);
  const [note, setNote] = useState(initialNote);

  useEffect(() => {
    const checkSavedStatus = async () => {
      try {
        const savedProperties = await SavedPropertyService.getAll();
        setIsSaved(savedProperties.some(sp => sp.propertyId === property.id));
      } catch (err) {
        console.error("Failed to check saved status:", err);
      }
    };
    checkSavedStatus();
  }, [property.id]);

  useEffect(() => {
    setNote(initialNote);
  }, [initialNote]);

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

  const handleNoteSubmit = (submittedNote) => {
    setNote(submittedNote);
    if (onAddNote) {
      onAddNote(submittedNote);
    }
  };

  const cardBaseClass = "bg-white rounded-xl shadow-card hover:shadow-card-hover transition-all duration-200 overflow-hidden cursor-pointer";
  
  if (layout === 'list' && !compact) {
    return (
      <motion.div
        whileHover={{ scale: 1.01 }}
        className={`${cardBaseClass}`}
        onClick={onClick}
      >
        <div className="flex">
          {/* Image */}
          <div className="relative w-64 h-48 flex-shrink-0">
            <ImageCarousel 
              images={property.images} 
              altText={property.address} 
              compact={compact}
              showControls={true}
            />
            
            {/* Price Badge */}
            <div className="absolute bottom-2 left-2 bg-accent text-white px-3 py-1 rounded-lg font-semibold text-sm">
              <PriceDisplay price={property.price} />
            </div>

            {/* Save Button */}
            <Button
              onClick={handleSaveProperty}
              className="absolute top-2 right-2 bg-white/90 p-2 rounded-full shadow-lg hover:bg-white !px-0 !py-0"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <ApperIcon
                name="Heart"
                className={`w-4 h-4 ${isSaved ? 'text-error fill-current' : 'text-gray-600'}`}
              />
            </Button>
          </div>

          {/* Details */}
          <div className="flex-1 p-4">
            <div className="flex justify-between items-start mb-2">
              <Text as="h3" className="font-display font-semibold text-lg text-primary line-clamp-1">
                {property.address}
              </Text>
              {showMapPin && (
                <ApperIcon name="MapPin" className="w-4 h-4 text-accent flex-shrink-0 ml-2" />
              )}
            </div>
            
            <Text className="text-gray-600 text-sm mb-3">
              {property.city}, {property.state} {property.zipCode}
            </Text>

            <div className="flex flex-wrap gap-4 text-sm text-gray-700 mb-3">
              <PropertyMetric iconName="Bed" value={property.bedrooms} label="bed" />
              <PropertyMetric iconName="Bath" value={property.bathrooms} label="bath" />
              <PropertyMetric iconName="Square" value={formatSquareFeet(property.squareFeet)} label="sq ft" />
            </div>

            <Text className="text-gray-600 text-sm line-clamp-2">
              {property.description}
            </Text>

            {showSavedDate && property.savedDate && (
              <div className="mt-3 pt-3 border-t">
                <Text className="text-xs text-gray-500">
                  Saved {new Date(property.savedDate).toLocaleDateString()}
                </Text>
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
      className={`${cardBaseClass} ${compact ? 'max-w-sm' : ''}`}
      onClick={onClick}
    >
      {/* Image */}
      <div className={`relative ${compact ? 'h-32' : 'h-48'}`}>
        <ImageCarousel 
          images={property.images} 
          altText={property.address} 
          compact={compact}
          showControls={!compact} // Don't show controls in compact grid
        />
        
        {/* Price Badge */}
        <div className={`absolute bottom-2 left-2 bg-accent text-white px-3 py-1 rounded-lg font-semibold ${
          compact ? 'text-xs' : 'text-sm'
        }`}>
          <PriceDisplay price={property.price} />
        </div>

        {/* Save Button */}
        <Button
          onClick={handleSaveProperty}
          className="absolute top-2 right-2 bg-white/90 p-2 rounded-full shadow-lg hover:bg-white !px-0 !py-0"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <ApperIcon
            name="Heart"
            className={`w-4 h-4 ${isSaved ? 'text-error fill-current' : 'text-gray-600'}`}
          />
        </Button>

        {showMapPin && (
          <div className="absolute top-2 left-2">
            <ApperIcon name="MapPin" className="w-4 h-4 text-accent" />
          </div>
        )}
      </div>

      {/* Details */}
      <div className={`${compact ? 'p-3' : 'p-4'}`}>
        <div className="flex justify-between items-start mb-2">
          <Text as="h3" className={`font-display font-semibold text-primary line-clamp-1 ${
            compact ? 'text-sm' : 'text-lg'
          }`}>
            {property.address}
          </Text>
          {onRemove && (
            <Button
              onClick={(e) => {
                e.stopPropagation();
                onRemove();
              }}
              className="text-gray-400 hover:text-error !bg-transparent !shadow-none !p-0 !py-0"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <ApperIcon name="X" className="w-4 h-4" />
            </Button>
          )}
        </div>
        
        <Text className={`text-gray-600 mb-3 ${compact ? 'text-xs' : 'text-sm'}`}>
          {property.city}, {property.state} {property.zipCode}
        </Text>

        <div className={`flex flex-wrap gap-3 text-gray-700 ${compact ? 'text-xs' : 'text-sm'}`}>
          <PropertyMetric iconName="Bed" value={property.bedrooms} label="bed" />
          <PropertyMetric iconName="Bath" value={property.bathrooms} label="bath" />
          <PropertyMetric iconName="Square" value={formatSquareFeet(property.squareFeet)} label="sq ft" />
        </div>

        {showSavedDate && property.savedDate && (
          <div className="mt-3 pt-3 border-t flex justify-between items-center">
            <Text className="text-xs text-gray-500">
              Saved {new Date(property.savedDate).toLocaleDateString()}
            </Text>
            {onAddNote && (
              <Button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowNoteModal(true);
                }}
                className="text-xs text-primary hover:text-secondary !bg-transparent !shadow-none !px-0 !py-0"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {note ? 'Edit Note' : 'Add Note'}
              </Button>
            )}
          </div>
        )}

        {note && (
          <Text className="mt-2 p-2 bg-surface rounded text-xs text-gray-600">
            {note}
          </Text>
        )}
      </div>

      <NoteModal
        isOpen={showNoteModal}
        onClose={() => setShowNoteModal(false)}
        onSubmit={handleNoteSubmit}
        initialNote={note}
      />
    </motion.div>
  );
};

export default PropertyCard;