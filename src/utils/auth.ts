// NƠI LƯU CHỮA TOKEN
import { User } from "./../types/user.type";

export const LocalStorageEventTarget = new EventTarget()  //EventTarget là một lớp được tích hợp sẵn trong môi trường JavaScript của trình duyệt, và nó được sử dụng như một mục tiêu sự kiện chung để các trình lắng nghe sự kiện có thể được gắn vào. Nó cho phép bạn tạo hệ thống sự kiện tùy chỉnh cho ứng dụng của bạn.

export const setAccessTokenToLS = (access_token: string) => {
  localStorage.setItem("access_token", access_token);
};

export const clearAccessTokenToLS = () => {
  localStorage.removeItem("access_token");
  localStorage.removeItem("profile");
  const clearLocalSEvent =  new Event('clearLS');
  LocalStorageEventTarget.dispatchEvent(clearLocalSEvent)   // Khi sự kiện này được gửi, bất kỳ trình lắng nghe sự kiện nào đã được đăng ký với LocalStorageEventTarget và có tên tương ứng là 'clearLS' sẽ được kích hoạt.
};

// LẤY TOKEN TỪ LOCAL STORAGE
export const getAccessTokenFromLS = () =>
  localStorage.getItem("access_token") || "";

// LẤY TÊN NGƯỜI DÙNG TRONG LOCAL STORAGE
export const getProfileFromLS = () => {
  const result = localStorage.getItem("profile");
  return result ? JSON.parse(result) : null;
};

export const setProfileToLS = (profile: User) => {
  localStorage.setItem("profile", JSON.stringify(profile)); // setProfile laf object nên phải parse string
};


     
