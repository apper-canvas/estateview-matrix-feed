import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import ApperIcon from '../components/ApperIcon';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-soft-white px-4">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="text-center"
      >
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ repeat: Infinity, duration: 3 }}
        >
          <ApperIcon name="Home" className="w-24 h-24 text-primary mx-auto mb-6" />
        </motion.div>
        
        <h1 className="text-4xl font-display font-bold text-primary mb-4">
          Property Not Found
        </h1>
        
        <p className="text-gray-600 mb-8 max-w-md mx-auto">
          The property you're looking for doesn't exist or may have been removed from our listings.
        </p>
        
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate('/browse')}
          className="bg-accent text-white px-8 py-3 rounded-lg font-medium hover:shadow-lg transition-all duration-200"
        >
          Browse Properties
        </motion.button>
      </motion.div>
    </div>
  );
};

export default NotFound;