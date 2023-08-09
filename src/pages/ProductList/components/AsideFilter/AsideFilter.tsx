import React from "react";
import {
  Link,
  Navigate,
  createSearchParams,
  useNavigate
} from "react-router-dom";

import classNames from "classnames";
import RatingStar from "./../RatingStart/index";
import { omit } from "lodash";

import { Category } from './../../../../types/category.type';
import path from './../../../../constants/path';
import Input from './../../../../components/Input/index';
import Button from './../../../../components/Button/Button';
import { QueryConfig } from "../../ProductList";

interface Props {
  queryConfig: QueryConfig;
  categories: Category[];
}

const AsideFilter = ({ queryConfig, categories }: Props) => {
  const navigate = useNavigate();
  const { category } = queryConfig; // Lấy URL
  console.log(categories);

  // XOÁ TÌM KIẾM
  const handleRemoveAll = () => {
    navigate({
      pathname: path.home,
      search: createSearchParams(omit(queryConfig, ['price_min', 'price_max', 'rating_filter', 'category'])).toString()
    });
  };

  return (
    <div className="py-4">
      <Link
        to={path.home}
        className={classNames("flex items-center font-bold", {
          "text-purple-600": !category // Bấm vào thì sẽ k có category nào
        })}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-6 h-6 mr-3 fill-current"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zM3.75 12h.007v.008H3.75V12zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm-.375 5.25h.007v.008H3.75v-.008zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
          />
        </svg>
        Tất cả danh mục
      </Link>
      <div className="bg-gray-400 h-[1px] my-3 "></div>
      <ul>
        {categories.map((categoryItem) => {
          const isActive = category === categoryItem._id;
          return (
            <li className="py-2 pl-2 hover:underline" key={categoryItem._id}>
              <Link
                to={{
                  pathname: path.home,
                  search: createSearchParams({
                    ...queryConfig,
                    category: categoryItem._id
                  }).toString()
                }}
                className={classNames("relative  text-base", {
                  "text-purple-600 font-semibold": isActive
                })}
              >
                {isActive && (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    className="w-4 h-4 fill-purple-600 absolute top-0 left-[-11px]"
                  >
                    <path
                      fillRule="evenodd"
                      d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
                <span className="ml-2"> {categoryItem.name}</span>
              </Link>
            </li>
          );
        })}
      </ul>

      {/* BỘ LỌC TÌM KIẾM         */}
      <Link
        to={path.home}
        className="flex items-center font-bold mt-10 uppercase text-sm"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-4 h-4 mr-2 fill-white"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 3c2.755 0 5.455.232 8.083.678.533.09.917.556.917 1.096v1.044a2.25 2.25 0 01-.659 1.591l-5.432 5.432a2.25 2.25 0 00-.659 1.591v2.927a2.25 2.25 0 01-1.244 2.013L9.75 21v-6.568a2.25 2.25 0 00-.659-1.591L3.659 7.409A2.25 2.25 0 013 5.818V4.774c0-.54.384-1.006.917-1.096A48.32 48.32 0 0112 3z"
          />
        </svg>
        Bộ lọc tìm kiếm
      </Link>
      <div className="bg-gray-400 h-[1px] my-4" />
      <div className="my-5">
        <div className="mt-10"> Khoảng giá </div>
        <form className="mt-4">
          <div className="flex items-center">
            <Input
              type="text"
              name="form"
              classNameInput="p-1 w-[100px] outline-none border border-gray-300 focus:border-gray-500 rounded-md focus:shadow-sm text-sm"
              placeholder="₫ TỪ"
            ></Input>
            <div className="mx-2 mb-6 shrink-0 ">--</div>
            <Input
              type="text"
              name="form"
              classNameInput="p-1 w-[100px] outline-none border border-gray-300 focus:border-gray-500 rounded-md focus:shadow-sm text-sm"
              placeholder="₫ ĐẾN"
            ></Input>
          </div>
          <Button className="w-full uppercase p-2 bg-purple-700 hover:bg-purple-700 text-white">
            ÁP DỤNG
          </Button>
        </form>
      </div>
      <div className="bg-gray-400 h-[1px] my-4" />
      <div className="text-md mt-10">Đánh giá</div>
      <RatingStar queryConfig={queryConfig}></RatingStar>
      <div className="bg-gray-400 h-[1px] my-4" />
      <Button onClick={handleRemoveAll} className="w-full bg-red-600 uppercase p-2 text-white mt-3 hover:bg-red-500">
        XÓA TẤT CẢ
      </Button>
    </div>
  );
};

export default AsideFilter;
