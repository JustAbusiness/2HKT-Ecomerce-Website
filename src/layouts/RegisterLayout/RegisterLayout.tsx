import React from 'react'
import RegisterHeader from './../../components/RegisterHeader/index';
import Footer from './../../components/Footer/index';


interface Props {
  children?: React.ReactNode
}

const RegisterLayout = ({ children }: Props) => {
  return (
    <div>
      <RegisterHeader></RegisterHeader>
      {children}  
      <Footer></Footer>
      {/* children này đển lồng vào Route, lấy làm thẻ con của Register Layout */}
    </div>
  )
}

export default RegisterLayout
