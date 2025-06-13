import Input from '@/components/atoms/Input';
import Text from '@/components/atoms/Text';

const FormField = ({ label, id, value, onChange, placeholder, type = 'text', selectOptions, ...props }) => {
  const isSelect = Array.isArray(selectOptions);
  
  return (
    <div>
      <Text as="label" htmlFor={id} className="block text-sm font-medium text-gray-700 mb-3">
        {label}
      </Text>
      {isSelect ? (
        <Input
          as="select"
          id={id}
          value={value}
          onChange={onChange}
          {...props}
        >
          {selectOptions.map(option => (
            <option key={option.value} value={option.value}>{option.label}</option>
          ))}
        </Input>
      ) : (
        <Input
          type={type}
          id={id}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          {...props}
        />
      )}
    </div>
  );
};

export default FormField;