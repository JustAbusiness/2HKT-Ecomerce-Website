import React from 'react'

const Footer = () => {
  return (
    <footer className='py-16 bg-neutral-100'>
      <div className='max-w-7xl mx-auto px-4'>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
          <div className='lg:col-span-1 lg:text-sm'>
            <div> @ 2023 2HKTShop. Tất cả các quyền được bảo lưu </div>
          </div>
          <div className='lg:col-span-2 lg:text-end lg:text-sm'> Quốc gia và khu vực: Việt nam và khu tao sống </div>
        </div>

        <div className='text-center text-xs mt-10'>
          <div> Công Ty THNN @2HKTShop </div>
          <div className='mt-6'> Địa chỉ: 29 Lý Phục Man, phường Bình Thuận, quận 7, thành phố Hồ Chí Minhg </div>
          <div className='mt-3'>Chịu Trách Nhiệm Quản Lý Nội Dung: Pham Ngoc Huy - Điện thoại: 0359221014 </div>
          <div className='mt-3'>
            Mã số doanh nghiệp: 19001000 do cơ sở kế hoạch & Đầu tư TP Hồ Chí Minh cấp lần đầu ngày 1/1/2023{' '}
          </div>
          <div className='mt-3'>@ 2023 - Bản quyền thuộc về Công ty TNHH 2HKTShop </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
