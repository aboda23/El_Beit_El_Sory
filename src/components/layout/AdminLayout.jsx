import React, { useState } from 'react';
import { Outlet, Navigate, useLocation } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import AdminSidebar from './AdminSidebar';
import AdminHeader from './AdminHeader';
import ToastContainer from '../common/Toast';

export function AdminLayout() {
  const { isAdminAuthenticated } = useApp();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  // Route protection
  if (!isAdminAuthenticated) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  // Derive title from pathname
  const getPageTitle = () => {
    const path = location.pathname;
    if (path === '/admin') return 'Admin Dashboard';
    if (path.includes('/products')) return 'Product Catalog Management';
    if (path.includes('/categories')) return 'Menu Categories';
    if (path.includes('/offers')) return 'Timed Promotions & Deals';
    if (path.includes('/orders')) return 'Local Orders History';
    if (path.includes('/settings')) return 'Store & WhatsApp Settings';
    return 'Admin Panel';
  };

  return (
    <div className="min-h-screen bg-bg-primary text-text-primary flex">
      {/* Toast Notifications */}
      <ToastContainer />

      {/* Sidebar */}
      <AdminSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 lg:pl-64 rtl:lg:pl-0 rtl:lg:pr-64">
        <AdminHeader
          title={getPageTitle()}
          onOpenSidebar={() => setSidebarOpen(true)}
        />

        <main className="flex-1 p-4 sm:p-8 max-w-7xl w-full mx-auto space-y-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default AdminLayout;
