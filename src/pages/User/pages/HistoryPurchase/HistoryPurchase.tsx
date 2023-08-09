import React from "react";
import { Link, createSearchParams } from "react-router-dom";
import path from "./../../../../constants/path";
import { purchasesStatus } from "./../../../../constants/purchases";
import classNames from "classnames";
import useQueryParams from "./../../../../hooks/useQueryParams";
import { useQuery } from "@tanstack/react-query";
import purchasesApi from "src/apis/purchase.api";
import { PurchasesListStatus } from "src/types/purchase.tye";
import { generateNameId } from "src/utils/utils";
import { produce } from "immer";
import { formatCurrency } from './../../../../utils/utils';

const purchaseTabs = [
  { status: purchasesStatus.all, name: "Tất cả" },
  { status: purchasesStatus.waitForConfirmation, name: "Chờ xác nhận" },
  { status: purchasesStatus.waitForGettings, name: "Chờ lấy hàng" },
  { status: purchasesStatus.inProgress, name: "Đang giao" },
  { status: purchasesStatus.delivered, name: "Đã giao hàng" },
  { status: purchasesStatus.cancelled, name: "Đã hũy" }
];

const HistoryPurchase = () => {
  const queryParams: { status?: string } = useQueryParams(); // Lấy parans xét status
  const status: number = Number(queryParams.status) || purchasesStatus.all;

  // XỬ LÝ GIỎ HÀNG
  const { data: purchasesInCartData } = useQuery({
    queryKey: ["purchases", { status }],
    queryFn: () =>
      purchasesApi.getPurchasesList({ status: status as PurchasesListStatus })
  });

  const purchaseInCart = purchasesInCartData?.data.data; // LẤY API IN CART

  const purchaseTabsLink = purchaseTabs.map((tab) => (
    <Link
      key={tab.status}
      to={{
        pathname: path.historyPurchase,
        search: createSearchParams({
          status: String(tab.status)
        }).toString()
      }}
      className={classNames(
        "flex flex-1 items-center justify-center border-b-2 bg-white py-4 text-center",
        {
          "border-b-purple-600 text-purple-600": status === tab.status,
          "border-b-black/10 text-gray-900": status !== tab.status
        }
      )}
    >
      {tab.name}
    </Link>
  ));

  return (
    <div>
      <div className="overflow-x-auto">
          <div className="min-w-[700px]">           {/* RESPONSE SIVE LẤY THANH ĐẨY NGANG KHI VỀ DƯỚI 700PX */} 
              <div className="sticky top-0 flex rounded-t-sm shadow-sm"> {purchaseTabsLink}</div>
            
              <div>
                {purchaseInCart?.map((purchase) => (
                  <div
                    key={purchase._id}
                    className="mt-4 rounded-sm border-black/10 bg-white p-6 text-gray-800 shadow-sm"
                  >
                    <Link
                      to={`${path.home}${generateNameId({
                        name: purchase.product.name,
                        id: purchase.product._id
                      })}`}
                      className="flex "
                    >
                        <div className="flex-shrink-0 ">
                            <img src={purchase.product.image} alt={purchase.product.name} className="h-20 w-20 object-cover" />
                        </div>
                        <div className="ml-3 flex-grow overflow-hidden">
                            <div className="truncate">{purchase.product.name}</div>
                            <div className="mt-3 font-semibold text-purple-600"> Số lượng: {purchase.buy_count}</div>
                            <div className="mt-3 flex-grow overflow-hidden items-end">
                              <span className="truncate text-gray-500 line-through">đ{formatCurrency(purchase.product.price_before_discount)}</span>
                              <span className="ml-2 truncate text-purple-600 font-bold">đ{formatCurrency(purchase.product.price)}</span>
                            </div>
                        </div>
                    </Link>
                      <div className="flex justify-end">
                          <div>
                            <span> Tổng giá tiền </span>
                            <span className="ml-4 text-purple-600">
                              đ {formatCurrency(purchase.price * purchase.buy_count)}
                            </span>
                          </div>
                      </div>
                  </div>
                ))}
              </div>

          </div>
      </div>
    </div>
  );
};

export default HistoryPurchase;
