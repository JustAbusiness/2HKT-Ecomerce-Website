import React from "react";
import classNames from "classnames";
import { QueryConfig } from "src/pages/ProductList/ProductList";
import { Link, createSearchParams } from "react-router-dom";
import path from "./../../constants/path";

interface Props {
  queryConfig: QueryConfig;
  pageSize: number;
}

const RANGE = 2;

const Paginate = ({ queryConfig, pageSize }: Props) => {
  const page = Number(queryConfig.page); // => chuển sang number

  const renderPagination = () => {
    let dotAfter = false;
    let dotBefore = false;
    const renderDotBefore = (index: number) => {
      if (!dotBefore) {
        // Nếu không phải trang đầu tiên hoặc trang cuối cùng và trước đó chưa xuất hiện dấu chấm ba chấm, thì biến dotBefore được đặt thành true và trả về một nút chứa dấu chấm ba chấm.
        dotBefore = true;
        return (
          <span
            className="bg-white rounded px-3 py-2 shadow-sm mx-2 cursor-pointer border"
            key={index}
          >
            ...
          </span>
        );
      }
      return null;
    };
    const renderDotAfter = (index: number) => {
      if (!dotAfter) {
        //Nếu không phải trang đầu tiên hoặc trang cuối cùng và trước đó chưa xuất hiện dấu chấm ba chấm, thì biến dotBefore được đặt thành true và trả về một nút chứa dấu chấm ba chấm.
        dotAfter = true;
        return (
          <span
            className="bg-white rounded px-3 py-2 shadow-sm mx-2 cursor-pointer border"
            key={index}
          >
            ...
          </span>
        );
      }
      return null;
    };

    return Array(pageSize)
      .fill(0)
      .map((_, index) => {
        const pageNumber = index + 1;
        if (
          page <= RANGE * 2 + 1 && // page < 5
          pageNumber > page + RANGE &&
          pageNumber < page - RANGE + 1
        ) {
          return renderDotAfter(index);
        } else if (page > RANGE * 2 + 1 && page < pageSize - RANGE * 2) {
          if (pageNumber < page - RANGE && pageNumber > RANGE) {
            return renderDotBefore(index);
          } else if (
            pageNumber > page + RANGE &&
            pageNumber < pageSize - RANGE + 1
          ) {
            return renderDotAfter(index);
          }
        } else if (
          page > pageSize - RANGE * 2 &&
          pageNumber > RANGE &&
          pageNumber < page - RANGE
        ) {
          return renderDotBefore(index);
        }

        return (
          <Link
            to={{
              pathname: path.home,
              search: createSearchParams({
                ...queryConfig,
                page: pageNumber.toString()
              }).toString()
            }} // => tạo url
            className={classNames(
              "bg-white rounded px-3 py-2 shadow-sm mx-2 cursor-pointer border",
              {
                "border-cyan-500": pageNumber === page, // Khi Active
                "border-transparent": pageNumber !== page
              }
            )}
            key={index}
          >
            {pageNumber}
          </Link>
        );
      });
  };

  return (
    <div className="flex flex-wrap mt-6 justify-center">
      {page === 1 ? (
        <button className="bg-white/60 rounded px-3 py-2 shadow-sm mx-2 cursor-not-allowed border">
          Prev
        </button>
      ) : (
        <Link
          to={{
            pathname: path.home,
            search: createSearchParams({
              ...queryConfig,
              page: (page - 1).toString()
            }).toString()
          }}
          className="bg-white rounded px-3 py-2 shadow-sm mx-2  border"
        >
          Prev
        </Link>
      )}

      {/* STATRT --- XỬ LÝ PHÂN TRANG CHÍNH */}

      {renderPagination()}

      {/* ENDING --- XỬ LÝ PHÂN TRANG CHÍNH */}
      
      {page === pageSize ? (
        <button className="bg-white/60 rounded px-3 py-2 shadow-sm mx-2 cursor-not-allowed border">
          Next
        </button>
      ) : (
        <Link
          to={{
            pathname: path.home,
            search: createSearchParams({
              ...queryConfig,
              page: (page +  1).toString()
            }).toString()
          }}
          className="bg-white rounded px-3 py-2 shadow-sm mx-2 border"
        >
          Next
        </Link>
      )}
    </div>
  );
};

export default Paginate;
