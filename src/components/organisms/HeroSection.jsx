import Text from '@/components/atoms/Text';

const HeroSection = ({ title, subtitle }) => {
  return (
    <div className="text-center mb-8">
      <Text as="h1" className="text-4xl md:text-5xl font-display font-bold text-primary mb-4">
        {title}
      </Text>
      <Text as="p" className="text-lg text-gray-600 max-w-2xl mx-auto">
        {subtitle}
      </Text>
    </div>
  );
};

export default HeroSection;