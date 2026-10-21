import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import MobileBottomNav from './MobileBottomNav';
import Footer from './Footer';
import ToastContainer from '../common/Toast';

export function CustomerLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-bg-primary text-text-primary selection:bg-accent selection:text-black">
      {/* Toast notifications */}
      <ToastContainer />

      {/* Main Header */}
      <Header />

      {/* Page Content */}
      <main className="flex-1 pb-20 md:pb-8">
        <Outlet />
      </main>

      {/* Footer */}
      <Footer />

      {/* Mobile Sticky Bottom Navigation */}
      <MobileBottomNav />
    </div>
  );
}

export default CustomerLayout;
