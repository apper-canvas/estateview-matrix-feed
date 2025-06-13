import ApperIcon from '@/components/ApperIcon';
import Text from '@/components/atoms/Text';

const PropertyDetailsSection = ({ title, content, type = 'paragraph', items = [] }) => {
  return (
    <div className="mb-8">
      <Text as="h2" className="text-2xl font-display font-semibold text-primary mb-4">
        {title}
      </Text>
      {type === 'paragraph' && (
        <Text className="text-gray-700 leading-relaxed whitespace-pre-line">
          {content}
        </Text>
      )}
      {type === 'features' && items.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {items.map((item, index) => (
            <div key={index} className="flex items-center space-x-2">
              <ApperIcon name="Check" className="w-4 h-4 text-success" />
              <Text className="text-gray-700">{item}</Text>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PropertyDetailsSection;