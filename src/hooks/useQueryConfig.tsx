import { ProductListConfig } from './../types/product.type';
import useQueryParams from './useQueryParams';
import { omitBy, isUndefined} from "lodash";

export type QueryConfig = {
    [key in keyof ProductListConfig]: string
  }

export default function useQueryConfig() {
  const queryParams: QueryConfig = useQueryParams(); // lấy các tham số truy vấn từ URL.
  const queryConfig: QueryConfig = omitBy(
    {
      page: queryParams.page || "1",
      limit: queryParams.limit || 20,
      sort_by: queryParams.sort_by,
      exclude: queryParams.exclude,
      name: queryParams.name,
      price_max: queryParams.price_max,
      rating_filter: queryParams.rating_filter,
      category: queryParams.category
    },
    isUndefined
  ); // => omit, undefined loại bỏ key vào thỏa mãn undefined

  return queryConfig;
}
