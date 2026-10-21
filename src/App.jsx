import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './context/AppContext';

// Layouts
import CustomerLayout from './components/layout/CustomerLayout';
import AdminLayout from './components/layout/AdminLayout';

// Customer Pages
import HomePage from './pages/HomePage';
import MenuPage from './pages/MenuPage';
import ProductPage from './pages/ProductPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import OffersPage from './pages/OffersPage';
import NotFoundPage from './pages/NotFoundPage';

// Admin Pages
import AdminLoginPage from './pages/admin/AdminLoginPage';
import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import AdminProductsPage from './pages/admin/AdminProductsPage';
import AdminCategoriesPage from './pages/admin/AdminCategoriesPage';
import AdminOffersPage from './pages/admin/AdminOffersPage';
import AdminOrdersPage from './pages/admin/AdminOrdersPage';
import AdminSettingsPage from './pages/admin/AdminSettingsPage';

export function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Routes>
          {/* Customer Facing Routes */}
          <Route path="/" element={<CustomerLayout />}>
            <Route index element={<HomePage />} />
            <Route path="menu" element={<MenuPage />} />
            <Route path="product/:id" element={<ProductPage />} />
            <Route path="cart" element={<CartPage />} />
            <Route path="checkout" element={<CheckoutPage />} />
            <Route path="offers" element={<OffersPage />} />
            {/* Catch-all for customer side */}
            <Route path="*" element={<NotFoundPage />} />
          </Route>

          {/* Admin Login (Outside admin layout) */}
          <Route path="/admin/login" element={<AdminLoginPage />} />

          {/* Admin Management Routes (Protected) */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboardPage />} />
            <Route path="products" element={<AdminProductsPage />} />
            <Route path="categories" element={<AdminCategoriesPage />} />
            <Route path="offers" element={<AdminOffersPage />} />
            <Route path="orders" element={<AdminOrdersPage />} />
            <Route path="settings" element={<AdminSettingsPage />} />
            {/* Catch-all inside admin redirects to dashboard */}
            <Route path="*" element={<Navigate to="/admin" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AppProvider>
  );
}

export default App;
