import { useRoutes, Outlet, Navigate } from "react-router-dom";
import ProductList from "./pages/ProductList/ProductList";
import Login from "./pages/Login/Login";
import Register from "./pages/Register";
import RegisterLayout from "./layouts/RegisterLayout";
import MainLayout from "./layouts/MainLayout/index";
import { AppContext } from "./contexts/app.context";
import { useContext } from "react";
import path from "src/constants/path";
import ProductDetail from "./pages/ProductDetail/index";
import Cart from "./pages/Cart/Cart";
import CartLayout from "./layouts/CartLayout/index";
import UserLayout from "./pages/User/Layouts/UserLayout/index";
import ChangePassword from "./pages/User/pages/ChangePassword/ChangePassword";
import HistoryPurchase from "./pages/User/pages/HistoryPurchase/index";
import Profile from "./pages/User/pages/Profile/Profile";
import PageNotFound from './pages/PageNotFound/index';

// CODE NGĂN CHẶN ROUTE
function ProtectedRoute() {
  const { isAuthenticated } = useContext(AppContext);
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" />;
}

// CHƯA LOGIN, ĐĂNG NHẬP
function RejectedRoute() {
  const { isAuthenticated } = useContext(AppContext);
  return !isAuthenticated ? <Outlet /> : <Navigate to="/" />;
}

const useRouteElement = () => {
  const routeElements = useRoutes([
    {
      path: "",
      element: <RejectedRoute />, // ĐÃ LOGIN RÙI THÌ ĐC KO VÀO LOGIN HAY ĐĂNG KÝ NỮA
      children: [
        {
          path: path.login,
          element: (
            <RegisterLayout>
              <Login></Login>
            </RegisterLayout>
          ) // Login là children của Register Layout
        },
        {
          path: path.register,
          element: (
            <RegisterLayout>
              <Register></Register>
            </RegisterLayout>
          )
        }
      ]
    },
    {
      path: "",
      element: <ProtectedRoute />,
      children: [
        {
          path: path.cart,
          index: true,
          element: (
            <CartLayout>
              <Cart></Cart>
            </CartLayout>
          )
        },
        {
          path: path.user,
          element: (
            <MainLayout>
              <UserLayout></UserLayout>
            </MainLayout>
          ),
          children: [
            {
              path: path.profile,
              index: true,
              element: <Profile></Profile>
            },
            {
              path: path.changePassword,
              index: true,
              element: <ChangePassword></ChangePassword>
            },
            {
              path: path.historyPurchase,
              index: true,
              element: <HistoryPurchase></HistoryPurchase>
            }
          ]
        }
      ]
    },
    {
      path: path.productDetail,
      index: true,
      element: (
        <MainLayout>
          <ProductDetail></ProductDetail>
        </MainLayout>
      )
    },
    {
      path: "",
      index: true,
      element: (
        <MainLayout>
          <ProductList></ProductList>
        </MainLayout>
      )
    }, 
    {
      path: "*",
      element: (
        <MainLayout>
            <PageNotFound></PageNotFound>
        </MainLayout>
      )
    }
  ]);
  return routeElements;
};

export default useRouteElement;
