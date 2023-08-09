import axios, { AxiosError, type AxiosInstance } from "axios";
import { isAxiosUnprocessableEntityError } from "src/utils/utils";
import { HttpStatusCode } from "src/constants/httpStatusCode.enum";
import { toast } from "react-toastify";
import { AuthResponse } from "src/types/auth.type";
import {
  clearAccessTokenToLS,
  getAccessTokenFromLS,
  setAccessTokenToLS,
  setProfileToLS
} from "./auth";

class Http {
  instance: AxiosInstance;
  private accessToken: string; // Lưu token vào storage
  constructor() {
    this.accessToken = getAccessTokenFromLS();
    this.instance = axios.create({
      baseURL: 'https://api-ecom.duthanhduoc.com/',
      timeout: 1000,
      headers: {
        "Content-Type": "application/json"
      }
    });

    this.instance.interceptors.request.use(
      (config) => {
        if (this.accessToken && config.headers) {
          config.headers.authorization = this.accessToken;
          return config;
          //Đoạn mã trên cho phép bạn tự động thêm access token vào header của mỗi yêu cầu gửi từ client trước khi yêu cầu được gửi đi. Điều này có thể hữu ích khi bạn cần xác thực yêu cầu bằng access token trong server.
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    this.instance.interceptors.response.use(
      (response) => {
        const { url } = response.config;
        if (url === "/login" || url === "/register") {
          const data = response.data as AuthResponse
          // Khi đănh nhập thành công hoặc đăng ký
          this.accessToken = data.data.access_token;
          setAccessTokenToLS(this.accessToken); // Lưu token vào storage
          setProfileToLS(data.data.user);
        } else if (url === "/logout") {
          this.accessToken = "";
          clearAccessTokenToLS(); // Xóa toke sau khi người dùng logout ra ngoài
        }
        return response;
      },

      function (error: AxiosError) {
        if (error.response?.status !== HttpStatusCode.UnprocessableEntity) {
          const data: any | undefined = error.response?.data;
          const message = data?.message || error.message;
          toast.error(message); // In Lỗi ra màn hình nếu có
        }

        if (error.response?.status  === HttpStatusCode.Unauthorized) {     // => Unauthorized = 401
          clearAccessTokenToLS()
        }  
        return Promise.reject(error);
      }
    );
  }
}

const http = new Http().instance;

export default http;
