import { useMutation, useQuery } from "@tanstack/react-query";
import { purchasesStatus } from "./../../constants/purchases";
import purchasesApi from "./../../apis/purchase.api";
import { Link, useLocation } from "react-router-dom";
import ProductDetail from "./../ProductDetail/index";
import path from "./../../constants/path";
import { generateNameId } from "src/utils/utils";
import { formatCurrency } from "./../../utils/utils";
import QuantityController from "src/components/QuantityController";
import Button from "./../../components/Button/Button";
import { Purchase } from "./../../types/purchase.tye";
import { useContext, useState } from "react";
import { useEffect } from "react";
import { produce } from "immer";
import { keyBy } from "lodash";
import { toast } from "react-toastify";
import { AppContext } from "src/contexts/app.context";

// interface ExtendedPurchase extends Purchase {
//   disabled: boolean;
//   checked: boolean;
// }

const Cart = () => {
  // const [extendedPurchases, setExtendedPurchases] = useState<
  //   ExtendedPurchase[]
  // >([]);

  const { extendedPurchases, setExtendedPurchases } = useContext(AppContext); // LÝ DO DÙNG USECONTEXT ĐỂ LƯU LẠI NHỮNG MÓN ĐỒ MUA NGAY THAY VÌ F5 LẠI TA CHUYỂN SANG TRANG KHÁC , KHI QUAY LẠI PHẢI LƯU LẠI STATE SẢN PHẦM ĐÃ ĐC CHỌN MUA NGAY
  const { data: purchasesInCartData, refetch } = useQuery({
    queryKey: ["purchases", { status: purchasesStatus.inCart }],
    queryFn: () =>
      purchasesApi.getPurchasesList({ status: purchasesStatus.inCart })
  });

  const updatePurchaseMutation = useMutation({
    mutationFn: purchasesApi.updatePurchase,
    onSuccess: () => {
      refetch(); // refresh api khi update quantity purchase
    }
  });

  const buyProductsMutation = useMutation({
    mutationFn: purchasesApi.buyProduct,
    onSuccess: (data) => {
      refetch(); // refesh lại giá tiền về ko
      toast.success(data.data.message, {
        position: "top-center",
        autoClose: 1000
      });
    }
  });

  const deletePurchaseMutation = useMutation({
    mutationFn: purchasesApi.deletePurchase,
    onSuccess: () => {
      refetch();
    }
  });

  const location = useLocation(); // CẬP NHẬT STATE SẢN PHẦM SAU KHI BẤM MUA NGAY TỪ TRANG KIA QUA
  const choosenPurchaseIdFromLocation = (
    location.state as { purchaseId: string } | null
  )?.purchaseId; // LẤY STATE purchaseid CỦA location
  console.log(location.state);
  const purchasesInCart = purchasesInCartData?.data.data; // GET API from purchasesApi
  const isAllChecked = extendedPurchases.every((purchase) => purchase.checked); // CHỌN TẤT CẢ SẢN PHẦM SẼ HIỆN Ô TẤT CẢ, CÒN NẾU THIẾU 1 MÓN KO CHỌN THÌ SẼ KO KÍCH HOẠT ĐÁNH DẤU Ô CHỌN TẤT CẢ
  const checkedPurchase = extendedPurchases.filter(
    (purchase) => purchase.checked
  ); // CHECK SẢN PHẦM CÓ DẤU STICK CHECK
  const checkedPurchaseCount = checkedPurchase.length;
  const totalCheckedPurchasePrice = checkedPurchase.reduce(
    (result, current) => {
      return result + current.product.price * current.buy_count;
    },
    0
  );

  const totalCheckedPurchaseSavingPrice = checkedPurchase.reduce(
    (result, current) => {
      return (
        result +
        (current.product.price_before_discount - current.product.price) *
          current.buy_count
      );
    },
    0
  );

  useEffect(() => {
    setExtendedPurchases((prev) => {
      const extendedPurchasesObject = keyBy(prev, "_id");
      return (
        purchasesInCart?.map((purchase) => {
          const isChoosenPurchaseFromLocation =
            choosenPurchaseIdFromLocation === purchase._id; // có = k?
          return {
            ...purchase,
            disabled: false,
            checked:
              isChoosenPurchaseFromLocation ||
              Boolean(extendedPurchasesObject[purchase._id]?.checked)
          };
        }) || []
      );
    });
  }, [purchasesInCart, choosenPurchaseIdFromLocation]);

  useEffect(() => {
    // LOAD TRANG LẠI PHẦN MUA NGAY PHẢI BIẾN MẤT DẤU STICK
    return () => {
      history.replaceState(null, "");
    };
  });

  const handleChecked =
    (purchaseIndex: number) => (event: React.ChangeEvent<HTMLInputElement>) => {
      setExtendedPurchases(
        produce((draft) => {
          //dụng hàm produce từ thư viện Immer để tạo một bản nháp (draft) của mảng extendedPurchases
          draft[purchaseIndex].checked = event.target.checked;
        })
      );
    };

  const handleCheckAll = () => {
    setExtendedPurchases((prev) =>
      prev.map((purchase) => ({
        ...purchase,
        checked: !isAllChecked
      }))
    );
  };

  const handleQuantity = (
    purchaseIndex: number,
    value: number,
    enable: boolean
  ) => {
    if (enable) {
      const purchase = extendedPurchases[purchaseIndex];
      setExtendedPurchases(
        produce((draft) => {
          draft[purchaseIndex].disabled = true; // khi đang cập nhật APi số lượng ko đc phép bấm thêm sau đó mới cho chỉnh = true
        })
      );
      updatePurchaseMutation.mutate({
        product_id: purchase.product._id,
        buy_count: value
      });
    }
  };

  const handleTypeQuantity = (purchaseIndex: number) => (value: number) => {
    setExtendedPurchases(
      produce((draft) => {
        draft[purchaseIndex].buy_count = value;
      })
    );
  };

  const handleDelete = (productIndex: number) => () => {
    // Xóa từng cái
    const purchaseId = extendedPurchases[productIndex]._id;
    deletePurchaseMutation.mutate([purchaseId]);
  };

  const handleDeleteManyPurchases = () => () => {
    const purchasesIds = checkedPurchase.map((purchase) => purchase._id);
    deletePurchaseMutation.mutate(purchasesIds);
  };

  const handleBuyPurchases = () => {
    if (checkedPurchase.length > 0) {
      const body = checkedPurchase.map((purchase) => ({
        product_id: purchase.product._id,
        buy_count: purchase.buy_count
      }));
      buyProductsMutation.mutate(body);
    }
  };

  return (
    <div className="bg-neutral-100 py-16">
      <div className="container">
        <div className="min-w-[1000px]">
          {extendedPurchases.length > 0 ? (
            <>
              <div className="overflow-auto">
                {/* HEADER CART PAGE */}
                <div className="grid grid-cols-12 rounded-sm bg-white py-5 px-9 tetx-sm capitalize text-gray-500 shadow-md">
                  <div className="col-span-6">
                    <div className="flex items-center">
                      <div className="flex flex-shrink-0 items-center justify-center pr-3">
                        <input
                          type="checkbox"
                          className="h-5 w-5 accent-purple-600"
                          checked={isAllChecked && extendedPurchases.length > 0}
                          onChange={handleCheckAll}
                        />
                      </div>
                      <div className="flex-grow text-black">Sản phầm</div>
                    </div>
                  </div>

                  <div className="col-span-6">
                    <div className="grid grid-cols-5 text-center">
                      <div className="col-span-2">Đơn giá</div>
                      <div className="col-span-1">Số lượng </div>
                      <div className="col-span-1">Số Tiền</div>
                      <div className="col-span-1">Thao tác</div>
                    </div>
                  </div>
                </div>
                {/* DETAIL CART INFO */}
                {extendedPurchases.length > 0 && (
                  <div className="my-3 rounded-sm bg-white p-5 shadow-md">
                    {extendedPurchases?.map((purchase, index) => (
                      <div
                        key={purchase._id}
                        className="first:mt-0 grid grid-cols-12 text-center rounded-sm border border-gray-200 bg-white py-5 px-4 text-sm text-gray-500 mt-5"
                      >
                        <div className="col-span-6">
                          <div className="flex">
                            <div className="flex flex-shrink-0 items-center justify-center pr-3">
                              <input
                                type="checkbox"
                                className="h-5 w-5 accent-purple-600"
                                checked={purchase.checked}
                                onChange={handleChecked(index)}
                              />
                            </div>

                            <div className="flex-grow">
                              <div className="flex items-center">
                                <Link
                                  to={`${path.home}${generateNameId({
                                    name: purchase.product.name,
                                    id: purchase.product._id
                                  })}`}
                                  className="h-20 w-20 flex-shrink-0"
                                >
                                  <img
                                    src={purchase.product.image}
                                    alt={purchase.product.name}
                                  />
                                </Link>
                                <div className="flex-grow px-2 pt-1 pb-2">
                                  <Link
                                    to={`${path.home}${generateNameId({
                                      name: purchase.product.name,
                                      id: purchase.product._id
                                    })}`}
                                    className="line-clamp-2"
                                  >
                                    {purchase.product.name}
                                  </Link>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="col-span-6 ml-12 flex items-center">
                          <div className="grid grid-cols-5 items-center">
                            <div className="cols-span-2 ml-3 flex items-center">
                              <div className="flex items-center justify-center">
                                <span className="text-gray-300 line-through">
                                  {formatCurrency(
                                    purchase.product.price_before_discount
                                  )}
                                </span>
                                <span className="ml-3">
                                  {formatCurrency(purchase.product.price)}
                                </span>
                              </div>
                            </div>
                            <div className="ml-12 flex items-center gap-10">
                              <div className="col-span-1 ml-4">
                                <QuantityController
                                  max={purchase.product.quantity}
                                  value={purchase.buy_count}
                                  classNameWrapper="ml-12 flex item-center"
                                  onIncrease={(value) =>
                                    handleQuantity(
                                      index,
                                      value,
                                      value <= purchase.product.quantity
                                    )
                                  } // XỬ LÝ TĂNG GIẢM
                                  onDecrease={(value) =>
                                    handleQuantity(index, value, value >= 1)
                                  }
                                  onType={handleTypeQuantity(index)}
                                  disabled={purchase.disabled}
                                ></QuantityController>
                              </div>
                              <div className="col-span-1">
                                <span className="text-purple-500 ml-5">
                                  đ
                                  {formatCurrency(
                                    purchase.product.price * purchase.buy_count
                                  )}
                                </span>
                              </div>
                              <div className="col-span-1 flex items-center">
                                <button
                                  onClick={handleDelete(index)}
                                  className="bg-none px-10 text-black transition-colors hover:text-purple-500"
                                >
                                  Xóa
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              {/* PAY PURCHASE  */}
              <div className=" flex sticky bottom-0 z-10 rounded-sm bg-white p-5 shadow border border-gray-200 sm:flex-row sm:items-center">
                <div className="flex items-center">
                  <div className="flex flex-shrink-0 items-center px-4">
                    <input
                      type="checkbox"
                      className="h-5 w-5 accent-purple-500"
                      checked={isAllChecked && extendedPurchases.length > 0}
                      onChange={handleCheckAll}
                    />
                  </div>
                  <button
                    className="mx-3 border-none bg-none"
                    onClick={handleCheckAll}
                  >
                    Chọn tất cả ({extendedPurchases.length})
                  </button>
                  <button
                    className="mx-3 border-none bg-none"
                    onClick={handleDeleteManyPurchases}
                  >
                    Xóa
                  </button>
                </div>
                <div className="ml-auto flex items-center">
                  <div className="sm:flex-row">
                    <div className="flex items-center justify-end">
                      <div>
                        {" "}
                        Tổng thanh toán ({checkedPurchaseCount} sản phẩm)
                      </div>
                      <div className="ml-2 text-2xl text-purple-500 font-bold">
                        ₫{formatCurrency(totalCheckedPurchasePrice)}
                      </div>
                    </div>
                    <div className="flex items-center justify-end text-sm">
                      <div className="text-gray-500"> Tiết kiệm </div>
                      <div className="ml-6 text-purple-500 text-base font-normal">
                        ₫{formatCurrency(totalCheckedPurchaseSavingPrice)}
                      </div>
                    </div>
                  </div>
                  <Button
                    onClick={handleBuyPurchases}
                    disabled={buyProductsMutation.isLoading}
                    className="flex w-[150px] items-center justify-center bg-purple-600 py-4 px-2 text-sm uppercase text-white hover:bg-purple-500 ml-5 rounded-lg"
                  >
                    Mua hàng
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <div className="p-2 text-center">
              <img
                src="https://deo.shopeemobile.com/shopee/shopee-pcmall-live-sg/9bdd8040b334d31946f49e36beaf32db.png"
                alt="air-pod"
                className="w-[400px] h-15 object-cover mx-auto"
              />
              <div className="flex mb-3">
                <span className="text-base text-slate-500 font-semibold w-full px-12">
                  {" "}
                  Chưa có sản phầm nào đó{" "}
                </span>
              </div>   
              <Link
                to={path.home}
                className="bg-purple-600 inline-block px-6 py-3 rounded-md uppercase text-white text-center hover:bg-purple-500"
              >
                RẺ QUÁ SHOPPING GÌ ĐÊ
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Cart;
