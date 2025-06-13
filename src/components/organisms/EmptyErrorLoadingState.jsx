import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import Text from '@/components/atoms/Text';

const EmptyErrorLoadingState = ({ type, message, title, icon, onAction, actionText }) => {
  // Skeleton for loading state
  if (type === 'loading') {
    return (
      <div className="animate-pulse space-y-8 p-4">
        <div className="h-8 bg-gray-200 rounded w-1/4 mx-auto"></div>
        <div className="h-96 bg-gray-200 rounded-lg"></div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="h-8 bg-gray-200 rounded w-3/4"></div>
            <div className="space-y-3">
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded w-5/6"></div>
              <div className="h-4 bg-gray-200 rounded w-4/6"></div>
            </div>
          </div>
          <div className="space-y-4">
            <div className="h-32 bg-gray-200 rounded-lg"></div>
          </div>
        </div>
      </div>
    );
  }

  // Common wrapper for error/empty states
  return (
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className="text-center py-16"
    >
      <motion.div
        animate={{ y: [0, -10, 0] }}
        transition={{ repeat: Infinity, duration: 3 }}
      >
        <ApperIcon name={icon} className="w-24 h-24 text-gray-300 mx-auto mb-6" />
      </motion.div>
      <Text as="h3" className="text-2xl font-display font-semibold text-gray-900 mb-4">
        {title}
      </Text>
      <Text className="text-gray-600 mb-8 max-w-md mx-auto">
        {message}
      </Text>
      {onAction && actionText && (
        <Button
          onClick={onAction}
          className="bg-accent text-white hover:shadow-lg"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {actionText}
        </Button>
      )}
    </motion.div>
  );
};

export default EmptyErrorLoadingState;