import http from './../utils/http';
import { ProductListConfig, ProductList, Product } from './../types/product.type';
import { SuccessResponse } from 'src/types/utils.type';

const URL = 'products'
const productApi = {
    getProduct(params: ProductListConfig) {
        return http.get<SuccessResponse<ProductList>>(URL, {
            params
        })
    },
    getProductDetail(id: string) {
        return http.get<SuccessResponse<Product>>(`${URL}/${id}`)
    },
}

export default productApi;