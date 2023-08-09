import InputNumber from "./../InputNumber/index";
import { InputNumberProps } from "./../InputNumber/InputNumber";
import { useState } from 'react';

interface Props extends InputNumberProps {
  //  Interface giúp xác định các thuộc tính, phương thức, kiểu dữ liệu và các ràng buộc của một kiểu.
  max?: number;      
  onIncrease?: (value: number) => void; // Nếu cung cấp, nó phải là một hàm có một tham số kiểu number và không có giá trị trả về. Nếu không cung cấp, nó sẽ được coi là undefined.
  onDecrease?: (value: number) => void;
  onType?: (value: number) => void;
  onFocusOut?: (value: number) => void;
  classNameWrapper?: string;
}

const QuantityController = ({
  max,          // maximum quantity if it over the max then it will be set equal to max value
  onIncrease,
  onDecrease,
  onFocusOut,
  onType,
  classNameWrapper = "ml-20",
  value,
  ...rest
}: Props) => {
  
  const [localValue, setLocalValue] = useState<number>(Number(value) || 0)
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    let _value = Number(event.target.value);
    if (max !== undefined && _value > max) {          // Nếu tổng kho ko undefined và giá trị nhập lớn hơn tổng kho thì sẽ set lại giá trị
      _value = max;
    } else if (_value < 1) {   // Nếu giá trị nhập số lượng bé hơn 1 thì reset lại 1 từ đầu
      _value = 1;
    }
     
    onType && onType(_value);       // Nếu người dùng ko nhâp vào thì mặc định sẽ set value mặc định
    setLocalValue(_value)
  };

  const increase = () => {
    let _value  = Number(value || localValue) + 1;
    if (max !== undefined && _value > max) {       // Nếu nhập quá số lượng thì sẽ cho đúng số lượng kho
      _value = max;
    }
    onIncrease && onIncrease(_value);
    setLocalValue(_value)
  }

  const decrease = () => {
    let _value  = Number(value || localValue) - 1;
    if (_value < 1) {         // Nếu giá trị nhâp bé hơn 1 thì sẽ gán về 1       
      _value = 1;
    }
    onDecrease && onDecrease(_value);
  }

  const handleBlur  = (event: React.FocusEvent<HTMLInputElement, Element> ) => {
      onFocusOut && onFocusOut(Number(event.target.value));
  }

  return (
    <div className={`flex items-center + ${classNameWrapper}`}>
      <button className="flex h-8 w-8 items-center justify-center rounded-l-sm border border-gray-300 text-gray-600" onClick={decrease}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-4 h-4 hover:text-purple-900"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 12h-15" />
        </svg>
      </button>
      <InputNumber
        onChange={handleChange}
        value={value}
        onBlur={handleBlur}
        {...rest}
        className=""
        classNameError="hidden"
        classNameInput="h-15 w-14 border-t border-b border-x-gray-300 p-1 text-center outline-none"
      ></InputNumber>
      <button className="flex h-8 w-8 items-center justify-center rounded-l-sm border border-gray-300 text-gray-600" onClick={increase}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-4 h-4 hover:text-purple-900"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 4.5v15m7.5-7.5h-15"
          />
        </svg>
      </button>
    </div>
  );
};

export default QuantityController;
