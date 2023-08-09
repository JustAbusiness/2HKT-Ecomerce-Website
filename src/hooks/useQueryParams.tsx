import React from 'react';
import {useSearchParams} from "react-router-dom"

const useQueryParams = () => {
    const [searchParams] = useSearchParams()
    //  Hàm useSearchParams trả về một mảng gồm đối tượng URLSearchParams và một hàm để cập nhật tham số truy vấn. Trong đoạn mã này, mảng được gán cho biến searchParams, nhưng chỉ lấy phần tử đầu tiên (đối tượng URLSearchParams) thông qua việc sử dụng cú pháp destructuring assignment.

    return Object.fromEntries([...searchParams])
    //Dòng mã này chuyển đổi đối tượng URLSearchParams thành một đối tượng JavaScript thông qua phương thức Object.fromEntries(). Đối tượng URLSearchParams chứa các cặp key-value của các tham số truy vấn trong URL. Bằng cách sử dụng toán tử spread ([...searchParams]), ta tạo một mảng chứa các mảng con gồm hai phần tử (key và value). Sau đó, mảng này được chuyển đổi thành một đối tượng JavaScript thông qua phương thức Object.fromEntries(), trả về đối tượng chứa thông tin về các tham số truy vấn.
};

export default useQueryParams;