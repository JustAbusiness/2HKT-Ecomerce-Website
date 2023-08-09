import React from "react";
import NavHeader from "./../NavHeader/index";
import { Link } from "react-router-dom";
import path from "src/constants/path";
import useSearchProduct from './../../hooks/useSearchProduct';

const CartHeader = () => {
  const {onSubmitSearch, register} = useSearchProduct();

  return (
    <div className="border-b border-b-black/10 ">
      <div className="bg-purple-500">
        <div className="container">
          <NavHeader></NavHeader>
        </div>
      </div>
      <div className="bg-white py-6">
        <div className="container">
          <nav className="flex items-center justify-around gap-[30%]">
            <div className="flex items-center justify-start">
                <Link
                to={path.home}
                className="col-span-2  flex flex-shrink-0 items-end "
                >
                <img
                    src="../../../public/Logo (1).png"
                    alt="logo"
                    className="w-24 h-12 object-contain ssm"
                />
                </Link>
                <div className="mx-2 h-12 w-[2px] bg-purple-700" />
                <div className="capitalize text-purple-700 lg:text-xl mx-2">
                {" "}
                Giỏ hàng
                </div>
            </div>

            {/* TÌM KIẾM SẢN PHẦM  */}
            <form className="mt-10 md:mt-0 md:w-[50%] mr-10" onSubmit={onSubmitSearch}>
              <div className="bg-white rounded-sm p-1 flex w-full">
                <input
                  type="text" // REACT HOOK FORM
                  {...register('name')}          // Tìm sản phầm có api attribute là name
                  placeholder="Tìm kiếm sản phầm ...."
                  className="text-black px-3 py-2 flex-grow border-2 border-r-0 border-purple-400 outline-none bg-transparent rounded-r-sm"
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
          </nav>
        </div>
      </div>
    </div>
  );
};

export default CartHeader;
