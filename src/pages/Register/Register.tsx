import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { useMutation } from '@tanstack/react-query'
import { schema, Schema } from './../../utils/rules'
import { yupResolver } from '@hookform/resolvers/yup'
import Input from './../../components/Input/index'
import  authApi from './../../apis/auth.api'
import { omit } from 'lodash'
import { isAxiosUnprocessableEntityError } from 'src/utils/utils'
import { ErrorResponse } from './../../types/utils.type'
import { useContext } from 'react'
import { AppContext } from 'src/contexts/app.context'
import Button from './../../components/Button/index';


type FormData = Pick<Schema, 'email' | 'password' | 'confirm_password'>
const registerSchema = schema.pick(['email', 'password', 'confirm_password'])

const Register = () => {
  const { setIsAuthenticated, setProfile} = useContext(AppContext)
  const navigate = useNavigate()
  
  const {
    register,
    handleSubmit,
    // getValues,
    // watch,
    setError,
    formState: { errors }
  } = useForm<FormData>({
    resolver: yupResolver(registerSchema)
  })

  /*   ==== GỌI API Register CÙNG VỚI HANDLESUBMIT   ====   */
  const registerAccountMutation = useMutation({
    // sử dụng để khởi tạo một mutation mới và cung cấp các tùy chọn và callback để xử lý kết quả mutation.
    mutationFn: (body: Omit<FormData, 'confirm_password'>) => authApi.registerAccount(body)
  })

  // const rules = getRules(getValues)

  const onSubmit = handleSubmit((data) => {
    const body = omit(data, ['confirm_password'])
    registerAccountMutation.mutate(body, {
      onSuccess: (data) => {
        setIsAuthenticated(true)
        setProfile(data.data.data.user)
        navigate('/')
      },
      onError: (error) => {
        if (isAxiosUnprocessableEntityError<ErrorResponse<Omit<FormData, 'confirm_password'>>>(error)) {
          const formError = error.response?.data.data
          if (formError) {
            Object.keys(formError).forEach((key) => {
              setError(key as keyof Omit<FormData, 'confirm_password'>, {
                message: formError[key as keyof Omit<FormData, 'confirm_password'>],
                type: 'Server'
              })
            })
          }

        }
      }
    })
  })

  // const value = watch()
  // console.log(value)
  // const formValue = watch('password') // Lấy giá trị password để đối chiếu vs confirm_password
  // console.log(formValue)

  return (
    <div className='background-image'>
      <div className='max-w-7xl mx-auto px-4'>
        <div className='grid grid-cols-1 py-12 lg:grid-cols-5 lg:py-32 lg:pr-10'>
          <div className='lg:col-span-2 lg:col-start-4'>
            {/* "col-start-4" chỉ định rằng item sẽ bắt đầu từ cột thứ 4 trong grid container. */}
            <form className='p-10 bg-white rounded shadow-sm' onSubmit={onSubmit} noValidate>
              <div className='tetx-2xl text-center'>Đăng ký</div>
              <Input
                name='email'
                register={register}
                type='email'
                className='mt-8'
                errorMessage={errors.email?.message}
                // rules={rules.email}
                placeholder='Email'
              ></Input>
              {/* /* LÀM TƯƠNG TỰ NHƯ CÁI INPUT Ở TRÊN CHO CÁC PASSWORD VÀ CONFIRM_PASSWORD */}

              <div className='mt-5'>
                <input
                  type='password'
                  className='p-3 w-full outline-none border border-gray-300 focus:border-gray-500 rounded-md focus:shadow-sm'
                  placeholder='Password'
                  autoComplete='on'
                  {...register('password')}
                />
                <div className='text-red-600 min-h-[1.25rem] text-sm mt-1'>{errors.password?.message}</div>
              </div>
              <div className='mt-5'>
                <input
                  type='password'
                  className='p-3 w-full outline-none border border-gray-300 focus:border-gray-500 rounded-md focus:shadow-sm'
                  placeholder='Confirm Password'
                  autoComplete='on'
                  {...register('confirm_password', {
                    // ...rules.confirm_password
                  })}
                />
                <div className='text-red-600 min-h-[1.25rem] text-sm mt-1'>{errors.confirm_password?.message}</div>
              </div>
              <div className='mt-3'>
                <Button
                  type='submit'
                  className='w-full text-center py-4 px-2 uppercase bg-purple-600 text-white text-lg rounded-sm hover:bg-purple-500 flex justify-center items-center'
                  isLoading={registerAccountMutation.isLoading}
                  disabled={registerAccountMutation.isLoading}
                >
                  Đăng ký
                </Button>
              </div>

              <div className='mt-8 text-center'>
                <div className='flex justify-center items-center'>
                  <span className='text-slate-400 mr-1'>Bạn đã có tài khoản hay chưa ?</span>
                  <Link to='/login' className='text-sm text-purple-600 hover:underline'>
                    Đăng nhập
                  </Link>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Register
