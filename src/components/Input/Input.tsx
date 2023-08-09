import { InputHTMLAttributes } from "react";
import type { UseFormRegister, RegisterOptions } from "react-hook-form";

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  // type: React.HTMLInputTypeAttribute
  errorMessage?: string;
  // placeholder?: string
  // className?: string
  // name: string
  register?: UseFormRegister<any>;
  rules?: RegisterOptions;
  // autoComplete?: string
  classNameInput?: string;
  classNameError?: string;
}

const Input = ({
  type,
  errorMessage,
  placeholder,
  className,
  name,
  register,
  rules,
  autoComplete,
  classNameInput = "p-3 w-full outline-none border border-gray-300 focus:border-gray-500 rounded-md focus:shadow-sm",
  classNameError = "text-red-600 min-h-[1.25rem] text-sm mt-1"
}: Props) => {
  const registerResult = register && name ? register(name, rules) : {}
  return (
    <div className={className}>
      <input
        type={type}
        className={classNameInput}
        placeholder={placeholder}
        autoComplete={autoComplete}
        {...registerResult}
      />
      <div className={classNameError}>{errorMessage}</div>
    </div>
  );
};

export default Input;
