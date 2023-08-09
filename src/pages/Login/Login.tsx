import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'
import { yupResolver } from '@hookform/resolvers/yup'
import { schema, Schema } from 'src/utils/rules'
import { useMutation } from '@tanstack/react-query'
import { isAxiosUnprocessableEntityError } from 'src/utils/utils'
import { ErrorResponse } from './../../types/utils.type'
import Input from './../../components/Input/index'
import { useContext } from 'react'
import { AppContext } from './../../contexts/app.context'
import Button from './../../components/Button/index';
import authApi from './../../apis/auth.api';

// type FormData = Omit<Schema, 'confirm_password'>
// const LoginSchema = schema.omit(['confirm_password'])
type FormData = Pick<Schema, 'email' | 'password'>
const loginSchema = schema.pick(['email', 'password'])

const Login = () => {
  const { setIsAuthenticated, setProfile } = useContext(AppContext)
  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors }
  } = useForm<FormData>({
    resolver: yupResolver(loginSchema)
  })

  /*   ==== GỌI API LOGIN CÙNG VỚI HANDLESUBMIT   ====   */
  const LoginMutation = useMutation({
    // sử dụng để khởi tạo một mutation mới và cung cấp các tùy chọn và callback để xử lý kết quả mutation.
    mutationFn: (body: Omit<FormData, 'confirm_password'>) => authApi.login(body)
  })

  const onSubmit = handleSubmit((data) => {
    LoginMutation.mutate(data, {
      // Xử lý authenticate sau khi đăng nhajao thành công
      onSuccess: (data) => {
        setIsAuthenticated(true)
        setProfile(data.data.data.user)        // Lấy tên người dùng
        navigate('/')

      },
      onError: (error) => {
        // Xử lý Email đã tồn tại
        if (isAxiosUnprocessableEntityError<ErrorResponse<FormData>>(error)) {
          const formError = error.response?.data.data
          if (formError?.email) {
            setError('email', {
              message: formError.email,
              type: 'Server'
            })
          }
          if (formError?.password) {
            setError('password', {
              message: formError.password,
              type: 'Server'
            })
          }
        }
      }
    })
  })

  return (
    <div className="background-image">
      <div className='max-w-7xl mx-auto px-4'>
        <div className='grid grid-cols-1 py-12 lg:grid-cols-5 lg:py-32 lg:pr-10'>   
          <div className='lg:col-span-2 lg:col-start-4'>
            {/* "col-start-4" chỉ định rằng item sẽ bắt đầu từ cột thứ 4 trong grid container. */}
            <form className='p-10 bg-white rounded shadow-sm' onSubmit={onSubmit} noValidate>
              <div className='tetx-2xl text-center'>Đăng nhập</div>
              <Input
                name='email'
                register={register}
                type='email'
                className='mt-8'
                errorMessage={errors.email?.message}
                // rules={rules.email}
                placeholder='Email'
              ></Input>
              <Input
                name='password'
                register={register}
                type='password'
                className='mt-3'
                errorMessage={errors.password?.message}
                placeholder='Password'
                autoComplete='on'
              ></Input>
              <div className='mt-3'>
                <Button
                  type='submit'
                  className='w-full text-center py-4 px-2 uppercase bg-purple-600 text-white text-lg rounded-sm hover:bg-purple-500 flex justify-center items-center'
                  isLoading={LoginMutation.isLoading}
                  disabled={LoginMutation.isLoading}
                 
                >
                  Đăng nhập
                </Button>
              </div>

              <div className='mt-8 text-center'>
                <div className='flex justify-center items-center'>
                  <span className='text-slate-400 mr-1'>Bạn chưa có tài khoản?</span>
                  <Link to='/register' className='text-sm text-purple-600 hover:underline'>
                    Đăng ký
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

export default Login
