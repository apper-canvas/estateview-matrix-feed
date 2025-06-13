import { motion } from 'framer-motion';
import PropertyCard from '@/components/organisms/PropertyCard';
import EmptyErrorLoadingState from '@/components/organisms/EmptyErrorLoadingState';

const PropertyListLayout = ({ properties, viewMode, onCardClick, onRemoveProperty, onAddNote, showSavedDate = false }) => {
  if (properties.length === 0) {
    return (
      <EmptyErrorLoadingState 
        type="empty"
        icon="Search"
        title="No Properties Found"
        message="We couldn't find any properties matching your criteria. Try adjusting your filters or search terms."
        onAction={() => { /* clear filters logic goes here */ }}
        actionText="Clear All Filters"
      />
    );
  }

  const layoutClass = viewMode === 'grid' 
    ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
    : 'space-y-6';

  return (
    <div className={layoutClass}>
      {properties.map((property, index) => (
        <motion.div
          key={property.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className={viewMode === 'list' ? 'max-w-3xl mx-auto w-full' : ''}
        >
          <PropertyCard 
            property={property} 
            layout={viewMode}
onClick={() => onCardClick(property.Id)}
            showSavedDate={showSavedDate}
            onRemove={onRemoveProperty}
            onAddNote={onAddNote}
            initialNote={property.notes}
          />
        </motion.div>
      ))}
    </div>
  );
};

export default PropertyListLayout;