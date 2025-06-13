import { useState } from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';

const ImageCarousel = ({ images, altText, compact = false, showControls = true }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const handleImageNavigation = (e, direction) => {
    e.stopPropagation();
    if (direction === 'next') {
      setCurrentImageIndex(prev => 
        prev === images.length - 1 ? 0 : prev + 1
      );
    } else {
      setCurrentImageIndex(prev => 
        prev === 0 ? images.length - 1 : prev - 1
      );
    }
  };

  return (
    <div className={`relative ${compact ? 'h-32' : 'h-48'}`}>
      <img
        src={images[currentImageIndex]}
        alt={altText}
        className="w-full h-full object-cover"
      />
      
      {showControls && images.length > 1 && (
        <>
          <Button
            onClick={(e) => handleImageNavigation(e, 'prev')}
            className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/90 p-1.5 rounded-full shadow-lg hover:bg-white transition-colors !px-0 !py-0"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <ApperIcon name="ChevronLeft" className="w-3 h-3" />
          </Button>
          <Button
            onClick={(e) => handleImageNavigation(e, 'next')}
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/90 p-1.5 rounded-full shadow-lg hover:bg-white transition-colors !px-0 !py-0"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <ApperIcon name="ChevronRight" className="w-3 h-3" />
          </Button>
        </>
      )}

      {images.length > 1 && (
        <div className="absolute bottom-2 right-2 flex space-x-1">
          {images.map((_, index) => (
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
  );
};

export default ImageCarousel;