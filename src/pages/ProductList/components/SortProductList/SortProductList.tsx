import React from "react";

import classNames from "classnames";
import { useNavigate, Link } from "react-router-dom";
import { QueryConfig } from "../../ProductList";
import { createSearchParams } from "react-router-dom";
import { omit } from "lodash";
import { sortBy, order as orderConstant } from './../../../../constants/product';
import { ProductListConfig } from './../../../../types/product.type';
import path from './../../../../constants/path';

interface Props {
  queryConfig: QueryConfig;
  pageSize: number;
}

const SortProductList = ({ queryConfig, pageSize }: Props) => {
  const page = Number(queryConfig.page);
  const { sort_by = sortBy.createdAt, order } = queryConfig; // dụng destructuring assignment để trích xuất giá trị của thuộc tính sort_by từ queryConfig. Nếu thuộc tính sort_by không tồn tại trong queryConfig, giá trị mặc định sortBy.createdAt được sử dụng.
  const navigate = useNavigate(); // Thanh diều hướng link
  const isActiveSortBy = (
    sortByValue: Exclude<ProductListConfig["sort_by"], undefined>
  ) => {
    // => loại bỏ undefined bằng <Exclude>
    return sort_by === sortByValue; // sẽ active khi sortby bằng sortByValue
  };

  const handleSort = (
    sortByValue: Exclude<ProductListConfig["sort_by"], undefined>
  ) => {
    navigate({
      pathname: path.home,
      search: createSearchParams(
        omit(
          {
            ...queryConfig,
            sort_by: sortByValue
          },
          ["order"]
        )
      ).toString()
    });
  };

  const handlePriceOrder = (
    orderValue: Exclude<ProductListConfig["order"], undefined>
  ) => {
    navigate({
      pathname: path.home,
      search: createSearchParams({
        ...queryConfig,
        sort_by: sortBy.price,
        order: orderValue
      }).toString()
    });
  };

  return (
    <div className="bg-gray-400/40 py-4 px-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-2">
          <div className=""> Sắp xếp theo </div>
          <button
            className={classNames("h-8 px-4 text-sm capitalize", {
              "bg-pink-700 text-white hover:opacity-70": isActiveSortBy(
                sortBy.view
              ), // Khi active
              "bg-white text-black hover:bg-slate-100": !isActiveSortBy(
                sortBy.view
              ) // Khi ko active
            })}
            onClick={() => handleSort(sortBy.view)}
          >
            Phổ biến
          </button>
          <button
            className={classNames("h-8 px-4 text-sm capitalize", {
              "bg-pink-700 text-white hover:opacity-70": isActiveSortBy(
                sortBy.createdAt
              ), // Khi active
              "bg-white text-black hover:bg-slate-100": !isActiveSortBy(
                sortBy.createdAt
              ) // Khi ko active
            })}
            onClick={() => handleSort(sortBy.createdAt)}
          >
            Mới nhất
          </button>

          <button
            className={classNames("h-8 px-4 text-sm capitalize", {
              "bg-pink-700 text-white hover:opacity-70": isActiveSortBy(
                sortBy.sold
              ), // Khi active
              "bg-white text-black hover:bg-slate-100": !isActiveSortBy(
                sortBy.sold
              ) // Khi ko active
            })}
            onClick={() => handleSort(sortBy.sold)}
          >
            Bán Chạy
          </button>
          <select
            className={classNames(
              "h-8  px-4 text-left text-sm capitalize outline-none ",
              {
                "bg-purple text-black hover:bg-orange/80": isActiveSortBy(
                  sortBy.price
                ),
                "bg-white text-black hover:bg-slate-100": !isActiveSortBy(
                  sortBy.price
                )
              }
            )}
            value={order}
            onChange={(event) =>
              handlePriceOrder(
                event.target.value as Exclude<
                  ProductListConfig["order"],
                  undefined
                >
              )
            }
          >
            <option value="" disabled className="text-black">
              Giá
            </option>
            <option value={orderConstant.asc} className="bg-white text-black">
              Giá: Thấp đến cao
            </option>
            <option value={orderConstant.desc} className="bg-white text-black">
              Giá: Cao đến thấp
            </option>
          </select>
        </div>

        {/* PHÂN TRANG  */}
        <div className="flex items-center ">
          <div>
            <span className="text-purple-600 text-base">{page}</span>
            <span className="text-base text-black">/{pageSize}</span>
          </div>
          <div className="ml-2 flex">
            { page === 1 ? (
              <span className=" flex justify-center items-center px-3 h-8 rounded-tl-sm rounded-bl-sm bg-slate-400 cursor-not-allowed shadow-lg ">
                 <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-6 h-6"
              >
                <path
                  fillRule="evenodd"
                  d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z"
                  clipRule="evenodd"
                />
              </svg>
              </span>
            ): (
            <Link
              to={{
                pathname: path.home,
                search: createSearchParams({
                  ...queryConfig,
                  page: (page - 1).toString()
                }).toString()
              }}
              className=" flex justify-center items-center px-3 h-8 rounded-tl-sm rounded-bl-sm bg-white  shadow-lg "
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-6 h-6 mt-1"
              >
                <path
                  fillRule="evenodd"
                  d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z"
                  clipRule="evenodd"
                />
              </svg>
            </Link>
            )}


            { page === pageSize ? (
              <span className=" flex justify-center items-center px-3 h-8 rounded-tl-sm rounded-bl-sm bg-slate-400 cursor-not-allowed shadow-lg ">
                <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-6 h-6"
              >
                <path
                  fillRule="evenodd"
                  d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z"
                  clipRule="evenodd"
                />
              </svg>
              
              </span>
            ): (
            <Link
              to={{
                pathname: path.home,
                search: createSearchParams({
                  ...queryConfig,
                  page: (page + 1).toString()
                }).toString()
              }}
              className=" flex justify-center items-center px-3 h-8 rounded-tl-sm rounded-bl-sm bg-white  shadow-lg "
            >
               <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-6 h-6"
              >
                <path
                  fillRule="evenodd"
                  d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z"
                  clipRule="evenodd"
                />
              </svg>
            </Link>
            )}


{/* 
            <Link to='/' className="px-3 h-8 rounded-tl-sm rounded-bl-sm bg-white hover:bg-slate-200">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-6 h-6"
              >
                <path
                  fillRule="evenodd"
                  d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z"
                  clipRule="evenodd"
                />
              </svg>
            </Link> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SortProductList;
