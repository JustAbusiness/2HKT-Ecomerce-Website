import { useContext, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Popover from "./../../components/Popover/Popover";
import { useMutation, useQuery } from "@tanstack/react-query";
import { AppContext } from "src/contexts/app.context";
import authApi from "./../../apis/auth.api";
import useQueryConfig from "src/hooks/useQueryConfig";
import { useForm } from "react-hook-form";
import { Schema, schema } from "src/utils/rules";
import { yupResolver } from "@hookform/resolvers/yup";
import path from "./../../constants/path";
import { createSearchParams } from "react-router-dom";
import { omit } from "lodash";
import { purchasesStatus } from './../../constants/purchases';
import purchasesApi from './../../apis/purchase.api';
import { formatCurrency } from './../../utils/utils';
// import { queryClient } from './../../main';
import NavHeader from './../../components/NavHeader/index';
import useSearchProduct from './../../hooks/useSearchProduct';


// type FormData = Pick<Schema, "name">;
// const nameSchema = schema.pick(["name"]);
const MAXPURCHASES = 5; 

const Header = () => {
  // const queryConfig = useQueryConfig();
  // const { register, handleSubmit } = useForm<FormData>({
  //   // SUBMIT FORM TÌM KIẾM
  //   defaultValues: {
  //     name: ""
  //   },
  //   resolver: yupResolver(nameSchema)
  // });

  const { setIsAuthenticated, isAuthenticated, setProfile, profile } = useContext(AppContext);
  const {onSubmitSearch, register } = useSearchProduct()
  // const navigate = useNavigate();
  
  // const logoutMutation = useMutation({
  //   mutationFn: authApi.logout,
  //   onSuccess: () => {
  //     setIsAuthenticated(false);
  //     setProfile(null);
  //     queryClient.removeQueries({queryKey:  ['purchases', {status: purchasesStatus.inCart}]})    // ĐĂNG XUẤT SẼ KO LƯU LẠI SỐ LƯỢNG GIỎ HÀNG
  //   }
  // });

// XỬ LÝ GIỎ HÀNG  
  const {data: purchasesInCartData} = useQuery({
    queryKey: ['purchases', {status: purchasesStatus.inCart}],
    queryFn: () => purchasesApi.getPurchasesList({status: purchasesStatus.inCart}),
    enabled: isAuthenticated            // Chỉ khi đăng nhâp mới hiện thông tin cart còn ko sẽ về 0
  })

  const purchasesInCart  = purchasesInCartData?.data.data      // GET API GIỎ HÀNG

  // XỬ LÝ ĐĂNG XUẤT
  // const handleLogout = () => {
  //   logoutMutation.mutate();
  //   navigate("/");
  // };

  // const onSubmitSearch = handleSubmit((data) => {
  //   // LOẠI BỎ TRƯỜNG HỢP TƯƠNG TÁC VS SORT PRODUCT 
  //   const config = queryConfig?.order
  //     ? omit(
  //         {
  //           ...queryConfig,
  //           name: data.name
  //         },
  //         ["order", "sort_by"]
  //       )
  //     : {
  //         ...queryConfig,
  //         name: data.name
  //       };

  //   navigate({
  //     pathname: path.home,
  //     search: createSearchParams(config).toString()
  //   });
  // });

  return (
    <div className="pb-5 pt-2 bg-purple-500">
      <div className="container relative"> 
          <Link to='/' className="absolute text-center p-2 ml-8 animate-charcter shadow-lg rounded-2xl border-4 border-purple-600 pointer-events-none cursor-not-allowed">
            2hkt
          </Link>
       

          {/* AVATAR */}
          {/* Khi người dùng ko đăng nhập thì sẽ hiển thị login và đăng ký */}
          <NavHeader></NavHeader>
        
        </div>

        <div className="grid grid-cols-12 gap-4 mt-6 items-end">
          <Link to="/" className="col-span-2 ml-5">
            <img
              src="../../../public/Logo (1).png"
              alt="logo"
              className="w-24 h-12 object-contain "
            />
          </Link>

          {/* TÌM KIẾM SẢN PHẦM  */}
          <form className="col-span-8" onSubmit={onSubmitSearch}>
            <div className="bg-white rounded-sm p-1 flex">
              <input
                type="text"
                {...register("name")}      // REACT HOOK FORM
                placeholder="Tìm kiếm sản phầm ...."
                className="text-black px-3 py-2 flex-grow border-none outline-none bg-transparent"
              />
              <button className="rounded-sm py-2 px-6 flex-shrink-0 bg-purple-800 hover:opacity-90">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
                  />
                </svg>
              </button>
            </div>
          </form>

          {/* GIỎ HÀNG  */}
          <div className="col-span-1 justify-self-end">
            <Popover
              placement="bottom-start"
              renderPopover={
                <div className="bg-white py-2 px-3 relative shadow-md rounded-md border border-gray-200 max-w-[355px]">
                  {purchasesInCart && purchasesInCart.length > 0  ? (
                    <div className="p-2">
                      <div className="text-gray-400 capitalize text-xs">
                        Sản phầm mới thêm
                      </div>
                      <div className="mt-5">
                        {purchasesInCart.slice(0, MAXPURCHASES).map((purchases) => (
                          <div className="mt-2 py-2 flex items-center hover:bg-gray-100" key={purchases._id}>
                            <div className="flex-shrink-0">
                                <img src={purchases.product.image} alt={purchases.product.name} className="w-[80px]" />
                            </div>
                            <div className="flex-grow ml-2 overflow-hidden">
                              <div className="truncate text-sm">
                                  {purchases.product.name}   
                              </div>
                            </div>
                            <div className="ml-2 flex-shrink-0 ">
                            <span className="text-purple-700 text-sm font-bold">
                              đ{formatCurrency(purchases.product.price)}
                            </span>
                          </div>
                          </div>          
                        ))}
                    </div>
                    
                      <div className="flex mt-6 items-center justify-between">
                        <div className="capitalize text-xs text-gray-600 block">
                            {purchasesInCart.length > MAXPURCHASES ? purchasesInCart.length - MAXPURCHASES : 'Thêm vào giỏ hàng'}  
                        </div>
                        <Link
                          to={path.cart}
                          className="px-5 py-2 rounded-md shadow-md capitalize bg-purple-700 hover:bg-opacity-75 text-white ml-4"
                        >
                           <span className="text-white tetx-md"> Xem giỏ hàng </span>
                        </Link>
                      </div>
                      </div>
                  ) : (
                    <div className="p-2">
                       <img
                            src="https://deo.shopeemobile.com/shopee/shopee-pcmall-live-sg/9bdd8040b334d31946f49e36beaf32db.png"
                            alt="air-pod"
                            className="max-w-[200px] h-15 object-cover ml-10"
                          />
                    <span className="text-base text-slate-500 mt-5  w-full px-12"> Chưa có sản phầm nào đó  </span>   
                    </div>
                  )}
                </div>
              }
            >
              <Link to="/" className="relative">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-7 h-7 mb-1"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z"
                  />
                </svg>
               {purchasesInCart && purchasesInCart.length > 0 && <span className="absolute top-[-5px] left-[17px] rounded-full px-[5px] py-[1px] bg-slate-300 text-purple-600">{purchasesInCart?.length } </span>} 
              </Link>
            </Popover>
          </div>
        </div>
      </div>
  );
};

export default Header;
