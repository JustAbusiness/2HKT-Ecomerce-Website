import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import useQueryParams from './../../hooks/useQueryParams';
import productApi from './../../apis/product.api';
import Paginate from './../../components/Pagination/index';
import { ProductListConfig } from './../../types/product.type';
import { omitBy, isUndefined} from "lodash";
import categoryApi from './../../apis/category.api';
import AsideFilter from './components/AsideFilter/AsideFilter';
import SortProductList from './components/SortProductList/SortProductList';
import Product from './components/Product/Product';

export type QueryConfig = {
  [key in keyof ProductListConfig]: string
}
// Kiểu này được sử dụng để mô tả đối tượng chứa các thông tin cấu hình (config) cho danh sách sản phẩm (ProductListConfig) trong một truy vấn.


const ProductList = () => {
  const queryParams: QueryConfig = useQueryParams();   // Lấy URL parameters
  const queryConfig: QueryConfig = omitBy({
    page: queryParams.page || '1',
    limit: queryParams.limit || 20,
    sort_by: queryParams.sort_by ,
    exclude: queryParams.exclude ,
    name: queryParams.name ,
    price_max: queryParams.price_max ,
    rating_filter: queryParams.rating_filter,
    category: queryParams.category,
  }, isUndefined)     // => omit, undefined loại bỏ key vào thỏa mãn undefined

  const [page, setPage] = useState(1);     // Xử lý phân trang
  const {data: productsData} = useQuery ({           // CALL API Product
    queryKey: ['products', queryParams ],
    queryFn: () => {
      return productApi.getProduct(queryParams as ProductListConfig)
    },
    keepPreviousData: true,   // Đây là một cờ cho biết liệu dữ liệu trước đó có nên được giữ lại khi truy vấn mới được gửi hay không. Trong trường hợp này, giá trị là true, cho phép giữ lại dữ liệu trước đó khi có một truy vấn mới.
    staleTime: 3 * 60 * 1000   // Sau 3 phút, nếu có một truy vấn mới, nó sẽ gửi yêu cầu để lấy dữ liệu mới từ API thay vì sử dụng dữ liệu đã lưu trữ trong bộ nhớ cache.
  })

  console.log(productsData);

  const {data: categoryData} = useQuery ({           // CALL API Category
    queryKey: ['categories'],
    queryFn: () => {
      return categoryApi.getCategories()
    }, 
  })


  return (
    <div className="bg-gray-200 py-6">
      <div className="container h-full">
        { productsData && (
        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-2 ml-2">
            <AsideFilter categories={categoryData?.data.data || []} queryConfig={queryConfig}></AsideFilter>
          </div>

          <div className="col-span-10">
            <SortProductList  queryConfig={queryConfig} pageSize={productsData.data.data.pagination.page_size} ></SortProductList>
            {/* ITEMS DISPLAY */}
            <div className="mt-6 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2">
              { productsData.data.data.products.map((product) => (
                  <div className="col-span-1" key={product._id}>
                    <Product product={product}></Product>
                  </div>
                ))}
            </div>
            {/* PHÂN TRANG PRODUCT */}
            {/* <Paginate page={page} setPage={setPage} pageSize={20}></Paginate> */}
            <Paginate queryConfig={queryConfig} pageSize={productsData.data.data.pagination.page_size} ></Paginate>
          </div>
        </div>
        )}
      </div>
    </div>
  );
};

export default ProductList;
