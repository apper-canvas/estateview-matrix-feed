import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import PropertyService from '@/services/api/PropertyService';
import SavedPropertyService from '@/services/api/SavedPropertyService';
import ApperIcon from '@/components/ApperIcon';
import ImageCarousel from '@/components/molecules/ImageCarousel';
import PriceDisplay from '@/components/molecules/PriceDisplay';
import PropertyMetric from '@/components/molecules/PropertyMetric';
import PropertyDetailsSection from '@/components/organisms/PropertyDetailsSection';
import PropertyInfoBlock from '@/components/organisms/PropertyInfoBlock';
import EmptyErrorLoadingState from '@/components/organisms/EmptyErrorLoadingState';
import Button from '@/components/atoms/Button';
import Text from '@/components/atoms/Text';

const PropertyDetailsPage = () => {
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
        
        const savedProperties = await SavedPropertyService.getAll();
        setIsSaved(savedProperties.some(sp => sp.property_id.toString() === id));
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
          property_id: id,
          saved_date: new Date().toISOString(),
          notes: ''
        });
        setIsSaved(true);
        toast.success('Property saved!');
      }
    } catch (err) {
      toast.error('Failed to update saved properties');
    }
  };

  const formatSquareFeet = (sqft) => {
    return new Intl.NumberFormat('en-US').format(sqft);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-soft-white">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <EmptyErrorLoadingState type="loading" />
        </div>
      </div>
    );
  }

  if (error || !property) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-soft-white px-4">
        <EmptyErrorLoadingState 
          type="error"
          icon="AlertCircle"
          title="Property Not Found"
          message="The property you're looking for doesn't exist."
          onAction={() => navigate('/browse')}
          actionText="Back to Browse"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-soft-white pb-8">
      {/* Back Button */}
      <div className="bg-white border-b">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <Button
            onClick={() => navigate(-1)}
            className="flex items-center space-x-2 text-gray-600 hover:text-primary !bg-transparent !shadow-none"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <ApperIcon name="ArrowLeft" className="w-5 h-5" />
            <Text as="span">Back to Results</Text>
          </Button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Image Gallery */}
        <div className="mb-8">
          <div className="relative h-96 md:h-[500px] rounded-xl overflow-hidden mb-4">
            <ImageCarousel 
              images={property.images} 
              altText={`${property.address} - Image ${currentImageIndex + 1}`} 
              showControls={property.images.length > 1}
            />
            
            <Button
              onClick={handleSaveProperty}
              className="absolute top-4 right-4 bg-white/90 p-3 rounded-full shadow-lg hover:bg-white !px-0 !py-0"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <ApperIcon
                name="Heart"
                className={`w-6 h-6 ${isSaved ? 'text-error fill-current' : 'text-gray-600'}`}
              />
            </Button>
          </div>

          {property.images.length > 1 && (
            <div className="flex space-x-2 overflow-x-auto pb-2">
              {property.images.map((image, index) => (
                <Button
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`flex-shrink-0 w-20 h-16 rounded-lg overflow-hidden border-2 !p-0 !bg-transparent !shadow-none ${
                    index === currentImageIndex ? 'border-primary' : 'border-transparent'
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <img
                    src={image}
                    alt={`Thumbnail ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </Button>
              ))}
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Property Header */}
            <div className="mb-6">
<Text as="h1" className="text-3xl md:text-4xl font-display font-bold text-primary mb-2">
                {property.address}
              </Text>
              <Text as="p" className="text-lg text-gray-600 mb-4">
                {property.city}, {property.state} {property.zip_code}
              </Text>
              <Text as="div" className="text-3xl font-bold text-accent mb-4">
                <PriceDisplay price={property.price} />
              </Text>
              
              {/* Key Stats */}
              <div className="flex flex-wrap gap-6 text-gray-700">
                <PropertyMetric iconName="Bed" value={property.bedrooms} label={property.bedrooms === 1 ? 'Bedroom' : 'Bedrooms'} />
                <PropertyMetric iconName="Bath" value={property.bathrooms} label={property.bathrooms === 1 ? 'Bathroom' : 'Bathrooms'} />
                <PropertyMetric iconName="Square" value={formatSquareFeet(property.square_feet)} label="sq ft" />
                <PropertyMetric iconName="Calendar" value={property.year_built} label="Built" />
              </div>
            </div>

            <PropertyDetailsSection 
              title="About This Property" 
              content={property.description} 
              type="paragraph" 
            />

            {property.features && property.features.length > 0 && (
              <PropertyDetailsSection 
                title="Features & Amenities" 
                items={property.features} 
                type="features" 
              />
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <PropertyInfoBlock 
              title="Property Details"
details={[
                { label: 'Property Type', value: property.property_type },
                { label: 'Year Built', value: property.year_built },
                { label: 'Square Feet', value: formatSquareFeet(property.square_feet) },
                { label: 'Status', value: property.status, type: 'status' },
                { label: 'Listed', value: new Date(property.listing_date).toLocaleDateString() },
              ]}
              ctaButtons={[
                { label: 'Schedule Viewing', onClick: () => {}, className: 'bg-accent text-white' },
                { label: 'Contact Agent', onClick: () => {}, className: 'bg-primary text-white' },
              ]}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyDetailsPage;