import { motion } from 'framer-motion';

const Input = ({ 
  type = 'text', 
  value, 
  onChange, 
  placeholder = '', 
  className = '', 
  isFocused = false, 
  onFocus, 
  onBlur,
  as: Component = 'input', // Allow rendering as 'textarea' or 'select'
  ...props 
}) => {
  const inputClass = `w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm ${className}`;
  
  if (Component === 'textarea') {
    return (
      <motion.textarea
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`${inputClass} resize-none`}
        onFocus={onFocus}
        onBlur={onBlur}
        {...props}
      />
    );
  } else if (Component === 'select') {
    return (
      <motion.select
        value={value}
        onChange={onChange}
        className={inputClass}
        onFocus={onFocus}
        onBlur={onBlur}
        {...props}
      >
        {props.children}
      </motion.select>
    );
  }

  return (
    <motion.input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={inputClass}
      onFocus={onFocus}
      onBlur={onBlur}
      {...props}
    />
  );
};

export default Input;