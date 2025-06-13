import { motion } from 'framer-motion';

const Button = ({ children, className = '', onClick, type = 'button', whileHover = { scale: 1.02 }, whileTap = { scale: 0.98 }, ...props }) => {
  return (
    <motion.button
      type={type}
      className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${className}`}
      onClick={onClick}
      whileHover={whileHover}
      whileTap={whileTap}
      {...props}
    >
      {children}
    </motion.button>
  );
};

export default Button;