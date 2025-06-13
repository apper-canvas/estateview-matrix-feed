import Text from '@/components/atoms/Text';

const StatusBadge = ({ status }) => {
  const badgeClass = status === 'For Sale' 
    ? 'bg-success/10 text-success'
    : 'bg-warning/10 text-warning';

  return (
    <Text as="span" className={`font-medium px-2 py-1 rounded text-sm ${badgeClass}`}>
      {status}
    </Text>
  );
};

export default StatusBadge;