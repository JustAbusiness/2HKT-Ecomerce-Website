import type { RegisterOptions, UseFormGetValues } from "react-hook-form";
import * as yup from "yup";
// import { schema } from 'src/utils/rules';

type Rules = {
  [key in "email" | "password" | "confirm_password"]?: RegisterOptions;
};
export const getRules = (getValues?: UseFormGetValues<any>): Rules => ({
  email: {
    required: {
      value: true,
      message: "Please enter a valid email address"
    },
    pattern: {
      value: /^\S+@\S+\.\S+$/,
      message: "Email is not a valid email"
    },
    maxLength: {
      value: 160,
      message: "Email must be 5 - 160 characters"
    },
    minLength: {
      value: 5,
      message: "Email must be at least 5 characters"
    }
  },
  password: {
    required: {
      value: true,
      message: "Please enter your password"
    },
    maxLength: {
      value: 12,
      message: "Password must be 5 - 12 characters"
    },
    minLength: {
      value: 6,
      message: "Password must be at least 5 characters"
    }
  },
  confirm_password: {
    required: {
      value: true,
      message: "Please enter your password again"
    },
    maxLength: {
      value: 12,
      message: "Password must be 5 - 12 characters"
    },
    minLength: {
      value: 6,
      message: "Password must be at least 5 characters"
    },
    validate:
      typeof getValues === "function"
        ? (value) =>
            value === getValues("password") || "Your password do not match"
        : undefined
  }
});

const handleConfirmPasswordYup = (refString: string) => {
  return yup.string()
  .required(" Nhập lại password là bắt buộc")
  .min(6, "Độ dài từ 6 - 12 ký tự")
  .max(12, "Độ dài từ 6 - 12 ký tự")
  .oneOf([yup.ref(refString)], "Password nhập vào không khớp")
}

export const schema = yup
  .object({
    email: yup
      .string()
      .required("Email là bắt buộc")
      .email("Email không đúng định dạng")
      .min(5, "Độ dài từ 5 - 160 ký tự")
      .max(160, "Độ dài từ 5 - 160 ký tự"),

    password: yup
      .string()
      .required("Password là bắt buộc")
      .min(6, "Độ dài từ 6 - 12 ký tự")
      .max(12, "Độ dài từ 6 - 12 ký tự"),
    confirm_password: handleConfirmPasswordYup('password'),
    name: yup.string().trim().required(" Tên sản phẩm là bắt buộc ")
  })
  .required();

// const loginSchema = schema.omit(["confirm_password"]);


export const userSchema = yup.object({
  name: yup.string().max(160, "Độ dài tối đa là 160 ký tự"),
  phone: yup.string().max(20, "Độ dài tối đa số điện thoại là 20 ký tự"),
  address: yup.string().max(160, "Độ dài tối đa địa chỉ là 160 ký tự"),
  avatar: yup.string().max(1000, "Độ dài tối đa là 1000 ký tự"),
  date_of_birth: yup.date().max(new Date(), "Hãy chọn vào một ngày trong quá khứ"),
  password: schema.fields['password'],
  new_password: schema.fields['password'],
  confirm_password: schema.fields['confirm_password'],
});



export type Schema = yup.InferType<typeof schema>;
export type UserSchema = yup.InferType<typeof userSchema>;
// định nghĩa kiểu dữ liệu Schema và xuất nó để có thể được sử dụng ở bất kỳ đâu trong mã nguồn khác.
