import React from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { ShoppingBag, Flame, Sparkles, Globe, LogIn, ShieldCheck } from 'lucide-react';
import logoImg from '../../assets/logo.jpg';

export function Header() {
  const { cartSummary, settings, lang, toggleLang, t, isAdminAuthenticated } = useApp();
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-40 w-full bg-bg-primary/95 backdrop-blur-md border-b border-border-dark">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 sm:h-20 flex items-center justify-between">
        {/* Brand / Logo */}
        <Link to="/" className="flex items-center gap-2.5 sm:gap-3 group">
          {/* Logo Image */}
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full overflow-hidden bg-bg-card border-2 border-accent/40 shadow-md shadow-accent/20 transition-transform group-hover:scale-105 shrink-0">
            <img
              src={logoImg}
              alt={settings?.restaurantName || 'مطعم البيت السوري'}
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-display font-extrabold text-base sm:text-lg tracking-tight text-text-primary">
                {lang === 'ar' ? (settings?.restaurantName || 'مطعم البيت السوري') : (settings?.restaurantNameEn || 'Al Beit Al Souri')}
              </span>
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-accent/15 text-accent border border-accent/20 hidden xs:inline-block">
                {t('studentTag', 'جامعة سيناء')}
              </span>
            </div>
            <p className="text-[11px] text-text-secondary font-medium tracking-wide truncate max-w-[190px] sm:max-w-xs">
              {lang === 'ar' ? 'القنطرة شرق - أمام جامعة سيناء' : (settings?.branchAddressEn || 'El Qantara Sharq • Sinai Uni')}
            </p>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-1 bg-bg-secondary/60 p-1.5 rounded-2xl border border-border-dark">
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              `px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                isActive
                  ? 'bg-accent text-black shadow-sm'
                  : 'text-text-secondary hover:text-text-primary hover:bg-bg-card'
              }`
            }
          >
            {t('navHome', 'Home')}
          </NavLink>
          <NavLink
            to="/menu"
            className={({ isActive }) =>
              `px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                isActive
                  ? 'bg-accent text-black shadow-sm'
                  : 'text-text-secondary hover:text-text-primary hover:bg-bg-card'
              }`
            }
          >
            {t('navMenu', 'Menu')}
          </NavLink>
          <NavLink
            to="/offers"
            className={({ isActive }) =>
              `px-4 py-2 rounded-xl text-sm font-semibold transition-all flex items-center gap-1.5 ${
                isActive
                  ? 'bg-accent text-black shadow-sm'
                  : 'text-text-secondary hover:text-text-primary hover:bg-bg-card'
              }`
            }
          >
            <Sparkles className="w-3.5 h-3.5 text-accent" />
            <span>{t('navOffers', 'Offers')}</span>
          </NavLink>
        </nav>

        {/* Actions (Language Switcher, Login, Order Now & Cart) */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          {/* Language Toggle Button */}
          <button
            type="button"
            onClick={toggleLang}
            className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-xl text-xs font-bold bg-bg-secondary hover:bg-bg-card border border-border-dark text-text-primary hover:border-accent transition-all active:scale-95"
            title={lang === 'ar' ? 'Switch to English' : 'التحويل إلى العربية'}
          >
            <Globe className="w-3.5 h-3.5 text-accent" />
            <span>{lang === 'ar' ? 'EN' : 'عربي'}</span>
          </button>

          {/* Login / Admin Dashboard Button */}
          <Link
            to={isAdminAuthenticated ? "/admin" : "/admin/login"}
            className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-xl text-xs font-bold bg-bg-secondary hover:bg-bg-card border border-border-dark text-text-primary hover:border-accent hover:text-accent transition-all active:scale-95"
            title={isAdminAuthenticated ? (lang === 'ar' ? 'لوحة تحكم الإدارة' : 'Admin Dashboard') : (lang === 'ar' ? 'تسجيل الدخول' : 'Admin Login')}
          >
            {isAdminAuthenticated ? (
              <ShieldCheck className="w-3.5 h-3.5 text-accent" />
            ) : (
              <LogIn className="w-3.5 h-3.5 text-accent" />
            )}
            <span className="hidden xs:inline-block">
              {isAdminAuthenticated
                ? (lang === 'ar' ? 'الإدارة' : 'Dashboard')
                : (lang === 'ar' ? 'تسجيل الدخول' : 'Login')}
            </span>
          </Link>

          {/* Order Now CTA (Desktop only) */}
          <button
            type="button"
            onClick={() => navigate('/menu')}
            className="hidden sm:inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider bg-bg-secondary hover:bg-bg-card border border-border-dark hover:border-accent text-accent transition-all"
          >
            <Flame className="w-3.5 h-3.5" />
            <span>{t('orderNow', 'Order Now')}</span>
          </button>

          {/* Cart Icon with Counter Badge */}
          <Link
            to="/cart"
            className="relative p-2.5 rounded-xl bg-bg-card hover:bg-bg-cardHover border border-border-dark text-text-primary transition-all active:scale-95"
            aria-label={`View cart with ${cartSummary.totalItems} items`}
          >
            <ShoppingBag className="w-5 h-5 text-text-primary" />
            {cartSummary.totalItems > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-accent text-black font-extrabold text-[11px] w-5 h-5 rounded-full flex items-center justify-center shadow-md animate-fade-in ring-2 ring-bg-primary">
                {cartSummary.totalItems}
              </span>
            )}
          </Link>
        </div>
      </div>
    </header>
  );
}

export default Header;
