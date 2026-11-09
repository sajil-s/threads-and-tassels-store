import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import FlowerLoader from "./components/common/FlowerLoader";
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
import AdminOrderDetails from "./pages/admin/OrderDetails";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminUserDetails from "./pages/admin/AdminUserDetails";
import AdminOffers from "./pages/admin/AdminOffers";
import Contact from "./pages/Contact";
import Terms from "./pages/Terms";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import RefundPolicy from "./pages/RefundPolicy";
import ShippingPolicy from "./pages/ShippingPolicy";
import AboutUs from "./pages/AboutUs";



function App() {
  const { loading: authLoading } = useAuth();

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

      {/* <IntroAnimation show={showIntro} /> */}

      {authLoading ? (
        <FlowerLoader
          variant="page"
          showBrand
          label="Loading"
        />
      ) : (
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
             <Route path="/contact" element={<Contact />} />
              <Route path="/terms-and-conditions" element={<Terms />} />
              <Route path="/privacy-policy" element={<PrivacyPolicy />} />
              <Route path="/refund-policy" element={<RefundPolicy />} />
             <Route path="/shipping-policy" element={<ShippingPolicy />} />
            <Route path="/about" element={<AboutUs />} />

              
            <Route element={<ProtectedRoute />}>
              <Route path="/account" element={<Account />} />
              <Route path="/account/orders" element={<MyOrders />} />
              <Route
                path="/account/orders/:orderId"
                element={<OrderDetails />}
              />
              <Route path="/cart" element={<Cart />} />
              <Route path="/checkout" element={<Checkout />} />
            </Route>
          </Route>

          <Route element={<AdminRoute />}>
            <Route element={<AdminLayout />}>
              <Route path="/admin" element={<Dashboard />} />
              <Route path="/admin/products" element={<AdminProducts />} />
              <Route path="/admin/products/new" element={<AddProduct />} />
              <Route
                path="/admin/products/:id/edit"
                element={<EditProduct />}
              />
              <Route path="/admin/orders" element={<AdminOrders />} />
              <Route
                path="/admin/orders/:orderId"
                element={<AdminOrderDetails />}
              />
              <Route path="/admin/users" element={<AdminUsers />} />
              <Route
                path="/admin/users/:userId"
                element={<AdminUserDetails />}
              />
              <Route path="/admin/offers" element={<AdminOffers />} />
            </Route>
          </Route>
        </Routes>
      )}
    </BrowserRouter>
  );
}

export default App;


