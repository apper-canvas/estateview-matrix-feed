import ApperIcon from '@/components/ApperIcon';
import Text from '@/components/atoms/Text';

const PropertyMetric = ({ iconName, value, label, className = '' }) => {
  return (
    <div className={`flex items-center space-x-1 ${className}`}>
      <ApperIcon name={iconName} className="w-4 h-4" />
      <Text as="span">{value} {label}</Text>
    </div>
  );
};

export default PropertyMetric;