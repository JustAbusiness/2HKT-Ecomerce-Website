import React from "react";
import Input from "./../../../../components/Input/index";
import { UserSchema, userSchema } from "src/utils/rules";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useMutation } from "@tanstack/react-query";
import userApi from 'src/apis/user.api'
import omit from "lodash/omit";
import { toast } from "react-toastify";
import { isAxiosUnprocessableEntityError } from "src/utils/utils";
import { ErrorResponse } from "src/types/utils.type";
import Button from "src/components/Button";

type FormData = Pick<
  UserSchema,
  'password' | 'new_password' | 'confirm_password'
>;
const passwordSchema = userSchema.pick([
  "password",
  "new_password",
  "confirm_password"
]);

export default function ChangePassword() {
  const {
    register,
    formState: { errors },
    handleSubmit,
    setError,
    reset
  } = useForm<FormData>({
    defaultValues: {
      password: "",
      confirm_password: "",
      new_password: ""
    },
    resolver: yupResolver(passwordSchema)
  });
  const updateProfileMutation = useMutation(userApi.updateProfile);

  const onSubmit = handleSubmit(async (data) => {
    try {
      const res = await updateProfileMutation.mutateAsync(
        omit(data, ["confirm_password"])
      );
      toast.success(res.data.message);
      reset(); //Hàm này có thể là một hàm để đặt lại giá trị của các trường trong form sau khi nó đã được gửi thành công.
    } catch (error) {
      if (isAxiosUnprocessableEntityError<ErrorResponse<FormData>>(error)) {
        // Đây là một câu lệnh điều kiện. Nó kiểm tra xem lỗi có phải là một AxiosError và có trạng thái HTTP là Unprocessable Entity hay không. Hàm isAxiosUnprocessableEntityError được gọi để kiểm tra điều kiện này.
        const formError = error.response?.data.data; //Đoạn này lấy thông tin lỗi từ phản hồi (response) của lỗi, giả sử rằng thông tin lỗi được lưu trữ trong trường data.data của response. Biến formError sẽ chứa đối tượng data trong phản hồi của lỗi nếu có.
        if (formError) {
          Object.keys(formError).forEach((key) => {
            setError(key as keyof FormData, {
              message: formError[key as keyof FormData],
              type: "Server"
            });
            //key là tên của trường bị lỗi, keyof FormData giúp đảm bảo rằng key là một trường hợp hợp lệ trong kiểu dữ liệu của form (FormData). { message: formError[key as keyof FormData], type: 'Server' } là đối tượng lỗi được truyền vào hàm setError. Thông báo lỗi được lấy từ giá trị của từng trường trong đối tượng formError và đặt loại lỗi là "Server" để chỉ ra rằng đây là lỗi từ máy chủ.
          });
        }
      }
    }
  });

  return (
    <div className="rounded-sm bg-white px-2 pb-10 shadow md:px-7 md:pb-20">
      <div className="border-b border-b-gray-200 py-6">
        <h1 className="text-lg font-medium capitalize text-gray-900">
          Đổi mật khẩu
        </h1>
        <div className="mt-1 text-sm text-gray-700">
          Quản lý thông tin hồ sơ để bảo mật tài khoản
        </div>
      </div>
      <form className="mt-8 mr-auto max-w-2xl" onSubmit={onSubmit}>
        <div className="mt-6 flex-grow md:mt-0 md:pr-12">
          <div className="mt-2 flex flex-col flex-wrap sm:flex-row">
            <div className="truncate pt-3 capitalize sm:w-[20%] sm:text-right">
              Mật khẩu cũ
            </div>
            <div className="sm:w-[80%] sm:pl-5">
              <Input
                classNameInput="w-full rounded-sm border border-gray-300 px-3 py-2 outline-none focus:border-gray-500 focus:shadow-sm"
                className="relative "
                register={register}
                name="password"
                type="password"
                placeholder="Mật khẩu cũ"
                errorMessage={errors.password?.message}
              />
            </div>
          </div>
          <div className="mt-2 flex flex-col flex-wrap sm:flex-row">
            <div className="truncate pt-3 capitalize sm:w-[20%] sm:text-right">
              Mật khẩu mới
            </div>
            <div className="sm:w-[80%] sm:pl-5">
              <Input
                classNameInput="w-full rounded-sm border border-gray-300 px-3 py-2 outline-none focus:border-gray-500 focus:shadow-sm"
                className="relative "
                register={register}
                name="new_password"
                type="password"
                placeholder="Mật khẩu mới"
                errorMessage={errors.new_password?.message}
              />
            </div>
          </div>
          <div className="mt-2 flex flex-col flex-wrap sm:flex-row">
            <div className="truncate pt-3 capitalize sm:w-[20%] sm:text-right">
              Nhập lại mật khẩu
            </div>
            <div className="sm:w-[80%] sm:pl-5">
              <Input
                classNameInput="w-full rounded-sm border border-gray-300 px-3 py-2 outline-none focus:border-gray-500 focus:shadow-sm"
                className="relative "
                register={register}
                name="confirm_password"
                type="password"
                placeholder="Nhập lại mật khẩu"
                errorMessage={errors.confirm_password?.message}
              />
            </div>
          </div>
          <div className="mt-2 flex flex-col flex-wrap sm:flex-row">
            <div className="truncate pt-3 capitalize sm:w-[20%] sm:text-right" />
            <div className="sm:w-[80%] sm:pl-5">
              <Button
                className="flex h-9 items-center rounded-sm bg-purple-600 px-5 text-center text-sm text-white hover:bg-orange/80"
                type="submit"
              >
                Lưu
              </Button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
