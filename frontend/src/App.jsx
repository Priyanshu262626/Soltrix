import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ToastProvider } from './components/common/Toast';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import Home from './pages/home/Home';
import Shop from './pages/products/Shop';
import ProductDetails from './pages/products/ProductDetails';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Cart from './pages/cart/Cart';
import Checkout from './pages/checkout/Checkout';
import OrderSuccess from './pages/checkout/OrderSuccess';
import Orders from './pages/checkout/Orders';
import Wishlist from './pages/wishlist/Wishlist';
import Profile from './pages/profile/Profile';
import About from './pages/about/About';

// Admin Imports
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminProductManagement from './pages/admin/AdminProductManagement';
import AdminAddProduct from './pages/admin/AdminAddProduct';
import AdminEditProduct from './pages/admin/AdminEditProduct';
import AdminOrderManagement from './pages/admin/AdminOrderManagement';

import { ProtectedRoute, AdminRoute } from './components/common/ProtectedRoute';
import './App.css';

function MainAppLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-white text-black">
      <Navbar />
      <main className="flex-grow">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/product/:id" element={<ProductDetails />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/about" element={<About />} />

          {/* Authenticated Customer Routes */}
          <Route 
            path="/cart" 
            element={
              <ProtectedRoute>
                <Cart />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/checkout" 
            element={
              <ProtectedRoute>
                <Checkout />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/order-success" 
            element={
              <ProtectedRoute>
                <OrderSuccess />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/orders" 
            element={
              <ProtectedRoute>
                <Orders />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/wishlist" 
            element={
              <ProtectedRoute>
                <Wishlist />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/profile" 
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            } 
          />


          {/* Administrative Routes */}
          <Route 
            path="/admin" 
            element={
              <AdminRoute>
                <AdminDashboard />
              </AdminRoute>
            } 
          />
          <Route 
            path="/admin/products" 
            element={
              <AdminRoute>
                <AdminProductManagement />
              </AdminRoute>
            } 
          />
          <Route 
            path="/admin/add-product" 
            element={
              <AdminRoute>
                <AdminAddProduct />
              </AdminRoute>
            } 
          />
          <Route 
            path="/admin/edit-product/:id" 
            element={
              <AdminRoute>
                <AdminEditProduct />
              </AdminRoute>
            } 
          />
          <Route 
            path="/admin/orders" 
            element={
              <AdminRoute>
                <AdminOrderManagement />
              </AdminRoute>
            } 
          />

          {/* Fallback redirection */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <ToastProvider>
          <MainAppLayout />
        </ToastProvider>
      </AuthProvider>
    </Router>
  );
}
