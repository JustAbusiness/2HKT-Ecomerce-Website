import React, { useContext } from "react";
import path from "./../../../../constants/path";
import { Link } from "react-router-dom";
import { AppContext } from "src/contexts/app.context";
import userImage from "../../../../../public/avatar.jpg"
import { getAvatarURL } from "src/utils/utils";


const UserSideNav = () => {
  const { profile } = useContext(AppContext)

  return (
    <div className="px-4">
      <div className="flex items-center border-b-2 border-b-gray-300 py-4">
        <Link
          to={path.profile}
          className="h-12 w-12 flex-shrink-0 overflow-hidden rounded-full border-black/10 bg-white"
        >
          <img
            src={getAvatarURL(profile?.avatar)}
            alt="avatar"
            className="h-full w-full object-contain"
          />
        </Link>
        <div className="flex-grow pl-4">
          <div className="mb-1 truncate font-semibold text-gray-600">
            {profile?.email}
          </div>
          <Link
            to={path.profile}
            className="flex items-center capitalize text-gray-500 text-xs"
          >
            <span className="pr-1">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-3 h-4 text-black"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125"
                />
              </svg>
            </span>
            chỉnh sửa hồ sơ
          </Link>
        </div>
      </div>
      {/* TÀI KHOẢN CỦA TÔI  */}
      <div className="mt-7">
        <Link
          to={path.profile}
          className="flex items-center capitalize hover:text-purple-800 hover:font-semibold transition-colors mb-5 hover:translate-y-[-0.0625rem]"
        >
          <div className="flex  items-center font-medium text-sm">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-5 h-5 text-blue-400 mr-2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
              />
            </svg>
            Tài khoản của tôi
          </div>
        </Link>

        <Link
          to={path.historyPurchase}
          className="flex items-center capitalize hover:text-purple-800 hover:font-semibold transition-colors mb-5 hover:translate-y-[-0.0625rem]"
        >
          <div className="flex items-center font-medium text-sm">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-5 h-5 text-green-500 mr-2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z"
              />
            </svg>
            Đơn mua hàng
          </div>
        </Link>

        <Link
          to={path.changePassword}
          className="flex items-center capitalize hover:text-purple-800 hover:font-semibold transition-colors  hover:translate-y-[-0.0625rem]"
        >
          <div className="flex  items-center font-medium text-sm">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-5 h-5 text-red-500 mr-2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M7.864 4.243A7.5 7.5 0 0119.5 10.5c0 2.92-.556 5.709-1.568 8.268M5.742 6.364A7.465 7.465 0 004.5 10.5a7.464 7.464 0 01-1.15 3.993m1.989 3.559A11.209 11.209 0 008.25 10.5a3.75 3.75 0 117.5 0c0 .527-.021 1.049-.064 1.565M12 10.5a14.94 14.94 0 01-3.6 9.75m6.633-4.596a18.666 18.666 0 01-2.485 5.33"
              />
            </svg>
            Đổi mật khẩu
          </div>
        </Link>
      </div>
    </div>
  );
};

export default UserSideNav;
