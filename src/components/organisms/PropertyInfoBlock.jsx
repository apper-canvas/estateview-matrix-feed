import Button from '@/components/atoms/Button';
import Text from '@/components/atoms/Text';
import StatusBadge from '@/components/molecules/StatusBadge';

const PropertyInfoBlock = ({ title, details, ctaButtons }) => {
  return (
    <div className="bg-white rounded-xl shadow-card p-6 sticky top-24">
      <Text as="h3" className="text-xl font-display font-semibold text-primary mb-4">
        {title}
      </Text>
      
      <div className="space-y-4">
        {details.map((detail, index) => (
          <div key={index} className="flex justify-between">
            <Text className="text-gray-600">{detail.label}</Text>
            {detail.type === 'status' ? (
              <StatusBadge status={detail.value} />
            ) : (
              <Text className="font-medium">{detail.value}</Text>
            )}
          </div>
        ))}
      </div>

      {ctaButtons && ctaButtons.length > 0 && (
        <div className="mt-6 pt-6 border-t">
          {ctaButtons.map((button, index) => (
            <Button
              key={index}
              onClick={button.onClick}
              className={`w-full py-3 rounded-lg font-medium hover:shadow-lg ${button.className} ${index === 0 ? 'mb-3' : ''}`}
            >
              {button.label}
            </Button>
          ))}
        </div>
      )}
    </div>
  );
};

export default PropertyInfoBlock;