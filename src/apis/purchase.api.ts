const URL = "purchases";

import { SuccessResponse } from "src/types/utils.type";
import http from "./../utils/http";
import { Purchase, PurchasesListStatus } from "./../types/purchase.tye";

const purchasesApi = {
  // vì nó là phương thức post nên ta cần khai báo body
  addToCart(body: { product_id: string; buy_count: number }) {
    return http.post<SuccessResponse<Purchase>>(`${URL}/add-to-cart`, body);
  },

  getPurchasesList(params: {status: PurchasesListStatus}) {
    return http.get<SuccessResponse<Purchase[]>>(`${URL}`,{
        params
    })
  },

  buyProduct(body: {product_id: string, buy_count: number}[]) {
    return http.post<SuccessResponse<Purchase[]>>(`${URL}/buy-products`, body);
  },
  
  updatePurchase(body: {product_id: string, buy_count: number}) {
    return http.put<SuccessResponse<Purchase>>(`${URL}/update-purchase`, body);
  },

  deletePurchase(purchaseIds: string[]) {
    return http.delete<SuccessResponse<{deleted_count: number}>>(`${URL}`, {
      data: purchaseIds
    })
  }
};

export default purchasesApi;
