import { motion } from 'framer-motion';

const Text = ({ as: Component = 'p', children, className = '', ...props }) => {
  return (
    <Component className={className} {...props}>
      {children}
    </Component>
  );
};

export default Text;