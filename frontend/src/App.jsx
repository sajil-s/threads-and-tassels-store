import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import MainLayout from "./components/layout/MainLayout";
import IntroAnimation from "./components/layout/IntroAnimation";
import Home from "./pages/Home";
import Products from "./pages/Products";
import Register from "./pages/Register";
import Login from "./pages/Login";
import GuestRoute from "./components/auth/GuestRoute";
import Account from "./pages/Account";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import MyOrders from "./pages/MyOrders";
import OrderDetails from "./pages/OrderDetails";
import Categories from "./pages/Categories";
import Trending from "./pages/Trending";
import ScrollToTop from "./components/common/ScrollToTop";
import ProductDetails from "./pages/ProductDetails";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import AdminRoute from "./components/auth/AdminRoute";
import AdminLayout from "./components/admin/AdminLayout";
import Dashboard from "./pages/admin/Dashboard";
import AdminProducts from "./pages/admin/AdminProducts";
import AddProduct from "./pages/admin/AddProduct";
import EditProduct from "./pages/admin/EditProduct";
import AdminOrders from "./pages/admin/AdminOrders";




function App() {
  const [showIntro, setShowIntro] = useState(() => {
    return !sessionStorage.getItem("threads-intro-shown");
  });

  useEffect(() => {
    if (!showIntro) return;

    const timer = setTimeout(() => {
      sessionStorage.setItem("threads-intro-shown", "true");
      setShowIntro(false);
    }, 2800);

    return () => clearTimeout(timer);
  }, [showIntro]);

  return (
    <BrowserRouter>
     <ScrollToTop />
      <IntroAnimation show={showIntro} />

      <Routes>
        <Route element={<MainLayout />}>
          <Route element={<GuestRoute />}>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Route>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<Products />} />
          <Route path="/categories" element={<Categories />} />
         <Route path="/trending" element={<Trending />} />
         <Route path="/products/:id" element={<ProductDetails />} />

          <Route element={<ProtectedRoute />}>
           
            <Route path="/account" element={<Account />} />
         <Route path="/account/orders" element={<MyOrders />} />
          <Route path="/account/orders/:orderId" element={<OrderDetails />} />
           <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />

          </Route>
        </Route>

<Route element={<AdminRoute />}>
  <Route element={<AdminLayout />}>
    <Route path="/admin" element={<Dashboard />} />
 <Route path="/admin/products" element={<AdminProducts />} />
 <Route path="/admin/products/new" element={<AddProduct />} />
<Route path="/admin/products/:id/edit" element={<EditProduct />} />
<Route path="/admin/orders" element={<AdminOrders />} />


  </Route>
</Route>
        
      </Routes>
    </BrowserRouter>
  );
}

export default App;
