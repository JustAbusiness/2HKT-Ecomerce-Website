import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import React, { useEffect, useMemo, useState, useRef } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import productApi from "./../../apis/product.api";
import RatingProduct from "./../../components/RatingProduct/RatingProduct";
import { formatNumberToSocialStyle, getIdFromNameId } from "src/utils/utils";
import { formatCurrency, rateSale } from "./../../utils/utils";
import { Product, ProductListConfig } from "./../../types/product.type";
import Products from "../ProductList/components/Product";
import QuantityController from "./../../components/QuantityController/index";
import purchasesApi from './../../apis/purchase.api';
import { purchasesStatus } from './../../constants/purchases';
import { toast } from 'react-toastify';
import  path  from 'src/constants/path';


const ProductDetail = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [byCount, setByCount] = useState(1);
  const { nameId, productId } = useParams(); // useParams là một hook được cung cấp bởi React Router để truy cập các tham số đường dẫn trong URL.
  const id = getIdFromNameId(nameId as string);
  const { data: productDetailData } = useQuery({
    queryKey: ["products", id],
    queryFn: () => productApi.getProductDetail(id as string)
  });
  const product = productDetailData?.data.data; // Truy xuất API triệt để

  const [currentIndexImage, setCurrentIndexImage] = useState([0, 5]); // SET INDEX FOR SLIDER IMAGE
  const [activeImage, setActiveImage] = useState(""); // SET VỊ TRÍ INDEX ẢNH BAN ĐẦU
  const currentImages = useMemo(
    () => (product ? product.images.slice(...currentIndexImage) : []),
    [product, currentIndexImage]
  );
  const imageRef = useRef<HTMLImageElement>(null); //  REF CHO ZOOM HÌNH ẢNH

  const queryConfig: ProductListConfig = {
    limit: "20",
    page: "1",
    category: product?.category._id
  }; // TÌM ĐỒ GIỐNG NHAU QUA CATEGORY
  const { data: productsData } = useQuery({
    // CALL API Product CHO PHẦN TƯƠNG TỰ SẢN PHẦM
    queryKey: ["products", queryConfig],
    queryFn: () => {
      return productApi.getProduct(queryConfig);
    },
    enabled: Boolean(product), // Khi product có data thì query sẽ được gọi
    staleTime: 3 * 60 * 1000
  });

  // ADD TO CART
  const addToCartMutation = useMutation(purchasesApi.addToCart);        // API CHO ADD TO CART

  useEffect(() => {
    if (product && product.images.length > 0) {
      setActiveImage(product.images[0]); // Lấy ảnh vị trí index đầu
    }
  }, [product]);

  const chooseActive = (img: string) => {
    // HOVER ẢNH NÀO RA ẢNH ĐÓ KHI BẤM
    setActiveImage(img);
  };

  const next = () => {
    if (currentIndexImage[1] < (product as Product).images.length) {
      setCurrentIndexImage((prev) => [prev[0] + 1, prev[1] + 1]); // Trong hàm callback, một mảng mới [prev[0] + 1, prev[1] + 1] được tạo ra. Mảng này tăng giá trị của cả hai chỉ số trong currentIndexImage lên 1 đơn vị.
    }
  };

  const prev = () => {
    if (currentIndexImage[0] > 0) {
      setCurrentIndexImage((prev) => [prev[0] - 1, prev[1] - 1]);
    }
  };

  // THU PHÓNG HÌNH ẢNH ZOOM
  const handleZoom = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    const image = imageRef.current as HTMLImageElement; // thực hiện việc ép kiểu của giá trị hiện tại của imageRef thành một đối tượng HTMLImageElement, cho phép ta truy cập các thuộc tính và phương thức đặcif của HTMLImageElement.

    const { naturalHeight, naturalWidth } = image;
    // LẤY CHIỀU CAO.RỘNG
    const rect = event.currentTarget.getBoundingClientRect();
    const { offsetX, offsetY } = event.nativeEvent;
    const top = offsetY * (1 - naturalHeight / rect.height);
    const left = offsetX * (1 - naturalWidth / rect.width);
    const bottom =
      (offsetY + naturalHeight) * (1 - naturalHeight / rect.height);
    const right = (offsetX + naturalWidth) * (1 - naturalWidth / rect.width);

    image.style.width = naturalWidth + "px";
    image.style.height = naturalHeight + "px";
    image.style.maxWidth = "unset";
    image.style.top = top + "px";
    image.style.left = left + "px";
    //  image.style.bottom = bottom + 'px';
    image.style.right = right + "px";
  };

  // DESTROY ZOOM IN IMAGE WHEN CLICK OUTSIDE OF IMAGE
  const handleRemoveZoom = () => {
    imageRef.current?.removeAttribute("style");
  };

  // SET GIÁ TRỊ NHẬP INPUT LÀ NUMBER
  const handleBuyCount = (value: number) => {
    setByCount(value);
  }
  
  // XỬ LÝ SỰ KIỆN THÊM GIỎ HÀNG CHO SẢN PHẦM 
  const addToCart = () => {
    addToCartMutation.mutate({buy_count: byCount, product_id: product?._id as string}, {
      onSuccess: (data) => {
        toast.success(data.data.message, {autoClose: 2000});
        queryClient.invalidateQueries({queryKey:['purchases', {status: purchasesStatus.inCart}] })
      }
    })
  }


 // XỬ LÝ HÀNG MUA NGAY 
  const buyNow = async () => {
    const res = await addToCartMutation.mutateAsync({buy_count: byCount, product_id: product?._id as string})
    const purchase = res.data.data
    navigate(path.cart, {
      state: {
        purchaseId: purchase._id    // purchase là một đối tượng có thuộc tính _id (ID) và bạn muốn chuyển giá trị ID này qua cho trang mới được điều hướng tới.
      }
    })
  }
    
  if (!product) return null;


  return (
    <div className="bg-gray-200 py-3">
      <div className="container">
        <div className="bg-white p-4 shadow mt-3">
          <div className="grid grid-cols-12 gap-9">
            <div className="col-span-5">
              <div
                className="relative w-full pt-[100%] shadow-sm mt-10 overflow-hidden cursor-zoom-in"
                onMouseMove={handleZoom}
                onMouseLeave={handleRemoveZoom}
              >
                <img
                  src={activeImage} // Lấy ảnh vị trí index đầu
                  alt={product.name}
                  className="absolute top-0 left-0  w-full h-full bg-white object-contain pointer-events-none  "
                  ref={imageRef}
                />
              </div>
              <div className="relative grid grid-cols-5 gap-1">
                <button
                  className="absolute left-0 top-1/2 z-10 w-5 h-9 -translate-y-1/2 bg-black/20 text-white"
                  onClick={prev}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-5 h-5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15.75 19.5L8.25 12l7.5-7.5"
                    />
                  </svg>
                </button>
                {/* HÌNH ẢNH NHỎ ZOOM */}
                {currentImages.map((img, index) => {
                  const isActive = img === activeImage; // HOVER ẢNH RENDER RA CÁI ĐÓ
                  return (
                    <div
                      className="relative w-full pt-[100%]"
                      key={index}
                      onMouseEnter={() => chooseActive(img)}
                    >
                      <img
                        src={img}
                        alt={product.name}
                        className="absolute top-0 left-0 h-full w-full cursor-pointer bg-white object-cover"
                      />
                      {isActive && (
                        <div className="absolute inset-0 border-2 border-purple-600"></div>
                      )}
                    </div>
                  );
                })}

                <button
                  className="absolute right-0 top-1/2 z-10 w-5 h-9 -translate-y-1/2 bg-black/20 text-white"
                  onClick={next}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-4 h-4"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M8.25 4.5l7.5 7.5-7.5 7.5"
                    />
                  </svg>
                </button>
              </div>
            </div>
            {/* PHÂN CHIA TRANG COLUMN */}
            <div className="col-span-7 py-10 relative">
              <h1 className="text-xl font-medium uppercase">{product.name}</h1>
              <div className="mt-8 flex items-start justify-between">
                <div className="flex items-center">
                  <span className="mr-1 border-b border-b-purple-600 text-purple-600">
                    {product.rating}
                  </span>
                  <RatingProduct
                    rating={product.rating}
                    activeClassname="fill-purple text-purple h-4 w-4"
                    noneActiveClassName="fill-gray-300 text-gray-300 h-4 w-4"
                  ></RatingProduct>
                  <div className="mx-4 h-4 w-[1px] bg-gray-300"></div>
                  <div>
                    <span>{formatNumberToSocialStyle(product.sold)}</span>
                    <span className="ml-1 text-gray-00">Đã bán</span>
                  </div>
                  <div className="mx-4 h-4 w-[1px] bg-gray-300"></div>
                  <div>
                    <span>{formatNumberToSocialStyle(product.rating)}k</span>
                    <span className="ml-1 text-gray-00">Đánh giá</span>
                  </div>
                </div>
              </div>
              <div className="mt-8 flex items-center bg-gray-50 px-5 py-4">
                <div className="text-gray-500 line-through">
                  đ{formatCurrency(product.price_before_discount)}
                </div>
                <div className="ml-5 text-3xl font-medium text-purple-600">
                  đ{formatCurrency(product.price)}
                </div>
                <div className="ml-44 rounded-sm bg-orange-600 px-1 py-[2px] text-xs font-semibold uppercase text-white">
                  {rateSale(product.price_before_discount, product.price)} giảm
                </div>
              </div>
              {/* SỐ LƯỢNG */}
              <div className="mt-8 flex items-center bg-gray-50">
                <div className="capitalize text-gray-500">Số lượng</div>
                <QuantityController onIncrease={handleBuyCount} onDecrease={handleBuyCount} onType={handleBuyCount} 
                 value={byCount} max={product.quantity}></QuantityController>
                <div className="ml-10 flex text-sm text-gray-500 text-center">
                  {product.quantity} sản phầm có sẵn trong kho
                </div>
              </div>
              {/* THÊM GIỎ HÀNG */}
              <div className="mt-8 flex items-center">
                <button onClick={addToCart} className="flex h-12 items-center justify-center rounded-md border border-orange-400 bg-orange-200 px-5 capitalize text-orange shadow-sm hover:bg-orange-300">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-5 h-5 text-orange-600 stroke-orange-400"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
                    />
                  </svg>
                  <span className="ml-2 text-base text-orange-500">
                    {" "}
                    Thêm vào giỏ hàng
                  </span>
                </button>
                <button onClick={buyNow} className="ml-5 flex h-12 min-w-[5rem] items-center justify-center rounded-md bg-red-600 px-5 capitalize text-white shadow-sm outline-none hover:bg-red-500">
                  Mua Ngay
                </button>
              </div>
              <div className="mt-12 flex w-full justify-between items-center">
                <div className="flex items-center text-start">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-10 h-10 stroke-purple-700 text-purple-700 mr-3"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z"
                    />
                  </svg>
                  <span className="capitalize mt-1"> 2HKT đảm bào</span>
                  <div className="text-base text-gray-500 capitalize ml-20">
                    3 Ngày Trả Hàng / Hoàn Tiền
                  </div>
                </div>
              </div>
              {/* KHUNG QUẢNG CÁO  */}
              <div className="mt-5 flex items-center h-[210px] mb-4">
                <div className="">
                  <img
                    src="https://cf.shopee.vn/file/vn-50009109-fa79715264f5c973648d8096a8aa9773_xxhdpi"
                    alt="logo-shopee"
                    className="h-full w-[80%] cursor-pointer  object-fill rounded-md outline-none shadow-lg animate-bounce"
                  />
                </div>
              </div>

              {/* CHIA SẺ SẢN PHẦM */}
              <div className="flex items-center absolute bottom-[-1%]">
                <div className="flex items-center justify-center gap-3">
                  <div>Chia sẻ:</div>
                  <Link
                    to="/google.com"
                    className="cursor-pointer p-3 ml-5 hover:bg-purple-300 shadow-md outline-none bg-slate-200 rounded-lg hover:translate-y-[-0.0625rem]"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-6 h-6 stroke-purple-600"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"
                      />
                    </svg>
                  </Link>
                  <Link
                    to="/"
                    className="cursor-pointer p-3 ml-2 hover:bg-purple-300 shadow-md outline-none bg-slate-200 rounded-lg hover:translate-y-[-0.0625rem]"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-6 h-6 stroke-purple-500"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M2.25 12.76c0 1.6 1.123 2.994 2.707 3.227 1.068.157 2.148.279 3.238.364.466.037.893.281 1.153.671L12 21l2.652-3.978c.26-.39.687-.634 1.153-.67 1.09-.086 2.17-.208 3.238-.365 1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z"
                      />
                    </svg>
                  </Link>
                  <Link
                    to="/"
                    className="cursor-pointer p-3 ml-2 hover:bg-purple-300 shadow-md outline-none bg-slate-200 rounded-lg hover:translate-y-[-0.0625rem]"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-6 h-6 stroke-purple-500"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z"
                      />
                    </svg>
                  </Link>
                  <Link
                    to="/"
                    className="cursor-pointer p-3 ml-2 hover:bg-purple-300 shadow-md outline-none bg-slate-200 rounded-lg hover:translate-y-[-0.0625rem]"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-6 h-6 stroke-purple-500"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12.75 3.03v.568c0 .334.148.65.405.864l1.068.89c.442.369.535 1.01.216 1.49l-.51.766a2.25 2.25 0 01-1.161.886l-.143.048a1.107 1.107 0 00-.57 1.664c.369.555.169 1.307-.427 1.605L9 13.125l.423 1.059a.956.956 0 01-1.652.928l-.679-.906a1.125 1.125 0 00-1.906.172L4.5 15.75l-.612.153M12.75 3.031a9 9 0 00-8.862 12.872M12.75 3.031a9 9 0 016.69 14.036m0 0l-.177-.529A2.25 2.25 0 0017.128 15H16.5l-.324-.324a1.453 1.453 0 00-2.328.377l-.036.073a1.586 1.586 0 01-.982.816l-.99.282c-.55.157-.894.702-.8 1.267l.073.438c.08.474.49.821.97.821.846 0 1.598.542 1.865 1.345l.215.643m5.276-3.67a9.012 9.012 0 01-5.276 3.67m0 0a9 9 0 01-10.275-4.835M15.75 9c0 .896-.393 1.7-1.016 2.25"
                      />
                    </svg>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* CHI TIẾT SẢN PHẦM */}
        <div className="container w-full">
          <div className="mt-5 bg-white shadow-sm ">
            <div className="rounded bg-gray-50 p-4 text-lg capitalize text-slate-700">
              MÔ TẢ SẢN PHẦM
            </div>
            <div className="mx-4 mt-8 mb-2 text-sm leading-5">
              <div
                dangerouslySetInnerHTML={{ __html: product.description }}
              ></div>
            </div>
          </div>
        </div>
        {/* SẢN PHẦM TƯƠNG TỰ */}
      </div>
      <div className="mt-6 bg-stone-100 px-3 mb-3">
        <div className="container w-full ">
          <div className="rounded uppercase py-6 px-2 shadow-xs text-slate-700 mb-8">
            BẠN CŨNG THÍCH
          </div>
          {productsData && (
            <div className="mt-6 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {productsData.data.data.products.map((product) => (
                <div className="col-span-1" key={product._id}>
                  <Products product={product}></Products>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
