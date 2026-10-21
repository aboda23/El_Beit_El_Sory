import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import logoImg from '../../assets/logo.jpg';
import {
  LayoutDashboard,
  Utensils,
  FolderTree,
  Tag,
  ShoppingBag,
  Settings,
  LogOut,
  ExternalLink,
  X,
} from 'lucide-react';

export function AdminSidebar({ isOpen, onClose }) {
  const { logoutAdmin, settings, t, isRTL } = useApp();
  const navigate = useNavigate();

  const navLinks = [
    { to: '/admin', label: t('dashboard', 'Dashboard'), icon: LayoutDashboard, end: true },
    { to: '/admin/products', label: t('products', 'Products'), icon: Utensils, end: false },
    { to: '/admin/categories', label: t('categories', 'Categories'), icon: FolderTree, end: false },
    { to: '/admin/offers', label: t('offers', 'Offers'), icon: Tag, end: false },
    { to: '/admin/orders', label: t('orders', 'Orders'), icon: ShoppingBag, end: false },
    { to: '/admin/settings', label: t('settings', 'Settings'), icon: Settings, end: false },
  ];

  const handleLogout = () => {
    logoutAdmin();
    navigate('/admin/login');
  };

  const closedTranslate = isRTL ? 'translate-x-full' : '-translate-x-full';

  return (
    <>
      {/* Mobile Drawer Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40 lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 z-50 w-64 bg-bg-secondary border-border-dark flex flex-col justify-between transition-transform duration-250 lg:translate-x-0 ${
          isRTL ? 'right-0 border-l' : 'left-0 border-r'
        } ${isOpen ? 'translate-x-0' : closedTranslate}`}
      >
        <div>
          {/* Top Branding */}
          <div className="h-16 sm:h-20 px-5 flex items-center justify-between border-b border-border-dark">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-full overflow-hidden bg-bg-card border border-accent/40 shrink-0">
                <img
                  src={logoImg}
                  alt={settings?.restaurantName || 'مطعم البيت السوري'}
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <span className="font-display font-black text-sm text-text-primary block leading-tight">
                  {isRTL ? (settings?.restaurantName || 'مطعم البيت السوري') : (settings?.restaurantNameEn || 'Al Beit Al Souri')}
                </span>
                <span className="text-[10px] font-bold text-accent uppercase tracking-wider">
                  {t('adminPanel', 'Admin Panel')}
                </span>
              </div>
            </div>
            {/* Mobile Close Button */}
            <button
              type="button"
              onClick={onClose}
              className="lg:hidden p-1.5 rounded-lg text-text-muted hover:text-text-primary"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="p-3 space-y-1">
            {navLinks.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.end}
                  onClick={() => onClose?.()}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                      isActive
                        ? 'bg-accent text-black font-bold shadow-md shadow-accent/20'
                        : 'text-text-secondary hover:text-text-primary hover:bg-bg-card'
                    }`
                  }
                >
                  <Icon className="w-4 h-4 shrink-0 stroke-[2.2]" />
                  <span>{item.label}</span>
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* Bottom Actions */}
        <div className="p-3 border-t border-border-dark space-y-2">
          {/* View Customer Store */}
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between px-3.5 py-2 rounded-xl text-xs text-text-secondary hover:text-text-primary hover:bg-bg-card transition-colors"
          >
            <span className="flex items-center gap-2">
              <ExternalLink className="w-3.5 h-3.5 text-accent" />
              <span>{t('viewStore', 'Customer Store')}</span>
            </span>
            <span className="text-[10px] bg-bg-card px-1.5 py-0.5 rounded text-text-muted border border-border-dark">
              ↗
            </span>
          </a>

          {/* Logout */}
          <button
            type="button"
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>{t('signOut', 'Sign Out')}</span>
          </button>
        </div>
      </aside>
    </>
  );
}

export default AdminSidebar;
