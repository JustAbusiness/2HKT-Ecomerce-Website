import { range } from "lodash";
import { useEffect, useState } from "react";

interface Props {
  onChange?: (value: Date) => void;
  value?: Date;
  errorMessage?: string;
}

const DateSelect = ({ value, onChange, errorMessage }: Props) => {   
  const [date, setDate] = useState({
    date: value?.getDate() || 1,
    month: value?.getMonth() || 0,
    year: value?.getFullYear() ||  1990
  });

  useEffect(() => {
    if (value) {         // LẮNG NGHE SỰ KIỆN TỪ VALUE KHI THAY ĐỔI SỰ KIỆN
      setDate({
        date: value?.getDate() || 1,
        month: value?.getMonth() || 0,
        year: value?.getFullYear() ||  1990
      })
    }          
  },[value])

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const { value: valueFormSelect, name } = event.target;
    const newDate = {     // Tạo một đối tượng ngày mới (newDate) bằng cách sao chép đối tượng ngày cũ (date) và cập nhật giá trị mới cho thuộc tính có tên (name) tương ứng
      date: value?.getDate() || date.date,
      month: value?.getMonth() || date.month ,
      year: value?.getFullYear() ||  date.year,
      [name]: Number(valueFormSelect)
    }; 

    setDate(newDate);    // Cập nhật đối tượng ngày (date) trong state bằng đối tượng ngày mới (newDate) sử dụng hàm setDate
    onChange && onChange(new Date(newDate.year, newDate.month, newDate.date))  // Gọi hàm onChange (nếu có) và truyền vào đối tượng Date mới đã được cập nhật
  };

  return (
    <div className="mt-3 flex flex-wrap ">
      <div className="w-[20%] truncate pt-3 text-right capitalize">
        Ngày sinh:
      </div>
      <div className="w-[50%] pl-5">
        <div className="flex justify-between">
          <select
            onChange={handleChange}
            name="date"
            className="h-10 w-[30%] rounded-sm border border-black/10 px-2 hover:border-purple-500 cursor-pointer"
            value={value?.getDate() || date.date}
          >
            <option disabled>Ngày</option>
            {range(1, 32).map((item) => (
              <option value={item} key={item}>          
                {item}
              </option>
            ))}
          </select>
          <select
            onChange={handleChange}
            name="month"
            className="h-10 w-[30%] rounded-sm border border-black/10 px-2 hover:border-purple-500 cursor-pointer"
            value={value?.getMonth() || date.month}
          >
            <option disabled>Tháng</option>
            {range(1, 13).map((item) => (
              <option value={item} key={item}>
                {item + 1}
              </option>
            ))}
          </select>
          <select
            onChange={handleChange}
            name="year"
            className="h-10 w-[30%] rounded-sm border border-black/10 px-2 hover:border-purple-500 cursor-pointer"
            value={value?.getFullYear() || date.year}
          >
            <option disabled>Năm</option>
            {range(1990, 2023).map((item) => (
              <option value={item} key={item}>
                {item}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* SHOW ERROR IF IT NOT CORRECT */}
      <div className="mt-1 text-red-600 min-h-[1.25rem] text-sm">{}</div>
    </div>
  );
};

export default DateSelect;
