import { createBrowserRouter, Outlet, RouterProvider } from "react-router"

import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ProductDetails from "./pages/ProductDetails";
import AddProduct from "./admin/AddProduct";
import EditProduct from "./admin/EditProduct";
import ProductList from "./admin/ProductList";
import Dashboard from "./admin/Dashboard";
import Cart from "./pages/Cart";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import AdminNav from "./admin/AdminNav";
import CheckoutAddress from "./pages/CheckoutAddress";
import Checkout from "./pages/CheckoutCart";
import OrderSuccess from "./pages/OrderSuccess";
import BuyNowCheckout from "./pages/BuyNowCheckout";
import MyOrder from "./pages/MyOrder";
import OrderProductDetails from "./pages/OrderProductDetails";
import AllProduct from "./pages/AllProducts";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";

function getUser() {
  try { return JSON.parse(localStorage.getItem("user")); }
  catch { return null; }
}

function StoreLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-cream">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

function AdminLayout() {
  const user = getUser();
  return (
    <div className="min-h-screen flex flex-col bg-cream">
      <AdminNav adminName={user?.name} />
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  );
}

const router = createBrowserRouter([
  {
    element: <StoreLayout />,
    children: [
      { path: "/",                    element: <Home /> },
      { path: "/login",               element: <Login /> },
      { path: "/signup",              element: <Signup /> },
      { path: "/product/:id",         element: <ProductDetails /> },
      { path: "/cart",                element: <Cart /> },
      { path: "/checkout-address",    element: <CheckoutAddress /> },
      { path: "/checkout",            element: <Checkout /> },
      { path: "/order-success/:id",   element: <OrderSuccess /> },
      { path: "/buy-now/:id",         element: <BuyNowCheckout /> },
      { path: "/myorders",            element: <MyOrder /> },
      { path: "/order/:id",           element: <OrderProductDetails /> },
      { path: "/all-products",        element: <AllProduct /> },
      { path: "/forgot-password",        element: <ForgotPassword /> },
      { path: "/reset-password/:token", element: <ResetPassword /> },
    ],
  },
  {
    element: <AdminLayout />,
    children: [
      { path: "/admin/product/add",   element: <AddProduct /> },
      { path: "/admin/product/edit/:id", element: <EditProduct /> },
      { path: "/admin/product",       element: <ProductList /> },
      { path: "/admin/dashboard",     element: <Dashboard /> },
    ],
  },
]);

export default function App() {
  return <RouterProvider router={router} />;
}
