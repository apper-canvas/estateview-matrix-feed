import Text from '@/components/atoms/Text';

const PriceDisplay = ({ price, className = '' }) => {
  const formattedPrice = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);

  return (
    <Text as="span" className={className}>
      {formattedPrice}
    </Text>
  );
};

export default PriceDisplay;