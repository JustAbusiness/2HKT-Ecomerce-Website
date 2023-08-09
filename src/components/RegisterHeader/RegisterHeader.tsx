import React from 'react'
import { Link, useMatch } from 'react-router-dom'

const RegisterHeader = () => {
  const registerMatch = useMatch('/register')
  const isRegister = Boolean(registerMatch)

  return (
    <header className='py-5'>
      <div className='max-w-7xl mx-auto px-4'>
        <nav className='flex items-end'>
          <Link to='/'>
            <img src='../../../public/Logo (1).png' alt='logo' className='h-11 lg:h-14 ' />
          </Link>
          <div className='ml-5 text-lg lg:text-xl py-2'>{isRegister ? 'Đăng ký' : 'Đăng nhập'}</div>
        </nav>
      </div>
    </header>
  )
}

export default RegisterHeader
