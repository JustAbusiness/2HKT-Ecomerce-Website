import React from 'react';
import CartHeader from '../../components/CartHeader/CartHeader';
import Footer from './../../components/Footer/index';

interface Props {
    children?: React.ReactNode
  }

export const CartLayout = ({children} : Props) => {
    return (
        <div>
            <CartHeader></CartHeader>
                {children}
            <Footer></Footer>
        </div>
    );
};

export default CartLayout;