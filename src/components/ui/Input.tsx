import { InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

const Input = ({
  label,
  placeholder,
  value,
  onChange,
  type = "text",
  ...rest
}: InputProps) => {
  return (
    <div className="mb-4">
      <label className="block text-gray-700 dark:text-gray-200 text-sm font-bold mb-2">
        {label}
      </label>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none  focus:border-blue-500 dark:bg-gray-700 dark:text-gray-300"
        {...rest}
      />
    </div>
  );
};

export default Input;