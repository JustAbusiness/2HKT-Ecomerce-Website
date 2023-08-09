const URL = 'categories';
import { SuccessResponse } from 'src/types/utils.type';
import http from './../utils/http';
import { Category } from './../types/category.type';

const categoryApi = {
    getCategories() {
        return http.get<SuccessResponse<Category[]>>(URL)
    }
}

export default categoryApi