import React from 'react'
import Header from './../../pages/Header/index'
import Footer from './../../components/Footer/index'

interface Props {
  children?: React.ReactNode
}

const MainLayout = ({ children }: Props) => {
  return (
    <div>
      <Header></Header>
      {children}
      <Footer></Footer>
    </div>
  )
}

export default MainLayout
