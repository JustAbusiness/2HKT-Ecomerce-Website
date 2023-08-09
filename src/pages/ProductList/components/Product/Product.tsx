import React from "react";
import { Link } from "react-router-dom";
import { Product as ProductType } from './../../../../types/product.type';
import { formatCurrency, formatNumberToSocialStyle, generateNameId } from './../../../../utils/utils';
import RatingProduct from './../../../../components/RatingProduct/RatingProduct';
import path from './../../../../constants/path';


interface Props {
  product: ProductType;       // Lấy từ bên product.type.ts
}
  
const Product = ({product}: Props) => {
  return (
    <Link to={`${path.home}${generateNameId({ name: product.name, id: product._id})}`}>
      <div className="bg-white shadow rounded-md hover:translate-y-[-0.0625rem] hover:shadow-md duration-100 transition-transform">
        <div className="w-full pt-[100%] relative">
          <img
            src={product.image}
            alt={product.name}
            className="absolute top-0 left-0 bg-white w-full h-full object-cover rounded-md"
          />
        </div>
        {/* DESCRIPTION */}
        <div className="p-2 overflow-hidden">
          <div className="min-h-[1.75rem] line-clamp-2 text-sm">
            {product.name}
          </div>
          <div className="flex item-center mt-3">
            <div className="line-through max-w-[50%] text-gray-500 truncate text-sm">
              {formatCurrency(product.price_before_discount)}
            </div>
            <div className="text-purple-600 truncate ml-2">
              <span className="text-xs">đ</span>
              <span>{formatCurrency(product.price)}</span>
            </div>
          </div>
          <div className="mt-3 flex items-center justify-start">
            <RatingProduct rating={product.rating}></RatingProduct>
            <div className="ml-2 text-sm">
                <span className="mr-1"> Đã bán</span>
                <span>{formatNumberToSocialStyle(product.sold)}</span>
            </div>
          </div>
          <div className="mt-2">
              <span className="text-xs text-gray-500"> Số lượng: <b>{product.quantity}</b></span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default Product;
