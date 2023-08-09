import React, { useContext, useEffect, useMemo, useRef, useState } from "react";
import Input from "./../../../../components/Input/index";
import Button from "./../../../../components/Button/index";
import { useMutation, useQuery } from "@tanstack/react-query";
import userApi from "./../../../../apis/user.api";
import { UserSchema, userSchema } from "src/utils/rules";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import InputNumber from "./../../../../components/InputNumber/index";
import DateSelect from "./../../components/DateSelect/index";
import { toast } from "react-toastify";
import { AppContext } from 'src/contexts/app.context';
import { setProfileToLS } from "src/utils/auth";
import { getAvatarURL } from "src/utils/utils";
import { isAxiosUnprocessableEntityError } from "src/utils/utils";
import { ErrorResponse } from "src/types/utils.type";


type FormData = Pick<
  UserSchema,
  "name" | "address" | "avatar" | "date_of_birth" | "phone"
>;
type FormDataError = Omit<FormData, "date_of_birth"> & {
  date_of_birth?: string;
};

const profileSchema = userSchema.pick([
  "name",
  "address",
  "phone",
  "date_of_birth",
  "avatar"
]);

const Profile = () => {
  const { setProfile } = useContext(AppContext);
  const fileInputRef = useRef<HTMLInputElement>(null);    // LIÊN KẾT BUTTON ĐẾN INPUT:FILE
  const [file, setFile ] = useState<File>();             // LUXU TRỮ ẢNH UPLOAD
  const previewImage = useMemo(() => {              // XEM ẢNH TRƯỚC KHI CHỌN ẢNH ĐẠI DIỆN
    return file ? URL.createObjectURL(file) : '';
  }, [file]);


  const {
    register, 
    handleSubmit,
    control,
    setValue,
    watch,
    setError,
    formState: { errors }
  } = useForm<FormData>({
    defaultValues: {
      name: "",
      phone: "",
      address: "",
      avatar: "",
      date_of_birth: new Date(1900, 0, 1)
    },
    resolver: yupResolver(profileSchema) as any
  });

  const { data: profileData , refetch} = useQuery({
    queryKey: ["profile"],
    queryFn: userApi.getProfile
  });

  const profile = profileData?.data.data;          // GET API PROFILE DATA
  const updateProfileMutation = useMutation(userApi.updateProfile)      // GET URL API OF UPDATE PROFILE
  const uploadAvatarMutation = useMutation(userApi.uploadAvatar)            // GET URL API OF UPLOAD AVATAR

  useEffect(() => {
    if (profile) {
      setValue("name", profile.name);
      setValue("phone", profile.phone);
      setValue("avatar", profile.avatar);
      setValue("address", profile.address);
      setValue(
        "date_of_birth",
        profile.date_of_birth
          ? new Date(profile.date_of_birth)
          : new Date(1900, 0, 1)
      );
    }
  }, [profile, setValue]);

  const onSubmit = handleSubmit(async (data) => {
    console.log(data);
    try {
      let avatarName = avatar;
      if (file) {       // xem có ảnh nào đang upload k
        const form = new FormData()           // FormData là 1 API của javascript ko phải của Interface
        form.append('image', file)
        const uploadRes = await uploadAvatarMutation.mutateAsync(form)
        avatarName = uploadRes.data.data 
        setValue('avatar',avatarName);
      }

      const res = await updateProfileMutation.mutateAsync({
    ...data, date_of_birth: data.date_of_birth?.toISOString(),
      password: "",
      newPassword: "",
      __v: 0,
      avatar: avatarName,
      })
      toast.success(res.data.message);
      setProfile(res.data.data)
      setProfileToLS(res.data.data)
      refetch();
    } catch (error) {
      if (isAxiosUnprocessableEntityError<ErrorResponse<FormDataError>>(error)) {
        const formError = error.response?.data.data
        if (formError) {
          Object.keys(formError).forEach((key) => {
              setError(key as keyof FormDataError, {
                message: formError[key as keyof FormDataError],
                type: 'Server'
              })
          })
        }
    }
  }})

  // HANDLE UPLOAD PICTURE
  const onFileChange = (event: React.ChangeEvent<HTMLInputElement>)  => {
    const fileFromLocal = event.target.files?.[0]          // Lấy 1 ảnh  
    if (fileFromLocal && (fileFromLocal?.size > 1048576 || fileFromLocal.type.includes("images") )) {
      toast.error("Dung lượng tối đa là 1MB. Định dạng file là PNG/JPG file")
    } else {
      setFile(fileFromLocal)
    }
  }

  const handleUpload = () => {
    fileInputRef.current?.click()       // Bắt sự kiện upload ảnh
  }

  const avatar  = watch('avatar')


  return (
    <div className="rounded-sm bg-white px-2 md:px-7  pb-20 shadow-sm">
      <div className="border-b-2 border-gray-200 py-6">
        <h2 className="text-lg capitalize font-semibold text-gray-900">
          {" "}
          Hồ sơ của tôi
        </h2>
        <div className="mt-1 text-sm text-gray-700">
          {" "}
          Quản lý thông tin hồ sơ để bào mật tài khoản
        </div>
      </div>

      {/* THÔNG TIN CỤ THỂ  */}
      <form className="mt-8 flex flex-col-reverse items-center md:flex-row md:items-start" onSubmit={onSubmit}>
        <div className="mt-6 flex-grow pr-12 md:mt-0">
          <div className="flex flex-wrap ">
            <div className="w-[20%] truncate pt-3 text-right capitalize">
              Email:
            </div>
            <div className="w-[80%] pl-5 mb-2">
              <div className="pt-3 text-gray-700 font-semibold">
                {profile?.email}
              </div>
            </div>
          </div>

          <div className="mt-3 flex flex-wrap">
            <div className="w-[20%] truncate pt-3 text-right capitalize">
              Tên:
            </div>
            <div className="w-[50%] pl-5">
              <Input
                classNameInput="w-full rounded-md p-3 border border-gray-500 outline-none focus:border-gray-500 focus:shadow"
                register={register}
                name="name"
                placeholder="Tên"
                errorMessage={errors.name?.message}
              />
            </div>
          </div>

          <div className="mt-3 flex flex-wrap">
            <div className="w-[20%] truncate pt-3 text-right capitalize">
              Số điện thoại:
            </div>
            <div className="w-[50%] pl-5">
              <Controller
                control={control}
                name="phone"
                render={({ field }) => (
                  <InputNumber
                    type="number"
                    classNameInput="w-full rounded-md p-3 border border-gray-500 outline-none focus:border-gray-500 focus:shadow"
                    placeholder="Số điện thoại"
                    errorMessage={errors.phone?.message}
                    {...field}
                    onChange={field.onChange} // Điều này đảm bảo khi giá trị của thành phần InputNumber thay đổi, nó sẽ kích hoạt phương thức onChange được cung cấp bởi react-hook-form, cập nhật trạng thái của form một cách đúng đắn.
                  />
                )}
              ></Controller>
            </div>
          </div>

          <div className="mt-3 flex flex-wrap">
            <div className="w-[20%] truncate pt-3 text-right capitalize">
              Địa chỉ:
            </div>
            <div className="w-[50%] pl-5">
              <Input
                classNameInput="w-full rounded-md p-3 border border-gray-500 outline-none focus:border-gray-500 focus:shadow"
                register={register}
                name="address"
                placeholder="Địa chỉ"
                errorMessage={errors.address?.message}
              />
            </div>
          </div>

         {/* SET DATE,MONTH,YEAR */}
          <Controller
            control={control}
            name="date_of_birth"
            render={({ field }) => (
              <DateSelect value={field.value} onChange={field.onChange} errorMessage={errors.date_of_birth?.message} />         
            )}
          ></Controller>

          <div className="mt-6 flex items-center justify-start sm:justify-evenly">
            <div className="w-[20%] truncate pt-3 text-right capitalize"></div>
            <div className="sm:w-[50%] mt-5">
              <button
                type="submit"
                className="flex items-center h-9 bg-purple-600 px-5 text-white rounded-sm text-center text-base hover:bg-purple-600/80 transition-colors py-3"
              >
                Lưu
              </button>
            </div>
          </div>
        </div>

        {/* THAY ĐỔI ẢNH ĐẠI DIỆN */}
        <div className="flex justify-center md:w-72 md:h-auto md:border-l md:border-l-gray-400">
          <div className="flex flex-col items-center">
            <div className="my-5 h-24 w-24">
              <img
                src={ previewImage || getAvatarURL(avatar)}
                alt="avatar"
                className=" object-cover rounded-sm"
              />
            </div>
            <input className="hidden" type="file" accept=".jpg,.jpeg,.png" ref={fileInputRef} onChange={onFileChange} onClick={(event) => {(event.target as any).value = null}} />
            <button className="flex h-10 items-center justify-end rounded-sm border-2 bg-white px-6 text-sm text-gray-600 shadow-sm mt-7" onClick={handleUpload}>
              {" "}
              Chọn ảnh
            </button>
            <div className="mt-3 text-gray-400">
              <div>Dung lượng tối đa 1MB</div>
              <div>Định dạng: .JPEG, .PNG</div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Profile;
