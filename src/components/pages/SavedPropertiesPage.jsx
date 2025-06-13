import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import SavedPropertyService from '@/services/api/SavedPropertyService';
import PropertyService from '@/services/api/PropertyService';
import PropertyListLayout from '@/components/organisms/PropertyListLayout';
import EmptyErrorLoadingState from '@/components/organisms/EmptyErrorLoadingState';
import Text from '@/components/atoms/Text';

const SavedPropertiesPage = () => {
  const [savedProperties, setSavedProperties] = useState([]);
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

const loadSavedProperties = async () => {
    setLoading(true);
    setError(null);
    try {
      const savedResult = await SavedPropertyService.getAll();
      const allProperties = await PropertyService.getAll();
      
      const matchedProperties = savedResult.map(saved => {
        const property = allProperties.find(p => p.Id.toString() === saved.property_id.toString());
        return property ? { ...property, saved_date: saved.saved_date, notes: saved.notes } : null;
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

  useEffect(() => {
    loadSavedProperties();
  }, []);

const handleRemoveProperty = async (propertyId) => {
    try {
      await SavedPropertyService.removeByPropertyId(propertyId);
      setSavedProperties(prev => prev.filter(sp => sp.property_id.toString() !== propertyId.toString()));
      setProperties(prev => prev.filter(p => p.Id.toString() !== propertyId.toString()));
      toast.success('Property removed from saved');
    } catch (err) {
      toast.error('Failed to remove property');
    }
  };

const handleAddNote = async (propertyId, note) => {
    try {
      const savedProperty = savedProperties.find(sp => sp.property_id.toString() === propertyId.toString());
      if (savedProperty) {
        await SavedPropertyService.update(savedProperty.Id, { ...savedProperty, notes: note });
        setSavedProperties(prev => 
          prev.map(sp => sp.property_id.toString() === propertyId.toString() ? { ...sp, notes: note } : sp)
        );
        setProperties(prev => 
          prev.map(p => p.Id.toString() === propertyId.toString() ? { ...p, notes: note } : p)
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
          <EmptyErrorLoadingState type="loading" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-soft-white px-4">
        <EmptyErrorLoadingState 
          type="error"
          icon="AlertCircle"
          title="Failed to Load"
          message={error}
          onAction={() => window.location.reload()}
          actionText="Try Again"
        />
      </div>
    );
  }

  if (properties.length === 0) {
    return (
      <div className="min-h-screen bg-soft-white">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="mb-8">
            <Text as="h1" className="text-3xl font-display font-bold text-primary mb-2">
              Saved Properties
            </Text>
            <Text as="p" className="text-gray-600">
              Your favorite properties in one place
            </Text>
          </div>
          <EmptyErrorLoadingState 
            type="empty"
            icon="Heart"
            title="No Saved Properties Yet"
            message="Start exploring properties and save your favorites to keep track of homes you love."
            onAction={() => window.location.href = '/browse'}
            actionText="Browse Properties"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-soft-white">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Text as="h1" className="text-3xl font-display font-bold text-primary mb-2">
            Saved Properties
          </Text>
          <Text as="p" className="text-gray-600">
            {properties.length} {properties.length === 1 ? 'property' : 'properties'} saved
          </Text>
        </div>

        {/* Properties Grid */}
        <PropertyListLayout
          properties={properties}
          viewMode="grid" // Saved properties typically shown in a grid
onCardClick={(id) => window.location.href = `/property/${id}`} // Direct navigation
          showSavedDate={true}
          onRemoveProperty={handleRemoveProperty}
          onAddNote={handleAddNote}
        />
      </div>
    </div>
  );
};

export default SavedPropertiesPage;